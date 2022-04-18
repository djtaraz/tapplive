import React, { memo, useRef } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

import NumberInput from '../Input/NumberInput'

const FormikInput = ({ name, placeholder, icon, iconPosition, isDisabled, validationError, pattern, showError }) => {
    const [field] = useField(name)
    const inputRef = useRef()

    const handleChange = (event) => {
        field.onChange(event)
        if (inputRef.current) {
            inputRef.current.value = field.value || ''
        }
    }

    return (
        <NumberInput
            ref={inputRef}
            name={field.name}
            value={typeof field.value === 'string' ? Number(field.value.replace(',', '')) : field.value}
            onChange={handleChange}
            icon={icon}
            iconPosition={iconPosition}
            placeholder={placeholder}
            isDisabled={isDisabled}
            validationError={validationError}
            pattern={pattern}
            showError={showError}
        />
    )
}
FormikInput.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    iconPosition: PropTypes.oneOf(['start', 'end']),
}

export default memo(FormikInput)
