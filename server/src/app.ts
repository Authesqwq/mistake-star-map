import express from 'express'
import cors from 'cors'
import { requestLogger } from './middleware/requestLogger'
import { healthRouter } from './routes/health'
import { mockRouter } from './routes/mock'
import { notFoundHandler } from './middleware/notFoundHandler'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api', healthRouter)
app.use('/api/mock', mockRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
