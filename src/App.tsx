import { useState } from "react";
import jimp from "jimp";

function App() {
  const [file, setFile] = useState("");
  const [updated, setUpdated] = useState("");

  const download = () => {
    if (file)
      jimp
        .read(file)
        .then((lenna) => {
          return lenna
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale(); // set greyscale
        })
        .then((unit) => {
          unit.getBuffer(jimp.MIME_PNG, (err, value) => {
            if (err) console.log({ err });
            else console.log({ value });
            const image = URL.createObjectURL(
              new Blob([value], { type: "image/png" })
            );
            setUpdated(image);
          });
        })
        .catch((err) => {
          console.error(err);
        });
  };
  return (
    <div className="App">
      <div className="col-md-4">
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Default file input example
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
          <button onClick={download}>Download</button>
          <img src={file} alt="uploaded" className="img-fluid" height={200} />
          <img src={updated} alt="updated" className="img-fluid" height={200} />
        </div>
      </div>
    </div>
  );
}

export default App;
