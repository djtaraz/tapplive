import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import cn from 'classnames'

import { ReactComponent as CloseIcon } from 'assets/svg/close-circle.svg'
import { ReactComponent as WarningIcon } from 'assets/svg/warning.svg'

const Alert = forwardRef(({ isOpened: isOpenedByDefault, message }, ref) => {
    const [isOpened, setOpened] = useState(isOpenedByDefault)
    const [isDestroyed, setDestroyed] = useState(true)

    useEffect(() => {
        return () => {
            clearAllBodyScrollLocks()
        }
    }, [])

    const overlayCn = cn(
        'fixed inset-0 pt-2 flex items-start justify-center z-100 transition-opacity duration-250',
        isOpened ? 'opacity-100' : 'opacity-0',
    )

    const alertCn = cn(
        'flex items-center justify-center mt-20 py-6 px-8 rounded-2.5 bg-pink-alert relative z-50 transition-opacity',
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
                      className={alertCn}
                      onClick={(e) => {
                          e.stopPropagation()
                      }}>
                      <CloseIcon className="cursor-pointer absolute -top-1 -right-1" onClick={handleClose} />
                      <WarningIcon className="mr-2" />
                      <div className="text-white text-s font-bold">{message}</div>
                  </div>
              </div>,
              document.getElementById('alert-root'),
          )
        : null
})

Alert.defaultProps = {
    isOpened: false,
}
Alert.propTypes = {
    isOpened: PropTypes.bool,
    message: PropTypes.string.isRequired,
}

export default Alert
