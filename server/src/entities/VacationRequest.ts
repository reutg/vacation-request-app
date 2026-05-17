import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

export type VacationRequestStatus = 'Pending' | 'Approved' | 'Rejected'

@Entity({ name: 'vacation_requests' })
export class VacationRequest {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id', type: 'int' })
  userId!: number

  @Column({ name: 'start_date', type: 'date' })
  startDate!: string

  @Column({ name: 'end_date', type: 'date' })
  endDate!: string

  @Column({ type: 'text' })
  reason!: string

  @Column({ type: 'varchar', length: 20, default: 'Pending' })
  status!: VacationRequestStatus

  @Column({ type: 'text', nullable: true })
  comments!: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt!: Date
}
