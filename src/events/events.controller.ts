import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Attendee } from './entities/attendee.entity'
import { CreateEventDto } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { Event } from './entities/event.entity'
import { EventsService } from './events.service'
import { ListEvents } from './dto/list.events'

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,

    private readonly eventsService: EventsService
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(filter, {
      total: true,
      currentPage: filter.page,
      limit: 10,
    })

    return events
  }

  @Get('practice')
  async practice() {
    // const event = await this.repository.findOne({
    //   where: { id: 'b4dce77d-3e39-11ed-939e-0242ac120002' },
    //   // loadEagerRelations: false,
    // })
    // const attendee = await this.attendeeRepository.findOne({
    //   where: {
    //     id: '3c250288-84a9-43c4-b4ce-131f6a2d274f',
    //   },
    // })
    // // attendee.event = event
    // // // await this.attendeeRepository.save(attendee)
    // event.attendees.push(attendee)

    // await this.repository.save(event)
    // return event

    return await this.repository.createQueryBuilder('e').select(['e.id', 'e.name']).orderBy('e.id', 'DESC').getMany()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.getEventWithAttendeeCount(id)
    if (!event) {
      throw new NotFoundException()
    }
    return event
  }

  @Post()
  async create(@Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    })
  }

  @Patch(':id')
  async update(@Param('id') id, @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto) {
    const event = await this.repository.findOne({
      where: {
        id,
      },
    })

    if (!event) {
      throw new NotFoundException()
    }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    })
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const event = await this.repository.findOne({
      where: {
        id,
      },
    })

    const result = await this.eventsService.deleteEvent(id)
    if (result.affected !== 1) {
      throw new NotFoundException()
    }
  }
}
