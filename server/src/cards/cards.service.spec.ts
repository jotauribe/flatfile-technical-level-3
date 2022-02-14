import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CardEntity } from '../entities/Card'
import { CardsService } from './cards.service'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

export const repositoryMockFactory: () => MockType<Repository<jest.Mock>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
}))

describe('CardsService', () => {
  let service: CardsService
  let repositoryMock: MockType<Repository<CardEntity>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: getRepositoryToken(CardEntity), useFactory: repositoryMockFactory },
      ],
    }).compile()

    service = module.get<CardsService>(CardsService)
    repositoryMock = module.get(getRepositoryToken(CardEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a new card', async () => {
    repositoryMock.save.mockReturnValueOnce(
      Promise.resolve({ id: 1, sectionId: 1, title: 'title' })
    )
    await service.create({ sectionId: 1, title: 'test' })

    expect(repositoryMock.save).toBeCalledWith({ sectionId: 1, title: 'test' })
  })

  it('should update a card', async () => {
    repositoryMock.findOne.mockReturnValueOnce(
      Promise.resolve({ id: 1, sectionId: 1, title: 'title' })
    )

    const expectedResult = { id: 1, sectionId: 2, title: 'title' }
    const result = await service.update({ id: 1, sectionId: 2 })

    expect(result).toEqual(expectedResult)
    expect(repositoryMock.findOne).toBeCalledWith(1)
    expect(repositoryMock.save).toBeCalledWith(expectedResult)
  })
})
