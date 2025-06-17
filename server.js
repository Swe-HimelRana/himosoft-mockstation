const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

// Initialize Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Parse URL
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Handle static files
      if (pathname.startsWith('/_next/static/') || pathname.startsWith('/static/')) {
        const filePath = path.join(__dirname, pathname)
        try {
          const stat = await fs.promises.stat(filePath)
          if (stat.isFile()) {
            const stream = fs.createReadStream(filePath)
            stream.pipe(res)
            return
          }
        } catch (err) {
          // File not found, continue to Next.js handler
        }
      }

      // Handle public files
      if (pathname.startsWith('/public/')) {
        const filePath = path.join(__dirname, pathname)
        try {
          const stat = await fs.promises.stat(filePath)
          if (stat.isFile()) {
            const stream = fs.createReadStream(filePath)
            stream.pipe(res)
            return
          }
        } catch (err) {
          // File not found, continue to Next.js handler
        }
      }

      // Let Next.js handle all other routes
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

function getContentType(pathname) {
  const ext = path.extname(pathname)
  switch (ext) {
    case '.js':
      return 'application/javascript'
    case '.css':
      return 'text/css'
    case '.json':
      return 'application/json'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.ico':
      return 'image/x-icon'
    default:
      return 'application/octet-stream'
  }
} 