const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = Number(process.env.PORT || 8080);
const host = '127.0.0.1';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png'
};

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  const requestPath = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  const filePath = path.resolve(root, requestPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const headers = {
      'Content-Type': types[ext] || 'application/octet-stream'
    };

    if (ext === '.html' || ext === '.js' || ext === '.json') {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
      headers.Pragma = 'no-cache';
      headers.Expires = '0';
    }

    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`Ciudades del Mundo disponible en http://${host}:${port}`);
});
