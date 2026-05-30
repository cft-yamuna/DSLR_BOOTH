import frameImageUrl from '../assets/images/frame.png';

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1800;
const PHOTO_AREA = {
  x: 8 / 519,
  y: 8 / 778,
  width: 503 / 519,
  height: 692 / 778,
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load an image needed for the final photo.'));
    image.src = src;
  });
}

function drawCover(ctx, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

export async function createFinalPhoto(capturedImage) {
  const [frameImage, userImage] = await Promise.all([
    loadImage(frameImageUrl),
    loadImage(capturedImage),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas is not supported in this browser.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(frameImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const photoX = CANVAS_WIDTH * PHOTO_AREA.x;
  const photoY = CANVAS_HEIGHT * PHOTO_AREA.y;
  const photoWidth = CANVAS_WIDTH * PHOTO_AREA.width;
  const photoHeight = CANVAS_HEIGHT * PHOTO_AREA.height;

  drawCover(ctx, userImage, photoX, photoY, photoWidth, photoHeight);

  return canvas.toDataURL('image/png', 1);
}
