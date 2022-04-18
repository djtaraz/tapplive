import React, { forwardRef, memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useInputStyles } from './useInputStyles'

const NumberInput = forwardRef(
    (
        {
            placeholder,
            onChange,
            onFocus,
            value,
            isLarge,
            icon: Icon,
            iconPosition,
            name,
            isDisabled,
            validationError,
            showError = true,
            pattern = /^\d{1,6}([,.]\d{0,2})?$/,
        },
        ref,
    ) => {
        const { iconCn, inputCn, errorCn } = useInputStyles({
            isLarge,
            Icon,
            iconPosition,
            disabled: isDisabled,
            validationError,
        })

        const [val, setVal] = useState(value || '')

        const handleChange = (e) => {
            if (pattern.test(e.target.value)) {
                setVal(e.target.value)
                onChange(e)
            } else {
                if (e.target.value === '') {
                    onChange(e)
                    setVal('')
                }
            }
        }

        return (
            <>
                <div className="relative">
                    {Icon && iconPosition === 'start' && <Icon className={iconCn} />}
                    <input
                        placeholder={placeholder}
                        className={inputCn}
                        value={val}
                        onChange={handleChange}
                        name={name}
                        ref={ref}
                        onFocus={onFocus}
                        autoComplete="off"
                        disabled={isDisabled}
                    />
                    {Icon && iconPosition === 'end' && <Icon className={iconCn} />}
                </div>
                {showError && validationError && <div className={errorCn}>{validationError}</div>}
            </>
        )
    },
)

NumberInput.defaultProps = {
    placeholder: '',
    isLarge: false,
    iconPosition: 'start',
}

NumberInput.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    iconPosition: PropTypes.oneOf(['start', 'end']),
    name: PropTypes.string,
    validationError: PropTypes.string,
}

export default memo(NumberInput)
