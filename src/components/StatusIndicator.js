import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const StatusIndicator = ({ color, size, isActive, placement, children }) => {
    const classes = cn(
        'pointer-events-none absolute box-content rounded-full border-2 border-white',
        placement,
        color,
        size,
    )
    return (
        <span className="relative">
            {children}
            {isActive && <div className={classes}></div>}
        </span>
    )
}
StatusIndicator.defaultProps = {
    color: 'bg-pink-dark',
    isActive: false,
    placement: 'top-1p -right-3p',
    size: 'w-1.5 h-1.5',
}
StatusIndicator.propTypes = {
    color: PropTypes.string,
    isActive: PropTypes.bool,
    placement: PropTypes.string,
    size: PropTypes.string,
}
export default memo(StatusIndicator)
