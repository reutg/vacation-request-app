import 'reflect-metadata'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DataSource } from 'typeorm'
import { User } from '../entities/User.js'
import { VacationRequest } from '../entities/VacationRequest.js'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const appDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [User, VacationRequest],
  migrations: [path.join(__dirname, '../migrations/*.js')],
  migrationsTableName: 'typeorm_migrations',
  synchronize: process.env.DB_SYNCHRONIZE !== 'false',
})

export default appDataSource
