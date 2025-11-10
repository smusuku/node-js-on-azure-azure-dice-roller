var http = require("http");
var url = require("url");
var crypto = require("crypto");

const server = http.createServer((req, res) => {

    const parsed = url.parse(req.url, true);

    if (parsed.pathname === "/api/ping") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true, ts: new Date().toISOString() }));
    }

    if (parsed.pathname === "/api/roll") {
        const sides = clamp(parseInt(parsed.query.sides) || 6, 2, 1000000);
        const count = clamp(parseInt(parsed.query.count) || 1, 1, 1000);

        const rolls = Array.from({ length: count }, () =>
            crypto.randomInt(1, sides + 1)
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            sides, count, rolls, total: rolls.reduce((a,b)=>a+b, 0)
        }));
    }

    if (parsed.pathname === "/api/roll-nocors") {
        const sides = clamp(parseInt(parsed.query.sides) || 6, 2, 1000000);
        const count = clamp(parseInt(parsed.query.count) || 1, 1, 1000);

        const rolls = Array.from({ length: count }, () =>
            crypto.randomInt(1, sides + 1)
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            sides, count, rolls, total: rolls.reduce((a,b)=>a+b, 0),
            cors: "absent"
        }));
    }
    var fs = require("fs");
    var path = require("path");
    if (parsed.pathname === "/" || parsed.pathname === "/index.html") {
        const filePath = path.join(__dirname, "index.html");
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading index.html");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            return res.end(data);
        });
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
});

function clamp(n, min, max) {
    return Math.max(min, Math.min(n, max));
}

const port = process.env.PORT || 8080;
server.listen(port);
console.log("Server running on port " + port);
