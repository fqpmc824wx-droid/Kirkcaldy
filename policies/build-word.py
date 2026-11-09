#!/usr/bin/env python3
"""Build branded Word (.docx) copies of every policy, plus one combined manual.

Usage (from the repo root):  python3 policies/build-word.py
Needs pandoc and python-docx. Output goes to policies/word/.

Branding (BRAND.md): deep gold #8E6B2E, light gold #D9BD82, cream #F6F2EA,
charcoal #30363B, ink #262B30. Logo: policies/assets/*-deepgold.png
(recoloured from brand/logo). Fonts are ones every copy of Word has:
Georgia for headings, Calibri for text.
"""
import datetime
import pathlib
import re
import subprocess

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Mm, Pt, RGBColor

here = pathlib.Path(__file__).resolve().parent
out = here / "word"
out.mkdir(exist_ok=True)
assets = here / "assets"
LOGO_H = assets / "logo-horizontal-deepgold.png"
LOGO_S = assets / "logo-stacked-deepgold.png"

GOLD, LIGHT, CREAM, CHAR, INK = "8E6B2E", "D9BD82", "F6F2EA", "30363B", "262B30"
HEAD, BODY = "Georgia", "Calibri"
PRACTICE = "Kirkcaldy Dental & Implant Clinic"
ADDRESS = "23–25 Tolbooth Street, Kirkcaldy KY1 1RW"


def rgb(h):
    return RGBColor.from_string(h)


# ---------------------------------------------------------------- reference doc
def make_reference(path):
    subprocess.run(["pandoc", "-o", str(path), "--print-default-data-file", "reference.docx"], check=True)
    d = Document(str(path))
    by_name = {s.name: s for s in d.styles}

    class _St:  # python-docx can't look up pandoc's "Heading 1" by name
        def __getitem__(self, k):
            return by_name[k]

        def __iter__(self):
            return iter(by_name.values())
    st = _St()

    def font(s, name, size, color, bold=None, italic=None):
        s.font.name, s.font.size, s.font.color.rgb = name, Pt(size), rgb(color)
        rpr = s.element.get_or_add_rPr()
        rf = rpr.find(qn("w:rFonts"))
        if rf is None:
            rf = OxmlElement("w:rFonts")
            rpr.insert(0, rf)
        for a in ("w:ascii", "w:hAnsi", "w:cs", "w:eastAsia"):
            rf.set(qn(a), name)
        for a in ("w:asciiTheme", "w:hAnsiTheme", "w:cstheme", "w:eastAsiaTheme"):
            if rf.get(qn(a)) is not None:
                del rf.attrib[qn(a)]
        if bold is not None:
            s.font.bold = bold
        if italic is not None:
            s.font.italic = italic

    for name in ("Normal", "Body Text", "First Paragraph", "Compact"):
        if name in [s.name for s in st]:
            font(st[name], BODY, 10.5, INK)
            pf = st[name].paragraph_format
            pf.space_after = Pt(5) if name != "Compact" else Pt(2)
            pf.space_before = Pt(0)
            pf.line_spacing = 1.15
    font(st["Heading 1"], HEAD, 22, GOLD, bold=False)
    font(st["Heading 2"], HEAD, 14, CHAR, bold=True)
    font(st["Heading 3"], BODY, 11.5, GOLD, bold=True)
    for lvl in (4, 5):
        if f"Heading {lvl}" in [s.name for s in st]:
            font(st[f"Heading {lvl}"], BODY, 10.5, CHAR, bold=True, italic=False)
    st["Heading 1"].paragraph_format.space_before = Pt(0)
    st["Heading 1"].paragraph_format.space_after = Pt(10)
    border_bottom(st["Heading 1"].element.get_or_add_pPr(), GOLD, 12, 6)
    st["Heading 2"].paragraph_format.space_before = Pt(16)
    st["Heading 2"].paragraph_format.space_after = Pt(6)
    st["Heading 2"].paragraph_format.keep_with_next = True
    st["Heading 3"].paragraph_format.space_before = Pt(10)
    st["Heading 3"].paragraph_format.space_after = Pt(3)
    if "Hyperlink" in [s.name for s in st]:
        st["Hyperlink"].font.color.rgb = rgb(GOLD)
    if "Title" in [s.name for s in st]:
        font(st["Title"], HEAD, 30, GOLD)
    for s in d.sections:
        s.page_width, s.page_height = Mm(210), Mm(297)
        s.left_margin = s.right_margin = Mm(20)
        s.top_margin, s.bottom_margin = Mm(30), Mm(22)
        s.header_distance, s.footer_distance = Mm(10), Mm(10)
    d.save(str(path))


