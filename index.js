const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const zipdir = require("zip-dir");
const fs = require("fs");

const app = express();

app.use(formidableMiddleware());
app.use(cors());

app.post("/api/upload", (req, res) => {
  console.log(req.fields);
  const dateDirName = req.fields.date.replace(",", "-");
  if (!fs.existsSync(dateDirName)) {
    fs.mkdirSync(dateDirName);
  }

  const className = req.fields.class.split(",").pop();
  const classDirName = `${dateDirName}/${className}`;
  if (!fs.existsSync(classDirName)) {
    fs.mkdirSync(classDirName);
  }
  const imgExtType = req.files.file.name.split(".").pop();
  const fileName = `${classDirName}/${className}${req.fields.name}.${imgExtType}`;
  const file = req.files.file;
  console.log(fileName);
  const fs1 = fs.readFileSync(file.path);
  fs.writeFileSync(fileName, fs1);
  res.send(JSON.stringify({ success: 1 }));
  res.end();
});

app.get("/download", (req, res) => {
  const date = req.query.date;
  const classes = req.query.class;
  console.log(`/${date}/${classes}`);
  const downloadDir = `./${date}/${classes}`;
  const buffer = zipdir(downloadDir, { saveTo: `./${date}${classes}.zip` });
  res.send("ss");
  res.end;
});

const port = 3000;
app.listen(port, () => {
  console.log(`服务启动在${port}`);
});
