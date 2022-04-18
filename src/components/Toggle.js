import React, { memo } from 'react'
import cn from 'classnames'

const Toggle = ({ isEnabled, onClick, label, name, isDisabled }) => {
    const containerCn = cn(
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ',
        isEnabled ? 'bg-violet-saturated' : 'bg-black-theme',
        {
            'bg-button-disabled': isDisabled,
        },
    )
    const toggleCn = cn(
        ' pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        isEnabled ? 'translate-x-5' : 'translate-x-0',
    )

    const handleClick = () => {
        onClick(!isEnabled)
    }

    return (
        <label className="inline-grid grid-flow-col gap-3 items-center align-top" htmlFor={`${name}-toggle`}>
            <button
                id={`${name}-toggle`}
                type="button"
                className={containerCn}
                aria-pressed="false"
                onClick={handleClick}
                disabled={isDisabled}>
                <span className="sr-only">Use setting</span>
                <span aria-hidden="true" className={toggleCn}></span>
            </button>
            {label && <span className={`font-semibold ${isDisabled && 'text-button-disabledFont'}`}>{label}</span>}
        </label>
    )
}

export default memo(Toggle)
