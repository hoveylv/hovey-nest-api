import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Attendee } from './attendee.entity'

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  when: Date

  @Column()
  address: string

  @OneToMany(() => Attendee, attendee => attendee.event, {
    eager: true,
    cascade: true,
  })
  attendees: Attendee[]

  attendee_count?: number
  attendee_rejected?: number
  attendee_maybe?: number
  attendee_accepted?: number
}
