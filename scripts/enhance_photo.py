#!/usr/bin/env python3
"""Éclaircit et neutralise la teinte de la photo de profil."""
from pathlib import Path

try:
    import numpy as np
    from PIL import Image, ImageEnhance, ImageFilter
except ImportError:
    raise SystemExit("pip install pillow numpy")

SRC = Path(__file__).resolve().parents[1] / "assets" / "profile.jpg"
OUT = SRC


def enhance(img: Image.Image) -> Image.Image:
    arr = np.array(img.convert("RGB"), dtype=np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    # Correction teinte chaude (orange) → plus neutre
    arr[..., 0] = np.clip(r * 0.94, 0, 255)
    arr[..., 1] = np.clip(g * 0.98, 0, 255)
    arr[..., 2] = np.clip(b * 1.06, 0, 255)

    # Relève les ombres pour un rendu plus clair
    lum = 0.299 * arr[..., 0] + 0.587 * arr[..., 1] + 0.114 * arr[..., 2]
    shadow = np.clip((128 - lum) / 128, 0, 1)
    lift = 32 * shadow
    for c in range(3):
        arr[..., c] = np.clip(arr[..., c] + lift, 0, 255)

    # Luminosité globale
    arr = np.clip(arr * 1.1 + 10, 0, 255)
    out = Image.fromarray(arr.astype(np.uint8))

    out = ImageEnhance.Brightness(out).enhance(1.06)
    out = ImageEnhance.Contrast(out).enhance(0.97)
    out = ImageEnhance.Color(out).enhance(0.94)
    out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=3))

    return out


def main():
    img = Image.open(SRC)
    enhanced = enhance(img)
    enhanced.save(OUT, "JPEG", quality=93, optimize=True)
    print(f"Saved: {OUT} ({enhanced.size[0]}x{enhanced.size[1]})")


if __name__ == "__main__":
    main()
