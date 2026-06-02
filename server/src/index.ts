import express from 'express'
import cors from 'cors'
import { healthRouter } from './routes/health'
import { errorHandler } from './middleware/errorHandler'
import { getPort } from './config/env'

const app = express()
const port = getPort()

app.use(cors())
app.use(express.json())

app.use('/api', healthRouter)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`[mistake-star-map-server] running on http://localhost:${port}`)
})
