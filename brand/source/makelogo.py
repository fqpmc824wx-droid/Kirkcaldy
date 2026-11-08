"""Rebuild the Kirkcaldy Dental & Implant Clinic logo as clean vector SVG.

Text is converted to outlines so the SVG needs no fonts installed.
Usage: python3 makelogo.py <fonts_dir> <out_dir>
Current logo (K sitting on the D): KD_STYLE=overlap K_SX=1.0 D_DX=0.62 D_DY=0.115 KNOCK=0.03 [K_FILL=#262B30 light / #F4EDE3 dark]
Fonts: Cormorant Garamond 700 (cormorantb.ttf), Cinzel 600 (cinzel600.ttf), Lato 700 (lato.ttf).
"""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FD, OUT = sys.argv[1], sys.argv[2]
GOLD = "#C3A363"


class Face:
    def __init__(self, path):
        self.f = TTFont(path)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.upm = self.f["head"].unitsPerEm
        self.hmtx = self.f["hmtx"]

    def glyph(self, ch):
        return self.cmap[ord(ch)]

    def adv(self, ch):
        return self.hmtx[self.glyph(ch)][0]

    def bounds(self, ch):
        bp = BoundsPen(self.gs)
        self.gs[self.glyph(ch)].draw(bp)
        return bp.bounds  # xmin, ymin, xmax, ymax in font units

    def path(self, ch, x, baseline, size, sx=1.0):
        """SVG path for one glyph with its origin at (x, baseline), cap size in px."""
        s = size / self.upm
        pen = SVGPathPen(self.gs)
        tp = TransformPen(pen, (s * sx, 0, 0, -s, x, baseline))
        self.gs[self.glyph(ch)].draw(tp)
        return pen.getCommands()

    def text(self, txt, size, tracking=0.0):
        """Return (list of (ch, x_offset)), total width in px. tracking in em."""
        s = size / self.upm
        out, x = [], 0.0
        for i, ch in enumerate(txt):
            out.append((ch, x))
            x += self.adv(ch) * s
            if i < len(txt) - 1:
                x += tracking * size
        # trim: width = from first glyph left ink to last glyph right ink
        return out, x

    def ink_width(self, txt, size, tracking=0.0):
        s = size / self.upm
        layout, _ = self.text(txt, size, tracking)
        first = self.bounds(txt[0])
        last = self.bounds(txt[-1])
        left = layout[0][1] + first[0] * s
        right = layout[-1][1] + last[2] * s
        return left, right


def draw_text(face, txt, size, tracking, cx, baseline):
    """Centre the ink of txt on cx. Returns (svg_d, left, right)."""
    left, right = face.ink_width(txt, size, tracking)
    x0 = cx - (left + right) / 2
    layout, _ = face.text(txt, size, tracking)
    d = "".join(face.path(ch, x0 + off, baseline, size) for ch, off in layout if ch != " ")
    return d, x0 + left, x0 + right


mono = Face(f"{FD}/cormorantb.ttf")
word = Face(f"{FD}/cinzel600.ttf")
sans = Face(f"{FD}/lato.ttf")


def monogram(cx, top, cap_h):
    """K and D interlocked: D sits lower-right, overlapping K's leg."""
    k_b = mono.bounds("K")
    d_b = mono.bounds("D")
    cap_units = k_b[3] - k_b[1]
    size = cap_h / cap_units * mono.upm
    s = size / mono.upm
    K_SX = float(os.environ.get("K_SX", "0.78"))
    k_w = (k_b[2] - k_b[0]) * s * K_SX
    d_w = (d_b[2] - d_b[0]) * s
    # Offsets measured from the original artwork (relative to cap height)
    d_dx = float(os.environ.get("D_DX", "0.64")) * cap_h          # D starts this far right of K's left edge
    d_dy = float(os.environ.get("D_DY", "0.355")) * cap_h  # D sits this much lower than K
    total_w = d_dx + d_w
    kx = cx - total_w / 2 - k_b[0] * s * K_SX
    k_base = top + cap_h
    dx = cx - total_w / 2 + d_dx - d_b[0] * s
    d_base = k_base + d_dy
    k_path = mono.path("K", kx, k_base, size, K_SX)
    d_path = mono.path("D", dx, d_base, size)
    d_left = dx + d_b[0] * s          # left edge of the D stem
    d_top = d_base - d_b[3] * s       # top of the D
    big = 10000
    clip_id = f"kclip{int(cx)}{int(top)}"
    clip = (f'<clipPath id="{clip_id}"><rect x="{-big}" y="{-big}" width="{big + d_left + 1:.1f}" height="{2 * big}"/>'
            f'<rect x="{-big}" y="{-big}" width="{2 * big}" height="{big + d_top + 1:.1f}"/></clipPath>')
    if os.environ.get("KD_STYLE") == "overlap":
        # K sits on the D: no clipping, D drawn first, K on top (two-tone: K colour set by K_FILL)
        kf = os.environ.get("K_FILL")
        kattr = f' fill="{kf}"' if kf else ""
        knock = float(os.environ.get("KNOCK", "0")) * cap_h
        if knock > 0:
            # cut a thin gap into the D around the K, so the K reads as sitting on the D (transparent-safe mask)
            mid = f"kdmask{int(cx)}{int(top)}"
            mask = (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000">'
                    f'<rect x="-10000" y="-10000" width="20000" height="20000" fill="#fff"/>'
                    f'<path d="{k_path}" fill="#000" stroke="#000" stroke-width="{2 * knock:.2f}" stroke-linejoin="round"/></mask>')
            svg_frag = f'<defs>{mask}</defs><path mask="url(#{mid})" d="{d_path}"/><path data-kd="K"{kattr} d="{k_path}"/>'
        else:
            svg_frag = f'<path d="{d_path}"/><path data-kd="K"{kattr} d="{k_path}"/>'
    else:
        svg_frag = (f'<defs>{clip}</defs><path clip-path="url(#{clip_id})" d="{k_path}"/><path d="{d_path}"/>')
    return svg_frag, total_w, cap_h + d_dy


