import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as EyeIcon } from 'assets/svg/eye.svg'

function ViewsLabel({ viewsCount }) {
    return (
        <div className="relative flex items-center rounded-1.5 overflow-hidden px-2 py-1.5 text-white">
            <div className="absolute inset-0 bg-black-background opacity-50"></div>
            <EyeIcon className="relative stroke-current" />
            <span className="relative ml-1 text-xs">{viewsCount}</span>
        </div>
    )
}

ViewsLabel.defaultProps = {
    viewsCount: 0
}
ViewsLabel.propTypes = {
    viewsCount: PropTypes.number.isRequired
}

export default memo(ViewsLabel)
