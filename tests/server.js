const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 4321;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0].split('#')[0];
  if (url === '/') url = '/index.html';

  // Clean URL: /hosting/web → /hosting/web.html
  let filePath = path.join(ROOT, url);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    const withHtml = filePath.replace(/\/?$/, '.html');
    if (fs.existsSync(withHtml)) {
      filePath = withHtml;
    } else {
      const indexHtml = path.join(filePath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        filePath = indexHtml;
      } else {
        res.writeHead(404);
        res.end('Not found: ' + url);
        return;
      }
    }
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'text/plain';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(500);
    res.end('Error: ' + e.message);
  }
});

server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
