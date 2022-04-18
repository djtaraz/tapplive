import React, { memo } from 'react'
import { useField } from 'formik'
import Checkbox from 'components/Checkbox'

const FormikCheckbox = ({ name, children }) => {
    const [field] = useField(name)

    return (
        <Checkbox name={field.name} value={field.value} onChange={field.onChange}>
            {children}
        </Checkbox>
    )
}

export default memo(FormikCheckbox)
