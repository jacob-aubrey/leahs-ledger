"""Create the app's original icon from simple shapes and a local Windows font."""
from pathlib import Path
import os
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
target = root / "assets"
target.mkdir(exist_ok=True)
image = Image.new("RGBA", (256, 256))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((0, 0, 255, 255), radius=72, fill="#526c4e")
font_path = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts" / "georgiai.ttf"
font = ImageFont.truetype(str(font_path), 215)
draw.text((48, -26), "l", font=font, fill="#f8f4e8")
draw.polygon([(188, 45), (197, 70), (222, 79), (197, 88), (188, 113), (179, 88), (154, 79), (179, 70)], fill="#e0cca0")
image.save(target / "ledger.png")
image.save(target / "ledger.ico", sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
print("App icons created.")
