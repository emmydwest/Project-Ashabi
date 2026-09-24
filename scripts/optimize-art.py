from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1]
for source in (root.parent / 'assets' / 'art').glob('*.png'):
    im = Image.open(source)
    im.thumbnail((800,1200) if source.stem.startswith('story-') else (1600,1600))
    im.save(root / 'public' / 'images' / (source.stem + '.webp'), 'WEBP', quality=85)
print('Artwork optimized')
