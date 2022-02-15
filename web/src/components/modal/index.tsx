import React from 'react'
import { IoIosClose } from 'react-icons/io'
import { MdChromeReaderMode } from 'react-icons/md'

import {
  CloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  WindowOverlay,
  ModalSubTitle
} from './styled-components'

type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean
  subtitle: string
  onRequestClose: Function
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  subtitle,
  children,
  onRequestClose,
  ...otherProps
}) => {
  if (!open) return null

  return (
    <WindowOverlay >
      <ModalContainer {...otherProps}>
        <ModalHeader>
          <ModalTitle>
            <MdChromeReaderMode size={24} />
            {title}
          </ModalTitle>
          <CloseButton onClick={() => onRequestClose()}>
            <IoIosClose size={32} />
          </CloseButton>
        </ModalHeader>
        <ModalSubTitle>{subtitle}</ModalSubTitle>
        {children}
      </ModalContainer>
    </WindowOverlay>
  )
}

export default Modal
