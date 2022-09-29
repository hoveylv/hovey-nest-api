import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Profile } from './profile.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @OneToOne(() => Profile)
  @JoinColumn({
    name: 'profile_id',
  })
  profile: Profile
}
