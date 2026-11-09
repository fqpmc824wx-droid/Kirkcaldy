#!/usr/bin/env python3
"""Build Word (.docx) copies of every policy, plus one combined manual.

Usage (from the repo root):  python3 policies/build-word.py
Needs pandoc. Output goes to policies/word/.
"""
import pathlib
import subprocess

here = pathlib.Path(__file__).resolve().parent
out = here / "word"
out.mkdir(exist_ok=True)

policies = sorted(p for p in here.glob("[0-9][0-9]-*.md"))
for md in policies:
    subprocess.run(
        ["pandoc", str(md), "-f", "gfm", "-o", str(out / (md.stem + ".docx"))],
        check=True,
    )

# One combined manual, index first, each policy on a new page.
combined = here / "word" / "_combined.md"
parts = [(here / "README.md").read_text(encoding="utf-8")]
parts += [p.read_text(encoding="utf-8") for p in policies]
combined.write_text("\n\n```{=openxml}\n<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>\n```\n\n".join(parts),
                    encoding="utf-8")
subprocess.run(
    ["pandoc", str(combined), "-f", "markdown+pipe_tables+task_lists+raw_attribute", "--toc",
     "--metadata", "title=Kirkcaldy Dental & Implant Clinic – Practice Policy Manual",
     "-o", str(out / "Kirkcaldy-Dental-Policy-Manual.docx")],
    check=True,
)
combined.unlink()
print(f"Built {len(policies)} policies + combined manual in {out}")
