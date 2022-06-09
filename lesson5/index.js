const http = require("http");
const path = require("path");
const fs = require("fs");
const util = require('util');

const HTML = fs.readFileSync("./index.html", "utf-8");


const getData = async (path, method) => {
  const reader = util.promisify(fs[method]);
  const getContent = () => reader(path);
  const dirContent = await getContent();
  return dirContent;
}

const generateHTMLContent = async (dir, path) => {
  let dirName = dir === "/" ? "" : dir + "/";

  const dirContent = await getData(path, 'readdir');
  const listContent = `
    <ol>
      ${dirContent
      .map((item) => `<li><a href="${dirName + item}">${item}</a></li>`)
      .join("\n")}
    </ol>
    `;

  return HTML.replace("{{content}}", listContent);
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET") {

      const itemPath = path.join(__dirname, req.url);

      const dirContent = await getData(itemPath, 'lstat');
      const itemIsFile = dirContent.isFile();

      if (itemIsFile) {
          const data = await getData(itemPath, 'readFile');
          return res.end(data);
      }

      const htmlContent = await generateHTMLContent(req.url, itemPath);
      return res.end(htmlContent);
    }
    res.writeHead(405, "Method not Allowed");
    res.end();
  } catch (e) {
    res.writeHead(400, e);
    res.end();
  }
});

server.listen(8085);