const express = require("express");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
const zipdir = require("zip-dir");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

const constant = require("./constant");
const classStudentCountMap = constant.classStudentCountMap;

const config = require("./config");
const port = config.port;
const filePath = config.filePath;

const app = express();
const staticPath = path.join(__dirname, "../dist");
console.log(staticPath);
app.use(express.static(staticPath));

app.use(formidableMiddleware());
app.use(cors());

app.post("/api/upload", (req, res) => {
  const dateDirName = filePath + req.fields.date.replace(",", "-");
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
  const fs1 = fs.readFileSync(file.path);
  fs.writeFileSync(fileName, fs1);
  res.send(JSON.stringify({ success: 1 }));
  res.end();
});

app.get("/download", async (req, res) => {
  const date = req.query.date;
  const classes = req.query.classes;
  const downloadDir = filePath + `${date}/${classes}`;
  const buffer = await zipdir(downloadDir);
  res.writeHead(200, {
    "Content-Type": "application/zip",
  });
  const stream = Readable.from(buffer);
  stream.pipe(res);
});

app.get("/api/uploadedDate", (req, res) => {
  const dateDir = fs.readdirSync(filePath);
  res.send(JSON.stringify(dateDir));
  res.end();
});

app.get("/api/classResult", (req, res) => {
  const date = req.query.date;
  const classes = req.query.classes;
  const classDir = filePath + `${date}/${classes}`;
  if (!fs.existsSync(classDir)) {
    fs.mkdirSync(classDir);
  }
  const classDirInfo = fs.readdirSync(classDir);
  const classDirInfoLength = classDirInfo.length;
  const classStudentCount = classStudentCountMap.get(classes);

  const percent = Math.floor((classDirInfoLength / classStudentCount) * 100);
  const data = {
    studentCount: classStudentCount,
    uploadStudentCount: classDirInfoLength,
    uploadUserList: classDirInfo,
    percent,
  };

  res.send(config.response.success(data, "success"));
  res.end();
});

app.listen(port, () => {
  console.log("服务启动在" + port + "端口");
});
