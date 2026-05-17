import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

export type UserRole = 'Requester' | 'Validator'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 120 })
  name!: string

  @Column({ type: 'varchar', length: 20 })
  role!: UserRole
}
