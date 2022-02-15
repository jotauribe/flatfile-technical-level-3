import { Test, TestingModule } from '@nestjs/testing'
import { SectionEntity } from '../entities/Section'
import { Repository } from 'typeorm'
import { SectionsController } from './sections.controller'
import { SectionsService } from './sections.service'
import { getRepositoryToken } from '@nestjs/typeorm'

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>
}

export const repositoryMockFactory: () => MockType<Repository<jest.Mock>> = jest.fn(() => ({
  findOne: jest.fn((entity) => entity),
}))

describe('SectionController', () => {
  let controller: SectionsController
  let service: SectionsService
  let repositoryMock: MockType<Repository<SectionEntity>>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SectionsController],
      providers: [
        SectionsService,
        {
          provide: getRepositoryToken(SectionEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile()

    controller = module.get<SectionsController>(SectionsController)
    service = module.get<SectionsService>(SectionsService)
    repositoryMock = module.get(getRepositoryToken(SectionEntity))
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return all sections', async () => {
    const allSections = [{ id: 1, title: 'section', cards: [] }]
    jest.spyOn(service, 'findAll').mockReturnValueOnce(Promise.resolve(allSections))
    expect(await controller.getAllSections()).toEqual(allSections)
    expect(service.findAll).toBeCalledWith()
  })
})
