import React from 'react'
import PropTypes from 'prop-types'

const Radio = ({ label, name, onClick }) => {

    return (
        <label onClick={onClick} className='radio grid grid-cols-a-1 gap-3 grid-flow-col items-center'>
            <span className='flex items-center text-violet-saturated'>
                <input className='w-0 h-0 opacity-0' type="radio" name={name} />
                <div className="radio__control relative w-5 h-5 rounded-full border-2 border-gray-light"></div>
            </span>
            <span className='leading-4'>{label}</span>
        </label>
    )
}

Radio.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}

export default Radio