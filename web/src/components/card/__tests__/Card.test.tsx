import React from 'react'
import { render, cleanup, screen, within, getByTestId } from '@testing-library/react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import userEvent from '@testing-library/user-event'

import { clone } from '../../../utils'
import Card, { CardProps } from '..'

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

describe('<Card />', () => {
  const renderComponent = (otherProps: Partial<CardProps> = {}) => {
    const props = {
      card: section.cards[0],
      section,
      draggable: true,
      onDrop: jest.fn()
    }

    render(
      <DndProvider backend={HTML5Backend}>
        <Card {...props} {...otherProps} />
      </DndProvider>
    )
    return props
  }

  afterEach(cleanup)

  it('renders successfully', async () => {
    renderComponent()

    expect(screen.getByText('Drag and Drop')).toBeVisible()
    expect(screen.getByText('2 subtasks')).toBeVisible()
  })

  it('opens modal with subtasks when click on card', async () => {
    renderComponent()
    const dropZone = screen.getByTestId('card-drop-zone')

    expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()

    userEvent.click(dropZone)

    const modal = screen.getByTestId('card-modal')
    expect(modal).toBeVisible()
    expect(within(modal).getAllByRole('listitem')).toHaveLength(2)
  })

  it('doesnt open modal with subtasks when click on cardwhen card doesnt have subtasks', async () => {
    const clonedCard = clone(section.cards[0])
    clonedCard.subtasks = []
    renderComponent({ card: clonedCard })

    const dropZone = screen.getByTestId('card-drop-zone')

    expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()

    userEvent.click(dropZone)

    expect(screen.queryByTestId('card-modal')).not.toBeInTheDocument()
  })

  it('renders singular text when only one subtask is present', async () => {
    const clonedCard = clone(section.cards[0])
    clonedCard.subtasks = [clonedCard.subtasks[0]]
    renderComponent({ card: clonedCard })

    expect(screen.getByText('Drag and Drop')).toBeVisible()
    expect(screen.getByText('1 subtask')).toBeVisible()
  })

  it('doesnt render subtasks counter when no subtasks are present', async () => {
    const clonedCard = clone(section.cards[0])
    clonedCard.subtasks = []
    renderComponent({ card: clonedCard })

    expect(screen.queryByText('Drag and Drop')).toBeVisible()
    expect(screen.queryByText('1 subtask')).toBeNull()
  })
})
