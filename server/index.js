import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3002

const AllRoutes = [
  // Public
  '/login',
  '/reset-password',

  // Private
  '/',
  '/usuarios',
  '/usuarios/crear',
  '/usuarios/:id',
  '/cajeros',
  '/cajeros/crear',
  '/cajeros/:id',
  '/clientes',
  '/clientes/crear',
  '/clientes/:id',
  '/productos',
  '/productos/crear',
  '/productos/:id',
  '/productos/categorias',
  '/cajas',
  '/cajas/control',
  '/ventas',
  '/ventas/crear'
]

const distPath = path.resolve(__dirname, '../dist')
app.use(express.static(distPath))

// eslint-disable-next-line array-callback-return
AllRoutes.map((route) => {
  console.log(route)
  app.get(route, (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'))
  })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
})
