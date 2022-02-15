import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { SectionsService } from './sections.service'
import { SectionEntity } from '../entities/Section'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

export const repositoryMockFactory: () => MockType<Repository<jest.Mock>> = jest.fn(() => ({
  find: jest.fn((entity) => entity),
}))

describe('CardsService', () => {
  let service: SectionsService
  let repositoryMock: MockType<Repository<SectionEntity>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectionsService,
        { provide: getRepositoryToken(SectionEntity), useFactory: repositoryMockFactory },
      ],
    }).compile()

    service = module.get<SectionsService>(SectionsService)
    repositoryMock = module.get(getRepositoryToken(SectionEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return all sections', async () => {
    const allCards = [
      { id: 1, sectionId: 1, title: '1', subtasks: [] },
      { id: 2, parentId: 1, sectionId: 2, title: '2', subtasks: [] },
    ]
    const allSections = [{ id: 1, sectionId: 1, title: 'title', cards: allCards }]
    repositoryMock.find.mockReturnValueOnce(Promise.resolve(allSections))
    const result = await service.findAll()

    expect(result).toEqual([{ ...result[0], cards: [allCards[0]] }])
    expect(repositoryMock.find).toBeCalledWith({ relations: ['cards', 'cards.subtasks'] })
  })
})
