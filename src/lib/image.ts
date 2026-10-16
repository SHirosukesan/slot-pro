/**
 * 利用者が自分で選んだ機種画像を、正方形に切り抜いて縮小する。
 * 画像はその端末のブラウザ内にだけ保存し、GitHub や公開環境には含めない。
 */
export const IMAGE_SIZE = 320;

export const isImageFile = (f: File): boolean => /^image\/(png|jpe?g|webp|gif|avif|heic|heif)$/i.test(f.type);

export async function fileToThumb(file: File, size = IMAGE_SIZE): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('画像を読み込めませんでした'));
      el.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - side) / 2;
    // 縦長の台画像はキャラが上寄りなので、少し上を切り抜く
    const sy = img.naturalHeight > img.naturalWidth ? (img.naturalHeight - side) * 0.25 : (img.naturalHeight - side) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('画像を処理できませんでした');
    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
