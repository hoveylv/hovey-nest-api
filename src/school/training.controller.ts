import { Controller, Post } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subject } from './subject.entity'
import { Teacher } from './teacher.entity'

@Controller('school')
export class TrainController {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>
  ) {}

  @Post('/create')
  public async savingRelation() {
    // const subject = new Subject()
    // subject.name = 'Sports'

    // await this.subjectRepository.save(subject)

    // const teacher1 = new Teacher()
    // teacher1.name = 'Tracy McGrady'

    // const teacher2 = new Teacher()
    // teacher2.name = 'Kobe Bryant'

    // // subject.teachers = [teacher1, teacher2]
    // await this.teacherRepository.save([teacher1, teacher2])

    const subject = await this.subjectRepository.findOne({
      where: {
        id: '1e6e8970-589d-4ad7-9579-0314b3d96ac8',
      },
    })

    const teacher1 = await this.teacherRepository.findOne({
      where: {
        id: 'cea59945-0df5-4a89-bda9-2c375fd276f2',
      },
    })

    const teacher2 = await this.teacherRepository.findOne({
      where: {
        id: 'e80cd88e-ea1d-45e9-855d-4d5f02b30bf0',
      },
    })

    return await this.subjectRepository
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2])
  }

  @Post('/remove')
  public async removeRelation() {
    //   const subject = await this.subjectRepository.findOne({
    //     where: {
    //       id: 'e523b47b-8946-4331-9080-be6f84211c00',
    //     },
    //     relations: ['teachers'],
    //   })
    //   subject.teachers = subject.teachers.filter(teacher => teacher.id !== '26983790-ffb2-4af4-9d46-7aabd788cd55')
    //   await this.subjectRepository.save(subject)
    await this.subjectRepository.createQueryBuilder('s').update().set({ name: 'Confidential' }).execute()
  }
}