def rule_with_dot(x1, x2, y, dot_at, r=4.2, w=2.6):
    cx = x1 if dot_at == "left" else x2
    return (f'<line x1="{x1:.1f}" y1="{y:.1f}" x2="{x2:.1f}" y2="{y:.1f}" stroke="{GOLD}" stroke-width="{w}"/>'
            f'<circle cx="{cx:.1f}" cy="{y:.1f}" r="{r}" fill="{GOLD}"/>')


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')


TITLE = "Kirkcaldy Dental &amp; Implant Clinic"


def stacked(fill=GOLD):
    W = 1080
    cx = W / 2
    pad = 40
    md, mw, mh = monogram(cx, pad, 300)
    wd, wl, wr = draw_text(word, "KIRKCALDY", 112, 0.30, cx, pad + mh + 40 + 80)
    tag_base = pad + mh + 40 + 80 + 78
    td, tl, tr = draw_text(sans, "DENTAL & IMPLANT CLINIC", 46, 0.0, cx, tag_base)
    ry = tag_base - 46 * 0.36
    gap = 34
    rules = rule_with_dot(wl + 10, tl - gap, ry, "left") + rule_with_dot(tr + gap, wr - 10, ry, "right")
    H = tag_base + pad
    body = (f'<g fill="{fill}">{md}<path d="{wd}"/><path d="{td}"/></g>' + rules.replace(GOLD, fill))
    return svg(W, H, body, TITLE)


def horizontal(fill=GOLD):
    pad = 40
    cap = 215
    # monogram on the left
    md, mw, mh = monogram(pad + 0, pad, cap)
    # shift monogram so its left ink is at pad (monogram() centres on cx)
    m_cx = pad + mw / 2
    md, mw, mh = monogram(m_cx, pad, cap)
    tx0 = pad + mw + 70
    # wordmark: left-aligned block, tagline centred under it
    size = 158
    left, right = word.ink_width("KIRKCALDY", size, 0.30)
    word_w = right - left
    wcx = tx0 + word_w / 2
    w_base = pad + cap * 0.55
    wd, wl, wr = draw_text(word, "KIRKCALDY", size, 0.30, wcx, w_base)
    t_base = w_base + 92
    td, tl, tr = draw_text(sans, "DENTAL & IMPLANT CLINIC", 52, 0.0, wcx, t_base)
    ry = t_base - 52 * 0.36
    rules = rule_with_dot(wl + 8, tl - 34, ry, "left") + rule_with_dot(tr + 34, wr - 8, ry, "right")
    W = wr + pad
    H = pad + mh + pad
    body = (f'<g fill="{fill}">{md}<path d="{wd}"/><path d="{td}"/></g>' + rules.replace(GOLD, fill))
    return svg(W, H, body, TITLE)


def icon(fill=GOLD, bg=None):
    S = 512
    md, mw, mh = monogram(S / 2, 0, 100)
    cap = 100 * min(0.74 * S / mw, 0.74 * S / mh)
    md, mw, mh = monogram(S / 2, 0, cap)
    md, mw, mh = monogram(S / 2, (S - mh) / 2, cap)
    rect = f'<rect width="{S}" height="{S}" fill="{bg}"/>' if bg else ""
    return svg(S, S, f'{rect}<g fill="{fill}">{md}</g>', TITLE)


files = {
    "logo-stacked.svg": stacked(),
    "logo-horizontal.svg": horizontal(),
    "logo-stacked-white.svg": stacked("#FFFFFF"),
    "logo-horizontal-white.svg": horizontal("#FFFFFF"),
    "logo-icon.svg": icon(),
    "logo-icon-white-on-gold.svg": icon("#FFFFFF", GOLD),
}
for name, content in files.items():
    with open(f"{OUT}/{name}", "w") as fh:
        fh.write(content)
    print("wrote", name)
