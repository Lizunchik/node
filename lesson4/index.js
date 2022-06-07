const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { Transform } = require("stream");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let adresess = [];
function getPath() {


  rl.question("Please enter the path to the file: ", function (inputedPath) {
    const filePath = path.join(__dirname, inputedPath);
    fs.readFile(filePath, "utf8", (err, data) => {
      const readStream = fs.createReadStream(filePath, "utf8");
      getRegExp(readStream);
    });
  });
}


function getRegExp(readStream) {

  rl.question("Введи строку для соответствия: ", function (str) {
    adresess = str.split('|');
    const regExp = new RegExp("^" + str + ".*$", "gm");
    getData(readStream, regExp);
    rl.close();
  });
}

getPath();

function getData(readStream, regExp) {

  adresess.forEach(ip => {
    const outputFile = `./${ip}_request.log`;
    const transformStream = new Transform({
      transform(chunk, encoding, callback) {
        let transformedChunk = '';
        const result = chunk.toString().match(regExp);
        if (result) {
          transformedChunk = result.join('\n');
        }

        callback(null, transformedChunk);
      },
    });

    const writeStream = fs.createWriteStream(outputFile, 'utf-8');
    readStream.pipe(transformStream).pipe(writeStream);
    console.log("Запись завершена!");
  })

}