# ---------------------------------------------------------------- xml helpers
def border_bottom(ppr, color, size, space, side="bottom"):
    pbdr = ppr.find(qn("w:pBdr"))
    if pbdr is None:
        pbdr = OxmlElement("w:pBdr")
        ppr.append(pbdr)
    b = OxmlElement(f"w:{side}")
    b.set(qn("w:val"), "single")
    b.set(qn("w:sz"), str(size))
    b.set(qn("w:space"), str(space))
    b.set(qn("w:color"), color)
    pbdr.append(b)


def shade(cell, fill):
    tcpr = cell._tc.get_or_add_tcPr()
    for old in tcpr.findall(qn("w:shd")):
        tcpr.remove(old)
    s = OxmlElement("w:shd")
    s.set(qn("w:val"), "clear")
    s.set(qn("w:color"), "auto")
    s.set(qn("w:fill"), fill)
    tcpr.append(s)


def cell_margins(table, top=60, bottom=60, left=100, right=100):
    tblpr = table._tbl.tblPr
    m = OxmlElement("w:tblCellMar")
    for side, v in (("top", top), ("left", left), ("bottom", bottom), ("right", right)):
        e = OxmlElement(f"w:{side}")
        e.set(qn("w:w"), str(v))
        e.set(qn("w:type"), "dxa")
        m.append(e)
    for old in tblpr.findall(qn("w:tblCellMar")):
        tblpr.remove(old)
    tblpr.append(m)


def table_borders(table, color=LIGHT, size=4):
    tblpr = table._tbl.tblPr
    for old in tblpr.findall(qn("w:tblBorders")):
        tblpr.remove(old)
    b = OxmlElement("w:tblBorders")
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{side}")
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), str(size))
        e.set(qn("w:space"), "0")
        e.set(qn("w:color"), color)
        b.append(e)
    tblpr.append(b)


def full_width(table):
    tblpr = table._tbl.tblPr
    for old in tblpr.findall(qn("w:tblW")):
        tblpr.remove(old)
    w = OxmlElement("w:tblW")
    w.set(qn("w:w"), "5000")
    w.set(qn("w:type"), "pct")
    tblpr.append(w)


def col_widths(table, widths):
    grid = table._tbl.tblGrid
    for gc, w in zip(grid.findall(qn("w:gridCol")), widths):
        gc.set(qn("w:w"), str(int(w.twips)))
    for r in table.rows:
        for c, w in zip(r.cells, widths):
            c.width = w


def repeat_header(row):
    trpr = row._tr.get_or_add_trPr()
    e = OxmlElement("w:tblHeader")
    e.set(qn("w:val"), "true")
    trpr.append(e)


def row_height(row, mm):
    trpr = row._tr.get_or_add_trPr()
    h = OxmlElement("w:trHeight")
    h.set(qn("w:val"), str(int(mm * 56.7)))
    h.set(qn("w:hRule"), "atLeast")
    trpr.append(h)


def set_cell_text_style(cell, color=None, bold=None, size=None):
    for p in cell.paragraphs:
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.space_before = Pt(0)
        for r in p.runs:
            if color:
                r.font.color.rgb = rgb(color)
            if bold is not None:
                r.font.bold = bold
            if size:
                r.font.size = Pt(size)


def field(paragraph, code):
    r = paragraph.add_run()
    for kind, text in (("begin", None), (None, code), ("separate", None), (None, None), ("end", None)):
        if kind:
            e = OxmlElement("w:fldChar")
            e.set(qn("w:fldCharType"), kind)
            r._r.append(e)
        elif text:
            e = OxmlElement("w:instrText")
            e.set(qn("xml:space"), "preserve")
            e.text = text
            r._r.append(e)
        else:
            t = OxmlElement("w:t")
            t.text = "1"
            r._r.append(t)
    return r


def tab_stop_right(paragraph, mm):
    ppr = paragraph._p.get_or_add_pPr()
    tabs = OxmlElement("w:tabs")
    t = OxmlElement("w:tab")
    t.set(qn("w:val"), "right")
    t.set(qn("w:pos"), str(int(mm * 56.7)))
    tabs.append(t)
    ppr.append(tabs)


