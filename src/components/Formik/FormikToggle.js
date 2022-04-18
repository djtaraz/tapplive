import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Toggle from '../Toggle'
import { useField } from 'formik'

const FormikToggle = ({ name, label, onChange, isDisabled }) => {
    const [field,, helpers] = useField(name)

    const handleClick = useCallback((isEnabled) => {
        helpers.setValue(isEnabled)
        if(onChange) {
            onChange(isEnabled)
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [name])

    return (
        <Toggle
            isEnabled={field.value}
            onClick={handleClick}
            label={label}
            name={name}
            isDisabled={isDisabled}
        />
    )
}
FormikToggle.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func
}

export default memo(FormikToggle)