import React from 'react';
import PropTypes from 'prop-types';
import {childrenProp} from "../../common/propTypes";

function SkeletonWrapper({ bg, children }) {
    return (
        <div className={`rounded-2.5 px-8 py-6 ${bg}`}>
            {children}
        </div>
    );
}

SkeletonWrapper.defaultProps = {
    bg: 'bg-gray-light'
};
SkeletonWrapper.propTypes = {
    bg: PropTypes.string,
    children: childrenProp
};

export default SkeletonWrapper;