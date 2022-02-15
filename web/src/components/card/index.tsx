import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'
import { MdSubject } from 'react-icons/md'

import CardI from '../../types/card'
import SectionI from '../../types/section'
import { Badge, CardContainer, CardDropZone, ModalSubTitle } from './styled-components'
import Modal from '../modal'

export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  card: CardI
  section: SectionI
  draggable?: boolean
  onDrop?: Function
}

const CardTitle = styled.header``

const Card: React.FC<CardProps> = ({
  card,
  section,
  draggable: canDrag = false,
  onDrop,
  ...otherProps
}) => {
  const [isModalOpen, setModalIsOpen] = useState(false)
  const { id, title, subtasks = [] } = card
  const hasSubtasks = subtasks.length > 0
  const hasMoreThanOneSubtask = subtasks.length > 1
  const handleDrop = (draggedItem: CardI) => onDrop && onDrop(id, draggedItem)
  const [, drag] = useDrag(() => ({ type: 'CARD', item: card, canDrag }), [card, canDrag])
  const [, drop] = useDrop(() => ({ accept: 'CARD', drop: handleDrop }), [card, onDrop])

  const closeModal = () => setModalIsOpen(false)
  const openModal = () => {
    if (hasSubtasks) setModalIsOpen(true)
  }

  return (
    <CardContainer
      ref={drag}
      className='card'
      aria-labelledby={`card-header-${id}`}
      {...otherProps}
    >
      <Modal
        open={isModalOpen}
        title={title}
        subtitle={`en la lista ${section.title}`}
        data-testid='card-modal'
        onRequestClose={closeModal}
      >
        <ModalSubTitle>
          <MdSubject size={20} />
          Subtasks
        </ModalSubTitle>
        <ul>
          {subtasks.map((subtask) => (
            <li key={subtask.id}>{subtask.title}</li>
          ))}
        </ul>
      </Modal>
      <CardDropZone
        ref={drop}
        className='card-drop-zone'
        data-testid='card-drop-zone'
        onClick={openModal}
      >
        <CardTitle id={`card-header-${id}`}>{title}</CardTitle>
        <div className='card-subtasks'>
          {hasSubtasks && (
            <Badge>
              <MdSubject size={16} />{' '}
              {`${subtasks.length} ${hasMoreThanOneSubtask ? 'subtasks' : 'subtask'}`}
            </Badge>
          )}
        </div>
      </CardDropZone>
    </CardContainer>
  )
}

export default Card
