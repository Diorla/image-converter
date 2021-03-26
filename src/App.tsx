import { useEffect, useState } from "react";
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
  const [fixed, setFixed] = useState(0);

  const getDimension = (
    callBack: React.Dispatch<
      React.SetStateAction<{
        height: number;
        width: number;
      }>
    >
  ) => {
    const img = document.querySelector("img") || {
      naturalWidth: 0,
      naturalHeight: 0,
    };

    const { naturalWidth: width, naturalHeight: height } = img;
    callBack({ width, height });
  };
  useEffect(() => {
    setTimeout(() => {
      getDimension(setSize);
    }, 1000);
  }, [file]);
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

  const addNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a =
      e.target && e.target.files && URL.createObjectURL(e.target.files[0]);
    if (a) {
      setFile(a);
      setUpdated("");
    }
  };

  const setFixedValue = () => {
    const { height, width } = size;
    if (height && !fixed) setFixed(width / height);
    else setFixed(0);
  };

  const updateDimension = (value: string, type = "height") => {
    const num = Number(value);
    if (type === "height") {
      if (fixed) {
        setSize({
          height: num,
          width: Number((num * fixed).toFixed(2)),
        });
      } else {
        setSize({
          ...size,
          height: num,
        });
      }
    } else {
      if (type === "width") {
        if (fixed) {
          setSize({
            width: num,
            height: Number((num / fixed).toFixed(2)),
          });
        } else {
          setSize({
            ...size,
            width: num,
          });
        }
      }
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
            style={{ height: 200 }}
          />
        </div>
        <div className="image-container">
          <img
            src={updated || thumbnail}
            alt="updated"
            className="img-fluid"
            style={{ height: 200 }}
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
            onChange={addNewFile}
            accept="image/jpeg,image/png,image/bmp,image/gif,image/x-icon,image/tiff,image/webp"
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
              onChange={(e) => updateDimension(e.target.value, "height")}
            />
            <button
              className={`btn ${fixed ? "btn-primary" : "btn-secondary"}`}
              type="button"
              onClick={setFixedValue}
            >
              Fixed
            </button>
            <input
              type="number"
              className="form-control"
              placeholder=""
              value={size.width}
              onChange={(e) => updateDimension(e.target.value, "width")}
            />
            <button className="btn btn-outline-secondary" type="button">
              Height
            </button>
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
            {/* <ButtonSelect
              text="svg"
              active={imageType === "image/svg+xml"}
              onClick={() => setImageType("image/svg+xml")}
            /> */}
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
        <div className="mx-auto" style={{ width: 200 }}>
          <button
            onClick={download}
            className={`btn ${!!file && "btn-primary"}`}
            disabled={!file}
          >
            Apply changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
