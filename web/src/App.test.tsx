import React from 'react'
import axios from 'axios'
import { render, cleanup, screen, within, waitFor, fireEvent } from '@testing-library/react'

import App from './App'
import { clone } from './utils'

jest.mock('axios')

describe('<App />', () => {
  let axiosMock: jest.Mocked<typeof axios>
  const sections = [
    {
      id: 1,
      title: 'Backlog',
      cards: [
        {
          id: 1,
          title: 'Drag and Drop',
          sectionId: 1,
          subtasks: [{ id: 3, parentId: 1, sectionId: 1, title: 'Subtask' }]
        }
      ]
    },
    {
      id: 2,
      title: 'Ready for Development',
      cards: []
    }
  ]

  beforeEach(() => {
    axiosMock = axios as jest.Mocked<typeof axios>
    axiosMock.get.mockResolvedValue({ data: sections })
    axiosMock.patch.mockImplementation(() => Promise.resolve())
  })

  afterEach(cleanup)

  it('matches snapshot', async () => {
    const { asFragment } = render(<App />)

    await screen.findByText('Backlog')

    expect(asFragment).toMatchSnapshot()
  })

  it('renders sections successfully', async () => {
    render(<App />)

    const backlogText = await screen.findByText('Backlog')
    const readyForDevelopmentText = await screen.findByText('Ready for Development')

    expect(backlogText.nodeName).toBe('H1')
    expect(readyForDevelopmentText.nodeName).toBe('H1')
  })

  it('renders sections successfully', async () => {
    render(<App />)
    await waitFor(() => screen.getAllByRole('list'))

    const backlog = screen.getByLabelText(/backlog/i)
    const readyForDevelopment = screen.getByRole('list', { name: /ready for development/i })
    const card = screen.getByRole('listitem', { name: /drag and drop/i })

    expect(within(backlog).getAllByRole('listitem')).toHaveLength(1)
    expect(within(readyForDevelopment).queryAllByRole('listitem')).toHaveLength(0)
    expect(within(card).getByText('Drag and Drop')).toBeVisible()
    expect(within(card).getByText('1 subtask')).toBeVisible()
  })

  it('when a card from a given section is dropped over another the given card is moved', async () => {
    render(<App />)
    await waitFor(() => screen.getAllByRole('list'))

    const backlog = screen.getByLabelText(/backlog/i)
    const card = within(backlog).getByRole('listitem', { name: /drag and drop/i })
    const readyForDevelopment = screen.getByRole('list', { name: /ready for development/i })

    expect(card).toBeVisible()
    expect(within(backlog).getAllByRole('listitem')).toHaveLength(1)
    expect(within(readyForDevelopment).queryAllByRole('listitem')).toHaveLength(0)

    fireEvent.dragStart(card)
    fireEvent.dragEnter(readyForDevelopment)
    fireEvent.dragOver(readyForDevelopment)
    fireEvent.drop(readyForDevelopment)

    const movedCard = within(readyForDevelopment).getByRole('listitem', { name: /drag and drop/i })
    expect(movedCard).toBeVisible()
    expect(within(backlog).queryAllByRole('listitem')).toHaveLength(0)
    expect(within(readyForDevelopment).getAllByRole('listitem')).toHaveLength(1)
  })

  it('when a card from a given section is dropped over another card the given card is added as subtask', async () => {
    const clonedSections = clone(sections)
    clonedSections[0].cards[0].subtasks = []
    clonedSections[1].cards = [{ id: 3, sectionId: 1, title: 'Target', subtasks: [] }]
    axiosMock.get.mockResolvedValueOnce({ data: clonedSections })
    render(<App />)
    await waitFor(() => screen.getAllByRole('list'))

    const backlog = screen.getByLabelText(/backlog/i)
    const readyForDevelopment = screen.getByRole('list', { name: /ready for development/i })
    const sourceCard = within(backlog).getByRole('listitem', { name: /drag and drop/i })
    const targetCard = within(readyForDevelopment).getByRole('listitem', { name: /target/i })
    const dropZone = within(targetCard).getByTestId('card-drop-zone')

    expect(sourceCard).toBeVisible()
    expect(within(targetCard).queryByText('1 subtask')).not.toBeInTheDocument()
    expect(within(backlog).getAllByRole('listitem')).toHaveLength(1)
    expect(within(readyForDevelopment).queryAllByRole('listitem')).toHaveLength(1)

    fireEvent.dragStart(sourceCard)
    fireEvent.dragEnter(dropZone)
    fireEvent.dragOver(dropZone)
    fireEvent.drop(dropZone)

    const movedCard = within(backlog).queryByRole('listitem', { name: /drag and drop/i })
    expect(movedCard).not.toBeInTheDocument()
    expect(within(backlog).queryAllByRole('listitem')).toHaveLength(0)
    expect(within(readyForDevelopment).getAllByRole('listitem')).toHaveLength(1)
    expect(within(targetCard).getByText('1 subtask')).toBeVisible()
  })
})
