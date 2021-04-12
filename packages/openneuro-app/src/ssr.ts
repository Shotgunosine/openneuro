import fs from 'fs'
import path from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import cookiesMiddleware from 'universal-cookie-express'

const development = process.env.NODE_ENV === 'development'

const selfDestroyingServiceWorker = `self.addEventListener('install', function(e) {
  self.skipWaiting()
})

self.addEventListener('activate', function(e) {
  self.registration.unregister()
    .then(function() {
      return self.clients.matchAll()
    })
    .then(function(clients) {
      clients.forEach(client => client.navigate(client.url))
    })
})`

globalThis.OpenNeuroConfig = {
  CRN_SERVER_URL: process.env.CRN_SERVER_URL,
  GRAPHQL_URI: process.env.GRAPHQL_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GLOBUS_CLIENT_ID: process.env.GLOBUS_CLIENT_ID,
  ORCID_CLIENT_ID: process.env.ORCID_CLIENT_ID,
  ORCID_URI: process.env.ORCID_URI,
  ORCID_REDIRECT_URI: process.env.ORCID_REDIRECT_URI,
  GOOGLE_TRACKING_IDS: process.env.GOOGLE_TRACKING_IDS,
  ENVIRONMENT: process.env.ENVIRONMENT,
  SUPPORT_URL: process.env.SUPPORT_URL,
  DATALAD_GITHUB_ORG: process.env.DATALAD_GITHUB_ORG,
  AWS_S3_PUBLIC_BUCKET: process.env.AWS_S3_PUBLIC_BUCKET,
}

const configScript = `window.OpenNeuroConfig = ${JSON.stringify(
  globalThis.OpenNeuroConfig,
)}`

async function createServer(): Promise<void> {
  const app = express()

  let vite
  if (development) {
    // Create vite server in middleware mode. This disables Vite's own HTML
    // serving logic and let the parent server take control.
    vite = await createViteServer({
      root: __dirname,
      server: { middlewareMode: true, hmr: { port: 9992 } },
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use(express.static(path.resolve(__dirname, '../src/dist/client')))
  }

  app.use(cookiesMiddleware())

  app.use('*', (req, res) => {
    async function ssrHandler(): Promise<void> {
      const url = req.originalUrl

      if (url === '/sw.js') {
        res
          .status(200)
          .set({ 'Content-Type': 'application/javascript' })
          .end(selfDestroyingServiceWorker)
        return
      } else if (url === '/config.js') {
        res
          .status(200)
          .set({ 'Content-Type': 'application/javascript' })
          .end(configScript)
        return
      }

      try {
        // 1. Read index.html
        const index = development
          ? 'index.html'
          : '../src/dist/client/index.html'
        let template = fs.readFileSync(path.resolve(__dirname, index), 'utf-8')

        // 2. Apply vite HTML transforms. This injects the vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react-refresh
        if (development) template = await vite.transformIndexHtml(url, template)

        // 3. Load the server entry. vite.ssrLoadModule automatically transforms
        //    your ESM source code to be usable in Node.js! There is no bundling
        //    required, and provides efficient invalidation similar to HMR.
        const { render } = development
          ? await vite.ssrLoadModule('/server.jsx')
          : require('../src/dist/server/server.js')

        // 4. render the app HTML. This assumes entry-server.js's exported `render`
        //    function calls appropriate framework SSR APIs,
        //    e.g. ReactDOMServer.renderToString()
        const { react, apolloState, head } = await render(
          url,
          req['universalCookies'],
        )

        // 5. Inject the app-rendered HTML into the template.
        const interpolate = {
          head,
          react,
          apolloState,
        }
        const html = template.replace(/\${([^}]*)}/g, (r, k): string => {
          const replace: string = interpolate[k]
          return replace
        })

        // 6. Send the rendered HTML back.
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e) {
        // If an error is caught, let vite fix the stracktrace so it maps back to
        // your actual source code.
        if (development) {
          vite.ssrFixStacktrace(e)
        }
        console.error(e.stack)
        res.status(500).end(e.stack)
      }
    }
    void ssrHandler()
  })

  app.listen(development ? 9876 : 80)
}

void createServer()