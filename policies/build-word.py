#!/usr/bin/env python3
"""Build Word (.docx) copies of every policy, plus one combined manual.

Usage (from the repo root):  python3 policies/build-word.py
Needs pandoc and python-docx. Output goes to policies/word/.
"""
import pathlib
import subprocess

here = pathlib.Path(__file__).resolve().parent
out = here / "word"
out.mkdir(exist_ok=True)

# A4 reference document (pandoc's default is US Letter).
ref = out / "_reference.docx"
subprocess.run(["pandoc", "-o", str(ref), "--print-default-data-file", "reference.docx"], check=True)
from docx import Document  # python-docx
from docx.shared import Mm
d = Document(str(ref))
for s in d.sections:
    s.page_width, s.page_height = Mm(210), Mm(297)
    s.left_margin = s.right_margin = s.top_margin = s.bottom_margin = Mm(20)
d.save(str(ref))
REF = ["--reference-doc", str(ref)]

policies = sorted(p for p in here.glob("[0-9][0-9]-*.md"))
for md in policies:
    subprocess.run(
        ["pandoc", str(md), "-f", "gfm", *REF, "-o", str(out / (md.stem + ".docx"))],
        check=True,
    )

# One combined manual, index first, each policy on a new page.
combined = here / "word" / "_combined.md"
parts = [(here / "README.md").read_text(encoding="utf-8")]
parts += [p.read_text(encoding="utf-8") for p in policies]
combined.write_text("\n\n```{=openxml}\n<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>\n```\n\n".join(parts),
                    encoding="utf-8")
subprocess.run(
    ["pandoc", str(combined), "-f", "markdown+pipe_tables+task_lists+raw_attribute", "--toc", *REF,
     "--metadata", "title=Kirkcaldy Dental & Implant Clinic – Practice Policy Manual",
     "-o", str(out / "Kirkcaldy-Dental-Policy-Manual.docx")],
    check=True,
)
combined.unlink()
ref.unlink()
print(f"Built {len(policies)} policies + combined manual in {out}")
