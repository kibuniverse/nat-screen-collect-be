const path = require("path");

module.exports = {
  port: 3000,
  filePath: path.join(__dirname, "../files/"),
  zipFilePath: path.join(__dirname, "../zipped/"),
  response: {
    success: (data, msg) => ({
      ok: 1,
      msg: msg,
      data: data,
    }),
    fail: (data, msg) => ({
      ok: 0,
      msg: msg,
      data: data,
    }),
  },
};
