"""Crop each page of a PDF to exactly W x H mm from its top-left corner; set TrimBox/BleedBox.
Usage: python3 crop.py file.pdf W_mm H_mm bleed_mm"""
import sys, pikepdf
f, W, H, B = sys.argv[1], *map(float, sys.argv[2:5])
pt = 72 / 25.4
pdf = pikepdf.open(f, allow_overwriting_input=True)
for pg in pdf.pages:
    x0, y0, x1, y1 = map(float, pg.mediabox)
    box = [x0, y1 - H * pt, x0 + W * pt, y1]
    pg.mediabox = pg.cropbox = pg.bleedbox = box
    pg.trimbox = [box[0] + B * pt, box[1] + B * pt, box[2] - B * pt, box[3] - B * pt]
pdf.save(f)
print("cropped", f, W, "x", H, "mm")
