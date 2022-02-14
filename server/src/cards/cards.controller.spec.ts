import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CardEntity } from '../entities/Card'
import { CardsController } from './cards.controller'
import { CardsService } from './cards.service'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

export const repositoryMockFactory: () => MockType<Repository<jest.Mock>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}))

describe('CardsController', () => {
  let controller: CardsController
  let service: CardsService
  let repositoryMock: MockType<Repository<CardEntity>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(CardEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<CardsController>(CardsController)
    service = module.get<CardsService>(CardsService)
    repositoryMock = module.get(getRepositoryToken(CardEntity))
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call save on cards service', async () => {
    const card = new CardEntity()
    card.title = 'test'
    card.sectionId = 1
    jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(card))
    expect(await controller.addCard({ sectionId: 1, title: 'test' })).toBe(card)
  })

  it('should call update on cards service', async () => {
    const card = { id: 1, sectionId: 1, title: 'test' } as CardEntity
    jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(card))
    const result = await controller.updateCard({ id: 1, sectionId: 1, title: 'test' })

    expect(result).toBe(card)
    expect(service.update).toBeCalledWith(card)
  })
})
