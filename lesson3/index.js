const fs = require("fs");
const { Transform } = require("stream");

const readStream = fs.createReadStream("./access.log", "utf8");
const adresess = ['89.123.1.41', '34.48.240.111'];


adresess.forEach(ip => {
  const outputFile = `./${ip}_request.log`;
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      let transformedChunk = '';
      const result = chunk.toString().match(/^$89\.123\.1\.41|34\.48\.240\.111.*$/gm);
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





