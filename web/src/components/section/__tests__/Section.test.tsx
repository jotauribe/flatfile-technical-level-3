import React from 'react'
import { render, cleanup, screen, within } from '@testing-library/react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import userEvent from '@testing-library/user-event'

import { clone } from '../../../utils'
import Section, { SectionProps } from '..'

const section = {
  id: 1,
  title: 'Backlog',
  cards: [
    {
      id: 1,
      title: 'Drag and Drop',
      parentId: null,
      sectionId: 1,
      subtasks: [
        { id: 3, parentId: 1, sectionId: 1, title: 'Subtask 1', subtasks: [] },
        { id: 4, parentId: 1, sectionId: 1, title: 'Subtask 2', subtasks: [] }
      ]
    }
  ]
}

describe('<Section />', () => {
  const renderComponent = (otherProps: Partial<SectionProps> = {}) => {
    const props = {
      section,
      onDropInCard: jest.fn(),
      onDropInSection: jest.fn(),
      onCardSubmit: jest.fn()
    }

    render(
      <DndProvider backend={HTML5Backend}>
        <Section {...props} {...otherProps} />
      </DndProvider>
    )
    return props
  }

  afterEach(cleanup)

  it('renders sections successfully', async () => {
    renderComponent()

    const backlog = screen.getByRole('list', { name: /backlog/i })
    const card = screen.getByRole('listitem', { name: /drag and drop/i })

    expect(within(backlog).getAllByRole('listitem')).toHaveLength(1)
    expect(within(card).getByText('Drag and Drop')).toBeVisible()
    expect(within(card).getByText('2 subtasks')).toBeVisible()
  })

  it('renders singular text when only one subtask is present', async () => {
    const clonedSection = clone(section)
    clonedSection.cards[0].subtasks = [
      { id: 3, parentId: 1, sectionId: 1, title: 'Subtask 1', subtasks: [] }
    ]
    renderComponent({ section: clonedSection })

    const card = screen.getByRole('listitem', { name: /drag and drop/i })

    expect(within(card).getByText('1 subtask')).toBeVisible()
  })

  it('doesnt render subtasks counter when no subtasks are present', async () => {
    const clonedSection = clone(section)
    clonedSection.cards[0].subtasks = []
    renderComponent({ section: clonedSection })

    const card = screen.getByRole('listitem', { name: /drag and drop/i })

    expect(within(card).queryByText('1 subtask')).toBeNull()
  })

  it('renders text area after clicking on add new card button', async () => {
    const clonedSection = clone(section)
    clonedSection.cards[0].subtasks = []
    renderComponent({ section: clonedSection }) 

    const sectionNode = screen.getByTestId('section')
    const button = within(sectionNode).getByRole('button')
    userEvent.click(button)


    expect(within(sectionNode).getByPlaceholderText('Enter a title for the new card')).toBeVisible()
  })

  it('adds new card to list', async () => {
    const clonedSection = clone(section)
    clonedSection.cards[0].subtasks = []
    const props = renderComponent({ section: clonedSection })

    const sectionNode = screen.getByTestId('section')
    userEvent.click(within(sectionNode).getByRole('button', { name: /add another card/i }))
    const input = within(sectionNode).getByPlaceholderText('Enter a title for the new card')
    userEvent.type(input, 'Another Card')
    userEvent.click(within(sectionNode).getByRole('button', { name: /add card/i }))


    expect(props.onCardSubmit).toBeCalledWith(1, 'Another Card' )
  })
})
