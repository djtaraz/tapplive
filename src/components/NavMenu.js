import React from 'react'
import PropTypes from 'prop-types'

function NavMenu({ active, items, onChange }) {

    return (
        <div className="flex items-center">
            {items.map((item) => {
                const isActive = active && active.value === item.value
                return (
                    <div
                        onClick={() => onChange(item)}
                        key={item.value}
                        className={`relative ml-9 first:ml-0 text-m font-bold cursor-pointer ${isActive ? 'text-violet-saturated' : ''}`}>
                        <div>{item.name}</div>
                        {isActive && (
                            <div className="absolute-center-x -bottom-3 w-1.5 h-1.5 bg-pink-dark rounded-full"></div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

NavMenu.defaultProps = {}
NavMenu.propTypes = {
    active: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired
}

export default NavMenu
