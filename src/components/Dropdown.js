import React, { useEffect, useState, useRef, memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { ReactComponent as ChevronDownIcon } from '../assets/svg/chevron-down.svg'

function Dropdown({ items, active, onClick }) {
    const containerRef = useRef()
    const [isOpened, setIsOpened] = useState()
    const itemClasses = (value) =>
        cn('text-s font-bold py-1.5 px-5 hover:bg-gray-pale capitalize', { 'text-violet-saturated': active.value === value })

    useEffect(() => {
        function onClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpened(false)
            }
        }

        document.addEventListener('mousedown', onClickOutside)

        return () => {
            document.removeEventListener('mousedown', onClickOutside)
        }
    }, [])

    useEffect(() => {
        setIsOpened(false)
    }, [active])

    return (
        <div
            ref={containerRef}
            onClick={() => setIsOpened(true)}
            style={{minWidth: '130px'}}
            className="relative flex items-center justify-between px-5 py-3.5 rounded-2.5 bg-gray-pale cursor-pointer">
            <div className="relative z-20 text-s mr-2 font-bold capitalize">{active.name}</div>
            <ChevronDownIcon
                className={`relative z-20 transition-transform ${isOpened ? 'transform rotate-180' : ''}`}
            />
            {isOpened && (
                <div
                    className={`z-10 absolute top-0 left-0 w-full pt-12.5 bg-white ${
                        isOpened ? 'rounded-2.5 border border-gray-pale' : ''
                    }`}>
                    {items.map((item) => (
                        <div
                            key={item.value}
                            onClick={() => {
                                onClick(item)
                            }}
                            className={itemClasses(item.value)}>
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

Dropdown.defaultProps = {}
Dropdown.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ),
    active: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func,
}

export default memo(Dropdown)