# ---------------------------------------------------------------- styling a built doc
def style_tables(d):
    for i, t in enumerate(d.tables):
        full_width(t)
        table_borders(t)
        cell_margins(t)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        rows = t.rows
        if not rows:
            continue
        header_text = "".join(c.text.strip() for c in rows[0].cells)
        is_meta = header_text == "" and len(rows[0].cells) == 2
        if is_meta:  # the "| | |" policy details table: drop empty header, label column
            t._tbl.remove(rows[0]._tr)
            col_widths(t, [Mm(38), Mm(132)])
            for r in t.rows:
                shade(r.cells[0], CREAM)
                set_cell_text_style(r.cells[0], color=GOLD, bold=True, size=9.5)
                set_cell_text_style(r.cells[1], size=9.5)
            continue
        repeat_header(rows[0])
        for c in rows[0].cells:
            shade(c, GOLD)
            set_cell_text_style(c, color="FFFFFF", bold=True, size=9.5)
        sign_off = [c.text.strip().lower() for c in rows[0].cells][:2] == ["name", "role"] and \
            "signature" in header_text.lower()
        for n, r in enumerate(t.rows[1:], 1):
            for c in r.cells:
                set_cell_text_style(c, size=9.5)
                if n % 2 == 0:
                    shade(c, CREAM)
            if sign_off:
                row_height(r, 10)


def style_headings(d):
    for p in d.paragraphs:
        s = p.style.name if p.style is not None else ""
        if s == "Heading 2" and p.text.strip().lower().startswith("staff sign-off"):
            p.paragraph_format.page_break_before = False


def header_footer(d, title):
    for s in d.sections:
        s.page_width, s.page_height = Mm(210), Mm(297)
        s.left_margin = s.right_margin = Mm(20)
        s.top_margin, s.bottom_margin = Mm(30), Mm(22)
        s.header_distance, s.footer_distance = Mm(10), Mm(10)
        h = s.header
        h.is_linked_to_previous = False
        p = h.paragraphs[0]
        p.text = ""
        tab_stop_right(p, 170)
        p.add_run().add_picture(str(LOGO_H), height=Mm(11))
        r = p.add_run("\tPRACTICE POLICY")
        r.font.name, r.font.size, r.font.color.rgb, r.font.bold = BODY, Pt(8), rgb(GOLD), True
        border_bottom(p._p.get_or_add_pPr(), LIGHT, 6, 6)

        f = s.footer
        f.is_linked_to_previous = False
        p = f.paragraphs[0]
        p.text = ""
        tab_stop_right(p, 170)
        border_bottom(p._p.get_or_add_pPr(), LIGHT, 6, 6, side="top")
        r = p.add_run(f"{PRACTICE} · {ADDRESS}")
        r.font.size, r.font.color.rgb = Pt(7.5), rgb(CHAR)
        r = p.add_run("\tPage ")
        r.font.size, r.font.color.rgb = Pt(7.5), rgb(CHAR)
        for code, after in (("PAGE", " of "), ("NUMPAGES", "")):
            fr = field(p, code)
            fr.font.size, fr.font.color.rgb = Pt(7.5), rgb(CHAR)
            if after:
                r = p.add_run(after)
                r.font.size, r.font.color.rgb = Pt(7.5), rgb(CHAR)
        if title:
            p2 = f.add_paragraph()
            r = p2.add_run(title + " · Uncontrolled when printed – check the policy folder for the current version")
            r.font.size, r.font.color.rgb, r.font.italic = Pt(7), rgb(GOLD), True


def update_fields_on_open(d):
    settings = d.settings.element
    e = OxmlElement("w:updateFields")
    e.set(qn("w:val"), "true")
    settings.append(e)


def add_cover(d):
    """Insert a branded cover page at the very start of the combined manual."""
    body = d.element.body
    first = body[0]
    paras = []

    def para(text="", size=11, color=INK, font=BODY, bold=False, italic=False, before=0, after=0,
             align=WD_ALIGN_PARAGRAPH.CENTER):
        p = d.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before, p.paragraph_format.space_after = Pt(before), Pt(after)
        if text:
            r = p.add_run(text)
            r.font.name, r.font.size, r.font.color.rgb = font, Pt(size), rgb(color)
            r.font.bold, r.font.italic = bold, italic
        paras.append(p)
        return p

    p = para(before=60, after=30)
    p.add_run().add_picture(str(LOGO_S), width=Mm(95))
    p = para("PRACTICE POLICY MANUAL", 26, GOLD, HEAD, before=10, after=6)
    border_bottom(p._p.get_or_add_pPr(), LIGHT, 8, 10)
    para("Policies and procedures based on the Scottish Dental Practice Support Manual", 12, CHAR, BODY,
         italic=True, before=10, after=2)
    para("(SDCEP / NHS Education for Scotland)", 10, CHAR, BODY, after=60)
    para(PRACTICE, 12, INK, HEAD, bold=True, after=2)
    para(ADDRESS, 10.5, INK, after=2)
    para("NHS Fife · info@kirkcaldydental.co.uk · kirkcaldydental.co.uk", 10.5, INK, after=40)
    para(f"Version 1.0 – draft for adoption · {datetime.date.today():%B %Y}", 9.5, GOLD, BODY, bold=True)
    p = para()
    p.add_run().add_break(WD_BREAK.PAGE)
    for p in paras:
        first.addprevious(p._p)


