import React, { memo } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'

const GoalBtn = ({ onClick, text, isActive, isDisabled, type }) => {
    const btnCn = cn(
        'w-full text-s font-bold focus:outline-none h-10',
        {
            'text-violet-saturated': type === 'primary' && !isActive && !isDisabled,
            'text-gray-standard': isDisabled
        }
    )
    return (
        <button onClick={onClick} disabled={isDisabled} className={btnCn}>{text}</button>
    )
}
GoalBtn.defaultProps = {
    type: 'primary',
    isDisabled: false,
    isActive: false
}
GoalBtn.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    isDisabled: PropTypes.bool,
    type: PropTypes.oneOf(['primary', 'secondary']),
}

export default memo(GoalBtn)