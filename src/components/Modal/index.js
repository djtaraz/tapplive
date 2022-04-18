import React, { useState, useImperativeHandle, forwardRef, useEffect, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import cn from 'classnames'

import { ReactComponent as CloseIcon } from 'assets/svg/close.svg'

const ModalContext = createContext({})
export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('Component must be used inside the ModalContext provider.')
    }
    return context
}
const Modal = forwardRef(({ isOpened: isOpenedByDefault, size, onClose, children }, ref) => {
    const [isOpened, setOpened] = useState(isOpenedByDefault)
    const [isDestroyed, setDestroyed] = useState(!isOpenedByDefault)
    const [onCloseAction, setOnCloseAction] = useState()

    useEffect(() => {
        return () => {
            clearAllBodyScrollLocks()
        }
    }, [])

    const overlayCn = cn(
        'fixed inset-0 flex items-center justify-center bg-overlay z-150 transition-opacity duration-250 px-5',
        isOpened ? 'opacity-100' : 'opacity-0',
    )

    const modalCn = cn(
        'flex flex-col rounded-2.5 min-width-sm bg-white overflow-hidden relative z-50 transition-opacity',
        {
            'w-460p h-488p': size === 'sm',
            'w-878p h-4/5': size === 'md',
            'w-auto': size === 'unset',
            'min-h-488p': size !== 'unset',
        },
    )

    useImperativeHandle(ref, () => ({
        open: handleOpen,
        close: handleClose,
    }))

    const handleClose = () => {
        setOpened(false)
        setTimeout(() => {
            setDestroyed(true)
            enableBodyScroll(document.body)
            if (onClose) {
                onClose()
            }
            if (onCloseAction) {
                onCloseAction()
            }
        }, 250)
    }

    const handleOpen = () => {
        setDestroyed(false)
        disableBodyScroll(document.body, { reserveScrollBarGap: true })
        setTimeout(() => {
            setOpened(true)
        }, 10)
    }

    const handleOverlayClick = () => {
        handleClose()
    }

    return !isDestroyed
        ? ReactDOM.createPortal(
              <div className={overlayCn} onClick={handleOverlayClick}>
                  <div
                      className={modalCn}
                      onClick={(e) => {
                          e.stopPropagation()
                      }}>
                      <div className="flex relative px-8 pt-7.5 pb-6 z-50">
                          <CloseIcon className="ml-auto cursor-pointer" onClick={handleClose} />
                      </div>
                      <div className="flex justify-center flex-1 overflow-hidden">
                          <ModalContext.Provider value={{ setOnCloseAction, closeModal: handleClose }}>
                              {children}
                          </ModalContext.Provider>
                      </div>
                  </div>
              </div>,
              document.getElementById('modal-root'),
          )
        : null
})

Modal.defaultProps = {
    isOpened: false,
    size: 'sm',
    onClose: () => {},
}
Modal.propTypes = {
    isOpened: PropTypes.bool,
    onClose: PropTypes.func,
    size: PropTypes.oneOf(['sm', 'md', 'unset']),
}

export default Modal
