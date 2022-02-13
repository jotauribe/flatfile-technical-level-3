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

  create({ sectionId, title }: { sectionId: number; title: string }): Promise<CardEntity> {
    const card = new CardEntity()
    card.title = title
    card.sectionId = sectionId
    return this.cardsRepository.save(card)
  }

  async update({ id, sectionId, title }: { id: number, sectionId: number; title: string }): Promise<CardEntity> {
    const card = await this.cardsRepository.findOne(id)
    card.title = title || card.title
    card.sectionId = sectionId || card.sectionId
    return this.cardsRepository.save(card)
  }
}
