import React, { memo, useCallback } from 'react'
import { useField } from 'formik'
import SingleDatePicker from '../DatePicker/SingleDatePicker'

const FormikDatePicker = ({ name, isDisabled, minDate }) => {
    const [field, , helpers] = useField(name)

    const handleChange = useCallback(
        (date) => {
            helpers.setValue(date)
        },
        [helpers],
    )

    return (
        <SingleDatePicker
            minDate={minDate}
            date={field.value || null}
            onChange={handleChange}
            isDisabled={isDisabled}
        />
    )
}

export default memo(FormikDatePicker)
