export const GAME_WIDTH = 760;
export const GAME_HEIGHT = 280;

export function prepareHiDpiCanvas(canvas: HTMLCanvasElement) {
  const ratio = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  canvas.width = Math.round(GAME_WIDTH * ratio);
  canvas.height = Math.round(GAME_HEIGHT * ratio);
  canvas.style.aspectRatio = `${GAME_WIDTH} / ${GAME_HEIGHT}`;

  const context = canvas.getContext('2d');
  if (!context) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  return { ctx: context, width: GAME_WIDTH, height: GAME_HEIGHT, ratio };
}