# ---------------------------------------------------------------- markdown prep
LINK = re.compile(r"\[([^\]]+)\]\((\d\d-[a-z0-9-]+)\.md\)")
BARE = re.compile(r"(?<![/\w-])(\d\d)-[a-z0-9-]+\.md\b")
TITLES = {p.name[:2]: p.read_text(encoding="utf-8").splitlines()[0].lstrip("# ").strip()
          for p in here.glob("[0-9][0-9]-*.md")}


def _bare(m):
    n = m.group(1)
    return f"Policy {n} – {TITLES[n]}" if n in TITLES else m.group(0)


def prep(md_text, combined):
    md_text = re.sub(r"`(\d\d-[a-z0-9-]+\.md)`", r"\1", md_text)
    if combined:
        md_text = LINK.sub(r"\1", md_text)
    else:
        md_text = LINK.sub(r"[\1](\2.docx)", md_text)
    md_text = BARE.sub(_bare, md_text)
    md_text = md_text.replace("- [ ] ", "- ☐ ").replace("- [x] ", "- ☑ ")
    return md_text


def pandoc(md_text, dst, ref, extra=()):
    subprocess.run(["pandoc", "-f", "gfm+raw_attribute" if extra else "gfm", "--reference-doc", str(ref),
                    *extra, "-o", str(dst)], input=md_text.encode("utf-8"), check=True)


def main():
    ref = out / "_reference.docx"
    make_reference(ref)
    policies = sorted(here.glob("[0-9][0-9]-*.md"))
    for md in policies:
        text = md.read_text(encoding="utf-8")
        title = text.splitlines()[0].lstrip("# ").strip()
        dst = out / (md.stem + ".docx")
        pandoc(prep(text, False), dst, ref)
        d = Document(str(dst))
        style_tables(d)
        style_headings(d)
        header_footer(d, f"{md.stem[:2]} {title}")
        d.save(str(dst))

    # Combined manual: cover, policy list, then each policy on a new page.
    readme = (here / "README.md").read_text(encoding="utf-8")
    readme = re.sub(r"\nWord versions of every policy.*?\n.*?\n", "\n", readme, flags=re.S)
    readme = readme.replace("# Kirkcaldy Dental & Implant Clinic – Practice Policies", "# About this manual")
    readme = re.sub(r"\[([^\]]+)\]\(word/\)", r"\1", readme)
    brk = '\n\n```{=openxml}\n<w:p><w:r><w:br w:type="page"/></w:r></w:p>\n```\n\n'
    parts = [prep(readme, True)] + [prep(p.read_text(encoding="utf-8"), True) for p in policies]
    dst = out / "Kirkcaldy-Dental-Policy-Manual.docx"
    pandoc(brk.join(parts), dst, ref, extra=["--metadata", "title=Kirkcaldy Dental Policy Manual"])
    d = Document(str(dst))
    # drop pandoc's title paragraph (the cover replaces it)
    for p in list(d.paragraphs[:2]):
        if p.style is not None and p.style.name == "Title":
            p._p.getparent().remove(p._p)
    style_tables(d)
    header_footer(d, "Practice Policy Manual")
    add_cover(d)
    s0 = d.sections[0]
    s0.different_first_page_header_footer = True  # no header/footer on the cover
    s0.first_page_header.is_linked_to_previous = False
    s0.first_page_footer.is_linked_to_previous = False
    d.core_properties.title = "Kirkcaldy Dental & Implant Clinic – Practice Policy Manual"
    d.core_properties.author = PRACTICE
    d.save(str(dst))
    ref.unlink()
    print(f"Built {len(policies)} policies + combined manual in {out}")


if __name__ == "__main__":
    main()
