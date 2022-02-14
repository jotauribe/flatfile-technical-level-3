import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SectionEntity } from '../entities/Section'
import { Repository } from 'typeorm'

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(SectionEntity)
    private sectionsRepository: Repository<SectionEntity>
  ) {}

  async findAll(): Promise<SectionEntity[]> {
    const sections = await this.sectionsRepository.find({ relations: ['cards', 'cards.subtasks'] })
    return sections.map((section) => {
      const cardsWithoutParent = section.cards.filter((card) => !card.parentId)
      return { ...section, cards: cardsWithoutParent }
    })
  }
}
