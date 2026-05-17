import 'dotenv/config'
import appDataSource from './db/dataSource.js'
import { createApp } from './createApp.js'

const app = createApp()
const port = Number(process.env.PORT) || 3000

appDataSource
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`)
    })
  })
  .catch((error: unknown) => {
    console.error('Failed to initialize database connection', error)
    process.exit(1)
  })
