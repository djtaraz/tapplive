import React from 'react';
import PropTypes from 'prop-types';

function HashTag({ text }) {
    return (
        <div className='bg-gray-pale py-1 pl-2 pr-1.5 text-xs rounded-1.5 whitespace-no-wrap truncate text-black-theme'>{text}</div>
    );
}

HashTag.propTypes = {
    text: PropTypes.string.isRequired
};

export default HashTag;