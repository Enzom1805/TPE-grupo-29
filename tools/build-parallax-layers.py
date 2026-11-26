#!/usr/bin/env python3
"""
Genera las 4 capas PNG del fondo parallax de EchoBat (id 50).

Fuente: las 7 imágenes de cueva entregadas en `Descargas/parallax`
(cave-1.png .. cave-7.png). Cada una es una escena completa de 2707x1504,
no un frame de spritesheet. Para que el parallax se mantenga coherente se
agrupan en 4 capas (las imágenes de un grupo comparten velocidad):

    capa 1 = cave-1 + cave-2   (fondo)
    capa 2 = cave-3 + cave-4
    capa 3 = cave-5 + cave-6
    capa 4 = cave-7            (frente)

Cada capa se exporta a 1600x900 (2x del canvas lógico 800x450) con cover +
recorte centrado. cave-1 es un JPEG aunque tenga extensión .png; Pillow lo
convierte a RGBA sin problema.

Uso:
    python3 tools/build-parallax-layers.py
    python3 tools/build-parallax-layers.py --source ~/Descargas/parallax
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image

TARGET_SIZE = (1600, 900)
GROUPS = ((1, 2), (3, 4), (5, 6), (7,))
DEFAULT_SOURCE = Path.home() / "Descargas" / "parallax"
REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT = REPO_ROOT / "games" / "echobat" / "assets" / "images" / "parallax"


def cover_crop(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    """Escala la imagen para cubrir `size` y recorta el centro (sin deformar)."""
    target_w, target_h = size
    scale = max(target_w / image.width, target_h / image.height)
    new_w = round(image.width * scale)
    new_h = round(image.height * scale)
    resized = image.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def build_layers(source: Path, output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    total_bytes = 0

    for index, group in enumerate(GROUPS, start=1):
        layer = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))

        for cave_number in group:
            source_path = source / f"cave-{cave_number}.png"
            if not source_path.exists():
                raise FileNotFoundError(f"No se encontró la imagen fuente: {source_path}")

            with Image.open(source_path) as raw:
                prepared = cover_crop(raw.convert("RGBA"), TARGET_SIZE)

            layer = Image.alpha_composite(layer, prepared)

        output_path = output / f"parallax-layer-{index}.png"
        layer.save(output_path, optimize=True, compress_level=9)
        size_kb = output_path.stat().st_size // 1024
        total_bytes += output_path.stat().st_size
        print(f"{output_path.name}: {size_kb} KB  (cave-{', cave-'.join(map(str, group))})")

    print(f"Total: {total_bytes // 1024} KB en {output}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera las capas PNG del parallax de EchoBat.")
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"Directorio con cave-1.png .. cave-7.png (default: {DEFAULT_SOURCE})",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Directorio de salida (default: {DEFAULT_OUTPUT})",
    )
    args = parser.parse_args()

    build_layers(args.source, args.output)


if __name__ == "__main__":
    main()
