import { useEffect, useRef, useState } from "react";
import "./App.css";
import ButtonSelect from "./ButtonSelect";
import thumbnail from "./thumbnail.png";
import getExtension from "./getExtension";
import applyFilters from "./applyFilters";
import supportedTypes from "./supportedTypes";

function App() {
  const [file, setFile] = useState("");
  const [updated, setUpdated] = useState("");
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [quality, setQuality] = useState<string | number>(100);
  const [greyscale, setGreyscale] = useState(false);
  const [imageType, setImageType] = useState("");
  const [fixed, setFixed] = useState(0);
  const ref = useRef<HTMLInputElement>(null);

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

  const addNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // remove previously created image
    file && URL.revokeObjectURL(file);
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
    <div className="wrapper">
      <h1>Image converter</h1>
      <div className="main">
        <div className="left">
          <div className="img-wrapper">
            <img
              src={updated || file || thumbnail}
              alt="Uploaded"
              onClick={() => ref?.current?.click()}
            />
          </div>
          <div className="column">
            <div className="check-wrapper">
              <div className="check-item">
                <input
                  type="checkbox"
                  name="greyscale"
                  id="greyscale"
                  checked={greyscale}
                  onChange={(e) => setGreyscale(!greyscale)}
                />{" "}
                <label htmlFor="greyscale">Greyscale</label>
              </div>
              <div className="check-item">
                <input
                  type="checkbox"
                  name="fixed-ratio"
                  id="fixed-ratio"
                  checked={!!fixed}
                  onChange={(e) => setFixedValue()}
                />{" "}
                <label htmlFor="fixed-ratio">Fixed ratio</label>
              </div>
            </div>
            <div className="row">
              <div className="form-item">
                <label htmlFor="quality">Quality</label>
                <input
                  type="number"
                  name="quality"
                  id="quality"
                  value={quality}
                  max={100}
                  min={1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < 1) setQuality(1);
                    else if (value > 100) setQuality(100);
                    else setQuality(value);
                  }}
                />
              </div>
              <div className="form-item">
                <label htmlFor="width">Width</label>
                <input
                  type="number"
                  name="width"
                  id="width"
                  value={size.width}
                  onChange={(e) => updateDimension(e.target.value, "width")}
                />
              </div>
              <div className="form-item">
                <label htmlFor="height">Height</label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  value={size.height}
                  onChange={(e) => updateDimension(e.target.value, "height")}
                />
              </div>
            </div>
          </div>
          <div className="center">
            <button
              className="btn"
              onClick={() =>
                applyFilters({
                  updated,
                  file,
                  size,
                  quality,
                  greyscale,
                  imageType,
                  setUpdated,
                })
              }
            >
              Apply filters
            </button>
          </div>
        </div>
        <div className="right">
          <h2>Select types</h2>
          <div className="type-wrapper">
            <div className="row">
              {supportedTypes.map((item) => (
                <ButtonSelect
                  key={item}
                  text={item}
                  active={imageType === item}
                  onClick={() => setImageType(item)}
                />
              ))}
            </div>
          </div>
          <div className="center">
            <a
              className="btn"
              href={updated || file}
              download={`${Math.floor(Math.random() * 10e10).toString(
                32
              )}.${getExtension(imageType)}`}
            >
              Download
            </a>
          </div>
        </div>
      </div>
      <input
        ref={ref}
        style={{ display: "none" }}
        type="file"
        id="formFile"
        onChange={addNewFile}
        accept="image/jpeg,image/png,image/bmp,image/gif,image/x-icon,image/tiff,image/webp"
      />
    </div>
  );
}

export default App;
