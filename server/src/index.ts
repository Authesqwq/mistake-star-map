import app from './app'
import { getPort } from './config/env'

const port = getPort()

app.listen(port, () => {
  console.log(`[mistake-star-map-server] running on http://localhost:${port}`)
})
