import type { DataSource } from 'typeorm'

export async function resetDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query(
    'TRUNCATE TABLE "vacation_requests", "users" RESTART IDENTITY CASCADE',
  )
}
