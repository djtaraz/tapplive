import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { format } from './format'

function CircleSkeleton({ radius, bg = 'bg-gray-light' }) {
    return <div style={{ width: format(radius), height: format(radius)}} className={`rounded-full ${bg}`}></div>
}

CircleSkeleton.defaultProps = {
    radius: 40,
    bg: 'bg-gray-light'
};
CircleSkeleton.propTypes = {
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bg: PropTypes.string
};

export default memo(CircleSkeleton);