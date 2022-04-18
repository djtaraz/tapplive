import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames'

import {ReactComponent as SearchIcon} from "../assets/svg/search.svg";

function SearchInput({ placeholder, value, onChange }) {
    const [isFocused, setIsFocused] = useState(false)
    const inputCn = cn(
        'h-10 pl-10 pr-5 text-s rounded-2.5  w-full border border-gray-pale transition-colors',
        {
            'bg-white': isFocused,
            'bg-gray-pale': !isFocused
        }
    )

    const handleFocus = () => setIsFocused(true)

    const handleBlur = () => setIsFocused(false)

    return (
        <div className='relative w-full'>
            <SearchIcon
                className='absolute-center-y left-3.5'
            />
            <input
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={inputCn}
                type="text"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

SearchInput.defaultProps = {};
SearchInput.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default memo(SearchInput);
