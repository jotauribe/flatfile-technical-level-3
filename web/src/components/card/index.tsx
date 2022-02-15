import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import styled from 'styled-components'
import { MdSubject } from 'react-icons/md'

import CardI from '../../types/card'

type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  card: CardI
  draggable?: boolean
  onDrop?: Function
}

const CardContainer = styled.div`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  cursor: pointer;
  min-width: 230px;
  padding: 8px;
  :hover {
    background-color: rgb(244, 245, 255);
    color: #172b4d;
  }
`

const Badge = styled.span`
  display: flex;
  padding: 4px 0;
  font-size: 12px;
  gap: 4px;
`

const CardTitle = styled.header``

const Card: React.FC<CardProps> = ({
  card: card,
  draggable: canDrag = false,
  onDrop,
  ...otherProps
}) => {
  const { id, title, subtasks = [] } = card
  const hasSubtasks = subtasks.length > 0
  const hasMoreThanOneSubtask = subtasks.length > 1
  const handleDrop = (draggedItem: CardI) => onDrop && onDrop(id, draggedItem)
  const [, drag] = useDrag(() => ({ type: 'CARD', item: card, canDrag }), [card, canDrag])
  const [, drop] = useDrop(() => ({ accept: 'CARD', drop: handleDrop }), [card, onDrop])

  return (
    <CardContainer
      ref={drag}
      className='card'
      aria-labelledby={`card-header-${id}`}
      {...otherProps}
    >
      <div ref={drop} className='card-drop-zone' data-testid="card-drop-zone">
        <CardTitle id={`card-header-${id}`}>{title}</CardTitle>
        <div className='card-subtasks'>
          {hasSubtasks && (
            <Badge>
              <MdSubject size={16} />{' '}
              {`${subtasks.length} ${hasMoreThanOneSubtask ? 'subtasks' : 'subtask'}`}
            </Badge>
          )}
        </div>
      </div>
    </CardContainer>
  )
}

export default Card
