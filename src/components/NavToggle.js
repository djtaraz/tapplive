import React from 'react'
import PropTypes from 'prop-types'

function NavToggle({ active, items, onChange }) {
    return (
        <div className="flex items-center">
            {items.map((item) => {
                const isActive = active && active.value === item.value
                return (
                    <div
                        onClick={() => onChange(item)}
                        key={item.value}
                        className={`ml-2 transition-all first:ml-0 px-3 cursor-pointer py-1 text-s rounded-full ${
                            isActive ? 'bg-black-theme text-white' : 'text-black'
                        }`}>
                        <div>{item.name}</div>
                    </div>
                )
            })}
        </div>
    )
}

NavToggle.defaultProps = {}
NavToggle.propTypes = {
    active: PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
}

export default NavToggle
