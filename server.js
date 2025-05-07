import express from 'express'
import { join } from 'path'

const app = express()
const port = 3002

// Servir archivos estáticos desde "dist"
app.use(express.static(join(__dirname, 'dist')))

// Manejar rutas SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
