import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'

const FormikTextArea = ({ name, placeholder, maxLength }) => {
    const [field] = useField(name)

    return (
        <textarea
            {...field}
            className="align-top customScrollBar h-40 w-full bg-gray-pale rounded-2.5 p-5 pl-5 font-semibold text-s transition-all focus:bg-white border border-transparent focus:border-gray-light"
            placeholder={placeholder}
            maxLength={maxLength}
        />
    )
}
FormikTextArea.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
}

export default memo(FormikTextArea)
