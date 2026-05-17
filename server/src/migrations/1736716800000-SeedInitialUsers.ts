import type { MigrationInterface, QueryRunner } from 'typeorm'

export class SeedInitialUsers1736716800000 implements MigrationInterface {
  name = 'SeedInitialUsers1736716800000'

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        role VARCHAR(20) NOT NULL
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vacation_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users (id),
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        comments TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    await queryRunner.query(`
      INSERT INTO users (id, name, role)
      VALUES
        (1, 'Requester', 'Requester'),
        (2, 'Validator', 'Validator')
      ON CONFLICT (id) DO NOTHING
    `)

    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('users', 'id'),
        (SELECT COALESCE(MAX(id), 1) FROM users)
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const hasVacationRequests = await queryRunner.hasTable('vacation_requests')
    if (hasVacationRequests) {
      await queryRunner.query(`DELETE FROM vacation_requests WHERE user_id IN (1, 2)`)
    }

    await queryRunner.query(`DELETE FROM users WHERE id IN (1, 2)`)
  }
}
