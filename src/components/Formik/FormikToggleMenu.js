import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import SliderFilter from '../SliderFilter'

const FormikToggleMenu = ({ name, items, showLoading }) => {
    const [field, , helpers] = useField(name)

    useEffect(() => {
        if (!field.value) {
            helpers.setValue(items[0].value)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value, items])

    const handleClick = (value) => {
        helpers.setValue(value)
    }

    return (
        <SliderFilter
            items={items}
            onClick={handleClick}
            active={field.value}
            showLoading={showLoading}
        />
    )
}
FormikToggleMenu.propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.exact({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }),
    active: PropTypes.string,
}

export default memo(FormikToggleMenu)