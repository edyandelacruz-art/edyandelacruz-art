export type PremiumGameArt = 'Runner' | 'Road Dodge' | 'Tetris' | 'Pong' | 'Snake' | 'Memory Grid';

// Adobe Firefly art selected after visual QA. These URLs are used by the alpha
// runtime while the generated assets are being packaged into the permanent asset bundle.
export const GAME_ART_URLS: Record<PremiumGameArt, string> = {
  Runner: 'https://at.adobe.com/9a0WsTkPEoB7XcrH',
  'Road Dodge': 'https://at.adobe.com/uyySOImTEHEh5521',
  Tetris: 'https://at.adobe.com/SzsNDGbbRyN6SBvy',
  Pong: 'https://at.adobe.com/U1A7DOOlB7rqhTo8',
  Snake: 'https://at.adobe.com/6spt6Bg06fU0ht9u',
  'Memory Grid': 'https://at.adobe.com/xtSuX9KtPAC82I3a',
};

export function createGameArt(name: PremiumGameArt) {
  const image = new Image();
  image.decoding = 'async';
  image.src = GAME_ART_URLS[name];
  return image;
}

export function drawGameArt(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  opacity = 1,
  focalY = 0.5,
) {
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return false;

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = Math.max(0, (image.naturalWidth - sourceWidth) / 2);
  const sourceY = Math.max(
    0,
    Math.min(image.naturalHeight - sourceHeight, (image.naturalHeight - sourceHeight) * focalY),
  );

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
  ctx.restore();
  return true;
}
