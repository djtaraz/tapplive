import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Link } from 'wouter'
import { useClickOutside } from '../hooks/useClickOutside'

const FlyoutMenu = forwardRef(({ elements, targetRef }, ref) => {
    const menuRef = useRef()
    const [isOpened, setOpened] = useState(false)
    const [isDestroyed, setDestroyed] = useState(true)
    const classes = cn(
        'absolute left-1/2 bottom-full border border-gray-light bg-white rounded-1.5 overflow-hidden py-2 z-100',
        '-translate-x-1/2 transition-all duration-300',
        isOpened ? 'opacity-100 transform -translate-y-1' : 'opacity-0 transform -translate-y-2.5',
    )
    const handleClose = () => {
        setOpened(false)
        setTimeout(() => {
            setDestroyed(true)
        }, 200)
    }

    useClickOutside(targetRef, handleClose, 'mousedown')

    useImperativeHandle(
        ref,
        () => ({
            close: handleClose,
            open: handleOpen,
            isOpened,
        }),
        [isOpened],
    )

    const handleOpen = () => {
        setDestroyed(false)
        setTimeout(() => {
            setOpened(true)
        }, 10)
    }

    return !isDestroyed ? (
        <div ref={menuRef} style={{ minWidth: '80px', maxWidth: '160px' }} className={classes}>
            {elements.map((el) => (
                <Link key={el._id} to={`/tags/${el._id}`}>
                    <a className="block py-1 px-3.5 text-xs hover:bg-gray-pale truncate text-black-theme">{el.name}</a>
                </Link>
            ))}
        </div>
    ) : null
})
FlyoutMenu.propTypes = {
    elements: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
        }),
    ),
}

export default FlyoutMenu
