import React, { forwardRef, memo } from 'react'
import PropTypes from 'prop-types'
import { useInputStyles } from './useInputStyles'

const Input = forwardRef(({ isLarge, icon: Icon, iconPosition, iconClick, disabled, ...props }, ref) => {
    const { iconCn, inputCn } = useInputStyles({ isLarge, Icon, iconPosition, iconClick, disabled })

    return (
        <div className="relative">
            {Icon && iconPosition === 'start' && <Icon className={iconCn} onClick={iconClick} />}
            <input {...props} disabled={disabled} className={inputCn} ref={ref} autoComplete="off" />
            {Icon && iconPosition === 'end' && <Icon className={iconCn} onClick={iconClick} />}
        </div>
    )
})

Input.defaultProps = {
    placeholder: '',
    isLarge: false,
    iconPosition: 'start',
}

Input.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    iconPosition: PropTypes.oneOf(['start', 'end']),
    name: PropTypes.string,
    disabled: PropTypes.bool,
}

export default memo(Input)
