import React, { forwardRef, memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { ReactComponent as CheckIcon } from 'assets/svg/form-check.svg'

const Input = forwardRef(({ value, onChange, name, children, onClick, className }, ref) => {
    const classes = cn(
        `relative border rounded-1 rounded w-5 h-5 flex flex-shrink-0 justify-center items-center transition-opacity`,
        value ? `bg-violet-saturated border-violet-saturated` : 'bg-white border-gray-light',
        { 'mr-3': children },
    )

    const wrapperClasses = cn('cursor-pointer flex items-center', className)
    return (
        <label className={wrapperClasses} onClick={onClick}>
            <div className={classes}>
                <input
                    ref={ref}
                    type="checkbox"
                    className="appearance-none absolute cursor-pointer w-full"
                    value={value}
                    onChange={onChange}
                    name={name}
                />
                <CheckIcon className={`pointer-events-none ${value ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            {children}
        </label>
    )
})

Input.propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    name: PropTypes.string,
    className: PropTypes.string,
}

export default memo(Input)
