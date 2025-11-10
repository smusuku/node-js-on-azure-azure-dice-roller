const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

// Serve index.html for root requests
function serveIndex(res) {
    const filePath = path.join(__dirname, "index.html");
    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Error loading index.html");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// Create Dice Roller server
const server = http.createServer((req, res) => {

    const parsed = url.parse(req.url, true);
    const pathname = parsed.pathname;

    console.log("[REQ]", req.method, pathname);

    if (pathname === "/" || pathname === "/index.html") {
        return serveIndex(res);
    }

    if (pathname === "/api/ping") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            ok: true,
            ts: new Date().toISOString()
        }));
    }

    if (pathname === "/api/roll") {
        res.writeHead(200, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // simple CORS
        });

        const sides = clamp(parseInt(parsed.query.sides || "6"), 2, 1000000);
        const count = clamp(parseInt(parsed.query.count || "1"), 1, 1000);

        const rolls = Array.from({ length: count }, () =>
            crypto.randomInt(1, sides + 1)
        );

        return res.end(JSON.stringify({
            sides, count, rolls,
            total: rolls.reduce((a, b) => a + b, 0)
        }));
    }

    if (pathname === "/api/roll-nocors") {
        const sides = clamp(parseInt(parsed.query.sides || "6"), 2, 1000000);
        const count = clamp(parseInt(parsed.query.count || "1"), 1, 1000);

        const rolls = Array.from({ length: count }, () =>
            crypto.randomInt(1, sides + 1)
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
            sides, count, rolls,
            total: rolls.reduce((a, b) => a + b, 0),
            cors: "absent"
        }));
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
});

// Clamp helper
function clamp(n, min, max) {
    if (isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
}

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
