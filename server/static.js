const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = process.cwd();

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ts": "application/typescript; charset=utf-8"
};

function resolveStaticFile(urlPath) {
  const sanitizedPath = urlPath === "/" ? "/index.html" : urlPath;
  const normalizedPath = path.normalize(sanitizedPath).replace(/^(\.\.[\\/])+/, "");
  const relativePath = normalizedPath.replace(/^[/\\]/, "");
  const absolutePath = path.join(PROJECT_ROOT, relativePath);

  if (!absolutePath.startsWith(PROJECT_ROOT)) {
    return null;
  }

  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    return null;
  }

  return absolutePath;
}

function serveStaticFile(response, urlPath) {
  const absolutePath = resolveStaticFile(urlPath);
  if (!absolutePath) {
    return false;
  }

  const extension = path.extname(absolutePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const fileContent = fs.readFileSync(absolutePath);

  response.writeHead(200, {
    "Content-Type": contentType
  });
  response.end(fileContent);
  return true;
}

module.exports = {
  serveStaticFile
};
