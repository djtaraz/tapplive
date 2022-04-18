import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

import Input from '../Input'

const FormikInput = ({ name, placeholder, icon, iconPosition, maxLength }) => {
    const [field] = useField(name)

    return (
        <Input
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            icon={icon}
            iconPosition={iconPosition}
            placeholder={placeholder}
            maxLength={maxLength}
        />
    )
}
FormikInput.propTypes = {
    name: PropTypes.string.isRequired,
    icon: PropTypes.func,
    placeholder: PropTypes.string,
    iconPosition: PropTypes.oneOf(['start', 'end']),
}

export default memo(FormikInput)