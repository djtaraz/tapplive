import React from 'react';
import PropTypes from 'prop-types';
import cn from "classnames";

function StatusContainer({ radius, children }) {
    const classes = cn('flex items-center py-2 px-3 bg-white opacity-75 rounded-1.5', {
        'rounded-4': radius === 'lg',
        'rounded-1.5': radius === 'sm',
    })
    return <div className={classes}>{children}</div>
}

StatusContainer.defaultProps = {
    radius: 'sm',
}
StatusContainer.propTypes = {
    radius: PropTypes.oneOf(['sm', 'lg']),
}

export default StatusContainer