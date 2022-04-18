import React, { memo } from 'react';
import PropTypes from 'prop-types';

function Heading({ title }) {
    return (
        <div className='text-ml font-bold text-black-theme'>{title}</div>
    );
}

Heading.propTypes = {
    title: PropTypes.string.isRequired
};

export default memo(Heading);