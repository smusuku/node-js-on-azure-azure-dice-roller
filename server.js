import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 8080;


// Basic hardening & logging
app.use(helmet());
app.use(morgan('tiny'));


const allowedOrigins = (process.env.ALLOW_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);


const corsOk = cors({
origin: function (origin, cb) {
    // Allow non-browser (no origin) and allowed origins
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
    }
    return cb(new Error('CORS not allowed for this origin: ' + origin));
},
    credentials: false
});


// Health/ping endpoint (used to "wake up" server)
app.get('/api/ping', (req, res) => {
    res.json({ ok: true, ts: new Date().toISOString() });
});


// CORS-protected dice endpoint (browser calls succeed only from allowed origins)
app.get('/api/roll', corsOk, (req, res) => {
    const sides = clampInt(parseInt(req.query.sides || '6', 10), 2, 1_000_000);
    const count = clampInt(parseInt(req.query.count || '1', 10), 1, 1000);
    const rolls = Array.from({ length: count }, () => crypto.randomInt(1, sides + 1));
    const total = rolls.reduce((a, b) => a + b, 0);
    res.json({ sides, count, rolls, total });
});


// Intentionally NO CORS headers here: demonstrates a browser CORS failure
app.get('/api/roll-nocors', (req, res) => {
    const sides = clampInt(parseInt(req.query.sides || '6', 10), 2, 1_000_000);
    const count = clampInt(parseInt(req.query.count || '1', 10), 1, 1000);
    const rolls = Array.from({ length: count }, () => crypto.randomInt(1, sides + 1));
    const total = rolls.reduce((a, b) => a + b, 0);
    // No CORS headers set: browsers will block cross-origin fetch, but curl/Postman will work
    res.json({ sides, count, rolls, total, cors: 'absent' });
});


// Serve the API test page at root (no app UI here)
app.use(express.static(path.join(__dirname)));


// 404 helper
app.use((req, res) => {
res.status(404).json({ error: 'Not found' });
});


app.listen(port, () => {
console.log(`Dice API listening on port ${port}`);
});


function clampInt(n, min, max) {
    if (Number.isNaN(n)) return min;
    return Math.max(min, Math.min(max, n));
}