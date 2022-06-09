const http = require("http");
const path = require("path");
const fs = require("fs");
const util = require('util');
const socket = require("socket.io");
const { Worker } = require('worker_threads');
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

const io = socket(server);
let i = 1;
io.on("connection", (client) => {
    console.log("Connected");

    client.broadcast.emit("connection", i);
    client.emit("connection", i);


    client.on("newMessage", (data) => {
        console.log(data);

        client.broadcast.emit("newMessage", data, userName);
        client.emit("newMessage", data, userName);
    });

    client.on("disconnect", (data) => {
        client.broadcast.emit("disconnection", i - 1);
        client.emit("disconnection", i - 1);
    });
    i++;
});




server.listen(8085);

