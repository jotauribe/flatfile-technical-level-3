import { Body, Controller, Logger, Patch, Post } from '@nestjs/common'
import { CardEntity } from '../entities/Card'
import { CardsService } from './cards.service'

@Controller('cards')
export class CardsController {
  private readonly logger = new Logger(CardsController.name)

  constructor(private cardsService: CardsService) {}

  @Post()
  addCard(@Body() card: { sectionId: number; title: string }): Promise<CardEntity> {
    this.logger.log('POST /cards')

    return this.cardsService.create(card)
  }

  @Patch()
  updateCard(@Body() card: { id: number, sectionId: number; title: string }): Promise<CardEntity> {
    this.logger.log('PATCH /cards')

    return this.cardsService.update(card)
  }
}
