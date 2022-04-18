import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { format } from './format'

function BarSkeleton({ width, height, bg }) {
    return (
        <div style={{ width: format(width), height: format(height)}} className={`rounded-2.5 ${bg}`}></div>
    );
}

BarSkeleton.defaultProps = {
    width: 160,
    height: 20,
    bg: 'bg-gray-light'
};
BarSkeleton.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bg: PropTypes.string
};

export default memo(BarSkeleton);