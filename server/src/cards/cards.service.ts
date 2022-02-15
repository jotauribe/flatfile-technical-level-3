import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CardEntity } from '../entities/Card'
import { Repository } from 'typeorm'

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private cardsRepository: Repository<CardEntity>
  ) {}

  create({ sectionId, title }: Partial<CardEntity>): Promise<CardEntity> {
    const card = new CardEntity()
    card.title = title
    card.sectionId = sectionId
    return this.cardsRepository.save(card)
  }

  async update({ id, parentId, sectionId, title, subtasks }: Partial<CardEntity>): Promise<CardEntity> {
    const card = await this.cardsRepository.findOne(id)
    card.title = title || card.title
    card.sectionId = sectionId || card.sectionId
    card.parentId = parentId || card.parentId
    card.subtasks = subtasks || card.subtasks
    return this.cardsRepository.save(card)
  }
}
