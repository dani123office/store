import http from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "src/data/db.json");

function readDB() {
  return JSON.parse(readFileSync(DB_PATH, "utf-8"));
}

function writeDB(db) {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function jsonResponse(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

function findItemIndex(arr, id) {
  return arr.findIndex((item) => {
    for (const key of ["id", "cat_item_id", "subcat_id", "cat_id"]) {
      if (String(item[key]) === String(id)) return true;
    }
    return false;
  });
}

function getItemId(item) {
  for (const key of ["cat_item_id", "subcat_id", "cat_id", "id"]) {
    if (item[key] != null) return String(item[key]);
  }
  return String(Date.now());
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const method = req.method;

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    return res.end();
  }

  const db = readDB();

  // Auth routes
  if (url === "/api/auth/login" && method === "POST") {
    const body = await parseBody(req);
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (user) {
      const { password, ...safeUser } = user;
      return jsonResponse(res, 200, safeUser);
    }
    return jsonResponse(res, 401, { error: "Invalid credentials" });
  }

  if (url === "/api/auth/register" && method === "POST") {
    const body = await parseBody(req);
    const existing = db.users.find((u) => u.email === body.email);
    if (existing) return jsonResponse(res, 409, { error: "Email already exists" });
    const newUser = { id: String(db.users.length + 1), name: body.name || "", lastname: body.lastname || "", email: body.email, password: body.password };
    db.users.push(newUser);
    writeDB(db);
    const { password, ...safeUser } = newUser;
    return jsonResponse(res, 201, safeUser);
  }

  // Generic CRUD for /api/:resource and /api/:resource/:id
  const match = url.match(/^\/api\/(\w[\w-]*)(?:\/([^/]+))?$/);
  if (match) {
    const resource = match[1];
    const id = match[2];

    if (!db[resource]) {
      return jsonResponse(res, 200, []);
    }

    if (method === "GET" && !id) {
      return jsonResponse(res, 200, db[resource]);
    }

    if (method === "GET" && id) {
      const idx = findItemIndex(db[resource], id);
      if (idx === -1) return jsonResponse(res, 404, { error: "Not found" });
      return jsonResponse(res, 200, db[resource][idx]);
    }

    if (method === "POST" && !id) {
      const body = await parseBody(req);
      const newItem = { ...body, id: String(Date.now()) };
      if (Array.isArray(db[resource])) db[resource].push(newItem);
      writeDB(db);
      return jsonResponse(res, 201, newItem);
    }

    if (method === "PUT" && id) {
      const body = await parseBody(req);
      if (Array.isArray(db[resource])) {
        const idx = findItemIndex(db[resource], id);
        if (idx === -1) return jsonResponse(res, 404, { error: "Not found" });
        db[resource][idx] = { ...db[resource][idx], ...body };
        writeDB(db);
        return jsonResponse(res, 200, db[resource][idx]);
      }
    }

    if (method === "DELETE" && id) {
      if (Array.isArray(db[resource])) {
        const idx = findItemIndex(db[resource], id);
        if (idx === -1) return jsonResponse(res, 404, { error: "Not found" });
        db[resource].splice(idx, 1);
        writeDB(db);
      }
      return jsonResponse(res, 200, { message: "Deleted" });
    }

    return jsonResponse(res, 200, db[resource]);
  }

  // db-migrate-custom and other misc routes
  if (url.startsWith("/api/db-migrate")) {
    return jsonResponse(res, 200, { message: "ok" });
  }

  // Upload route
  if (url === "/api/upload" && method === "POST") {
    return jsonResponse(res, 200, { filename: "uploaded-" + Date.now() + ".jpg" });
  }

  jsonResponse(res, 404, { error: "Not found" });
});

const PORT = 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock API server running on http://localhost:${PORT}/api`);
});
