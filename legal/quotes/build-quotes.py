#!/usr/bin/env python3
"""Build the branded Quotes Summary (.docx) from quotes-summary.md, reusing the policy branding."""
import importlib.util, pathlib, re
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Mm, Pt

root = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("bw", root / "policies" / "build-word.py")
bw = importlib.util.module_from_spec(spec); spec.loader.exec_module(bw)
here = pathlib.Path(__file__).resolve().parent
src = (here / "quotes-summary.md").read_text(encoding="utf-8")
src = re.sub(r"^---.*?---\n", "", src, flags=re.S)  # drop YAML title block
ref = here / "_ref.docx"; bw.make_reference(ref)
dst = here / "Kirkcaldy-Quotes-Summary.docx"
bw.pandoc(src, dst, ref)
d = Document(str(dst))
bw.style_tables(d)

# Title block at the top
body = d.element.body
first = body[0]
def para(text, size, color, font, bold=False, italic=False, after=4, align=WD_ALIGN_PARAGRAPH.LEFT):
    p = d.add_paragraph(); p.alignment = align
    r = p.add_run(text); r.font.name, r.font.size, r.font.color.rgb = font, Pt(size), bw.rgb(color)
    r.font.bold, r.font.italic = bold, italic
    p.paragraph_format.space_after = Pt(after)
    return p
t = para("Quotes Summary", 26, bw.GOLD, bw.HEAD, after=2)
s = para("Fire safety · Legionella · PAT · Radiation · Oxygen · Equipment · Insurance · Asbestos", 10.5, bw.CHAR, bw.BODY, after=2)
m = para("Compiled from the info@kirkcaldydental.co.uk inbox · up to 12 November 2026 · Prices exclude VAT unless stated",
         8.5, bw.GOLD, bw.BODY, italic=True, after=10)
bw.border_bottom(m._p.get_or_add_pPr(), bw.LIGHT, 8, 8)
for p in (t, s, m):
    first.addprevious(p._p)

# Header / footer
for sec in d.sections:
    sec.page_width, sec.page_height = Mm(210), Mm(297)
    sec.left_margin = sec.right_margin = Mm(20)
    sec.top_margin, sec.bottom_margin = Mm(30), Mm(22)
    sec.header_distance, sec.footer_distance = Mm(10), Mm(10)
    p = sec.header.paragraphs[0]; p.text = ""
    bw.tab_stop_right(p, 170)
    p.add_run().add_picture(str(bw.LOGO_H), height=Mm(11))
    r = p.add_run("\tQUOTES SUMMARY")
    r.font.name, r.font.size, r.font.color.rgb, r.font.bold = bw.BODY, Pt(8), bw.rgb(bw.GOLD), True
    bw.border_bottom(p._p.get_or_add_pPr(), bw.LIGHT, 6, 6)
    f = sec.footer.paragraphs[0]; f.text = ""
    bw.tab_stop_right(f, 170)
    bw.border_bottom(f._p.get_or_add_pPr(), bw.LIGHT, 6, 6, side="top")
    r = f.add_run(f"Lang Toun Smiles Ltd · {bw.PRACTICE} · {bw.ADDRESS}")
    r.font.size, r.font.color.rgb = Pt(7.5), bw.rgb(bw.CHAR)
    r = f.add_run("\tPage "); r.font.size, r.font.color.rgb = Pt(7.5), bw.rgb(bw.CHAR)
    for code, after in (("PAGE", " of "), ("NUMPAGES", "")):
        fr = bw.field(f, code); fr.font.size, fr.font.color.rgb = Pt(7.5), bw.rgb(bw.CHAR)
        if after:
            r = f.add_run(after); r.font.size, r.font.color.rgb = Pt(7.5), bw.rgb(bw.CHAR)
bw.update_fields_on_open(d)
d.core_properties.title = "Kirkcaldy Dental & Implant Clinic – Quotes Summary"
d.core_properties.author = bw.PRACTICE
d.save(str(dst)); ref.unlink()
print("built", dst)
