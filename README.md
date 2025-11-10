
# Dice Roller WebService — Node.js (Server Only)

This repository contains the **server-side Dice Roller WebService**, implemented using pure Node.js and hosted on **Azure App Service (Windows)** using **iisnode**.

This server exposes REST APIs that generate all random dice results.  
A simple `index.html` page is included to *test the APIs only*.

**No UI**  
**No client logic**  
**Only API + test page**  
**Runs on Windows App Service**

---

# REST API Endpoints

### GET /api/ping
Wake-up / health check.

**Response:**
```json
{
  "ok": true,
  "ts": "2025-11-10T12:34:56Z"
}
```

---

### GET /api/roll?sides=6&count=2
Server generates random dice rolls using `crypto.randomInt`.

**Response:**
```json
{
  "sides": 6,
  "count": 2,
  "rolls": [4, 1],
  "total": 5
}
```

---

### GET /api/roll-nocors?sides=6&count=2
Same as `/api/roll`, but **without CORS headers** — used to demonstrate the required **CORS failure** condition.

---

# ✅ Server Requirements Met

✔ Hosted globally on Azure  
✔ REST WebService  
✔ No UI  
✔ All random numbers generated server-side  
✔ Ping wake-up endpoint  
✔ Intentional CORS failure endpoint  
✔ Windows hosting supported  
✔ Test page provided (not the Dice Roller UI)  
