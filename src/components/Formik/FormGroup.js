import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { childrenProp } from '../../common/propTypes'

const FormGroup = ({ title, gap = 12, children }) => {

    const formGroupCn = `mb-${gap} last:mb-0`
    const titleCn = 'mb-5 text-lg font-bold'
    return (
        <div className={formGroupCn}>
            {title && <div className={titleCn}>{title}</div>}
            {children}
        </div>
    )
}
FormGroup.defaultProps = {
    gap: 12
}
FormGroup.propTypes = {
    title: PropTypes.string,
    gap: PropTypes.number,
    children: childrenProp.isRequired,
}

export default memo(FormGroup)