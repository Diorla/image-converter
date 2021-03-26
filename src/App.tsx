import { useState } from "react";
import jimp from "jimp";
import "./App.css";
import ButtonSelect from "./ButtonSelect";
import thumbnail from "./thumbnail.png";

const supportedTypes = ["image/png", "image/jpeg", "image/bmp"];
function App() {
  const [file, setFile] = useState("");
  const [updated, setUpdated] = useState("");
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [quality, setQuality] = useState<string | number>(100);
  const [greyscale, setGreyscale] = useState(false);
  const [imageType, setImageType] = useState("image/png");

  const download = (e: React.SyntheticEvent) => {
    e.preventDefault();
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
            ? imageType
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
  };
  return (
    <div className="app">
      <div className="image-wrapper">
        <div className="image-container">
          <img
            src={file || thumbnail}
            alt="uploaded"
            className="img-fluid"
            height={200}
          />
        </div>
        <div className="image-container">
          <img
            src={updated || thumbnail}
            alt="updated"
            className="img-fluid"
            height={200}
          />
        </div>
      </div>
      <form>
        <div className="form-control">
          <label htmlFor="formFile" className="form-label">
            Select an image
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => {
              const a =
                e.target &&
                e.target.files &&
                URL.createObjectURL(e.target.files[0]);
              a && setFile(a);
            }}
          />
        </div>
        <div className="form-control">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="greyscale"
              checked={greyscale}
              onChange={() => setGreyscale(!greyscale)}
            />
            <label className="form-check-label" htmlFor="greyscale">
              Greyscale
            </label>
          </div>
          <div className="input-group">
            <button className="btn btn-outline-secondary" type="button">
              Width
            </button>
            <input
              type="number"
              className="form-control"
              placeholder=""
              value={size.height}
              onChange={(e) =>
                setSize({
                  ...size,
                  height: Number(e.target.value),
                })
              }
            />
            <button className="btn btn-outline-secondary" type="button">
              Height
            </button>
            <input
              type="number"
              className="form-control"
              placeholder=""
              value={size.width}
              onChange={(e) =>
                setSize({
                  ...size,
                  width: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label htmlFor="quality" className="form-label">
              Quality: {quality}%
            </label>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100"
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            ></input>
          </div>
          <div className="image-select">
            <div>Select output type</div>
            <ButtonSelect
              text="jpeg"
              active={imageType === "image/jpeg"}
              onClick={() => setImageType("image/jpeg")}
            />
            <ButtonSelect
              text="png"
              active={imageType === "image/png"}
              onClick={() => setImageType("image/png")}
            />
            <ButtonSelect
              text="bmp"
              active={imageType === "image/bmp"}
              onClick={() => setImageType("image/bmp")}
            />
            <ButtonSelect
              text="gif"
              active={imageType === "image/gif"}
              onClick={() => setImageType("image/gif")}
            />
            <ButtonSelect
              text="icon"
              active={imageType === "image/x-icon"}
              onClick={() => setImageType("image/x-icon")}
            />
            <ButtonSelect
              text="svg"
              active={imageType === "image/svg+xml"}
              onClick={() => setImageType("image/svg+xml")}
            />
            <ButtonSelect
              text="tiff"
              active={imageType === "image/tiff"}
              onClick={() => setImageType("image/tiff")}
            />
            <ButtonSelect
              text="webp"
              active={imageType === "image/webp"}
              onClick={() => setImageType("image/webp")}
            />
          </div>
        </div>
        <button onClick={download} className="btn btn-primary">
          Apply changes
        </button>
      </form>
    </div>
  );
}

export default App;
