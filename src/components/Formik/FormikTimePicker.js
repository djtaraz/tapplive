import React, { memo, useCallback } from 'react'
import TimePicker from '../DatePicker/TimePicker'
import { useField } from 'formik'

const FormikTimePicker = ({ name, isDisabled, excludePastTime }) => {
    const [field, , helpers] = useField(name)

    const handleChange = useCallback(
        (time) => {
            helpers.setValue(time)
        },
        [helpers],
    )

    return (
        <TimePicker
            time={field.value || null}
            onChange={handleChange}
            isDisabled={isDisabled}
            excludePastTime={excludePastTime}
        />
    )
}

export default memo(FormikTimePicker)
