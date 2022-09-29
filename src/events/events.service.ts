import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateOptions, paginate } from 'src/pagination/paginator'
import { ListEvents, WhenEventFilter } from './dto/list.events'
import { Event } from './entities/event.entity'
import { AttendeeAnswerEnum } from './entities/attendee.entity'

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository.createQueryBuilder('e').orderBy('e.id', 'ASC')
  }

  public async getEventWithAttendeeCount(id: string): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere('e.id = :id', { id })
    this.logger.debug(query.getSql())
    return await query.getOne()
  }

  public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('a.attendee_count', 'e.attendees')
      .loadRelationCountAndMap('e.attendee_accepted', 'e.attendees', 'attendee', qb =>
        qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Accepted })
      )
      .loadRelationCountAndMap('e.attendee_maybe', 'e.attendees', 'attendee', qb =>
        qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Maybe })
      )
      .loadRelationCountAndMap('e.attendee_rejected', 'e.attendees', 'attendee', qb =>
        qb.where('attendee.answer = :answer', { answer: AttendeeAnswerEnum.Rejected })
      )
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    console.log(filter)

    let query = this.getEventsWithAttendeeCountQuery()

    if (!filter) {
      return query
    }
    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere('e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY')
      }
      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere('e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY')
      }
      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1)')
      }
      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere('YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1) + 1')
      }
    }
    return await query
  }

  public async getEventsWithAttendeeCountFilteredPaginated(filter: ListEvents, paginateOptions: PaginateOptions) {
    return await paginate(await this.getEventsWithAttendeeCountFiltered(filter), paginateOptions)
  }

  public async getEvent(id: string): Promise<Event | undefined> {
    const query = this.getEventsBaseQuery().andWhere('e.id = :id', { id })
    this.logger.debug(query.getSql())
    return await query.getOne()
  }

  public async deleteEvent(id: string): Promise<DeleteResult> {
    return await this.eventsRepository.createQueryBuilder('e').delete().where('id = :id', { id }).execute()
  }
}
