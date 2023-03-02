import jimp from "jimp";
import supportedTypes from "./supportedTypes";

export default function applyFilters({
  updated,
  file,
  size,
  quality,
  greyscale,
  imageType,
  setUpdated,
}: {
  updated: string;
  file: string;
  size: { height: any; width: any };
  quality: any;
  greyscale: any;
  imageType: string;
  setUpdated: (arg0: string) => void;
}) {
  // remove previously created image
  updated && URL.revokeObjectURL(updated);
  let jimpFile;
  const { height, width } = size;
  if (file) {
    jimpFile = jimp.read(file);
    if (height || width)
      jimpFile = jimpFile.then((file) =>
        file.resize(height || jimp.AUTO, width || jimp.AUTO)
      );
    if (quality)
      jimpFile = jimpFile.then((file) => file.quality(Number(quality)));
    if (greyscale) jimpFile = jimpFile.then((file) => file.greyscale());
    jimpFile
      .then((unit) => {
        const type = supportedTypes.includes(imageType)
          ? `image/${imageType}`
          : "image/jpeg";
        unit.getBuffer(type, (err, value) => {
          if (err) console.log({ err });
          else {
            const image = URL.createObjectURL(
              new Blob([value], { type: imageType })
            );
            setUpdated(image);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
