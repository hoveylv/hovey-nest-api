import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { Subject } from './subject.entity'
import { Teacher } from './teacher.entity'
import { TrainController } from './training.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [TrainController],
})
export class SchoolModule {}
