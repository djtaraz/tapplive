import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import Loader from '../components/Loader'

const Button = React.forwardRef(
    (
        {
            text,
            isDisabled,
            isFull,
            isBig,
            isWide,
            onClick,
            isLoading,
            fontWeight,
            type,
            textSize,
            px,
            useDarkDisabled,
            autoFocus,
            htmlType,
            children,
            className,
        },
        ref,
    ) => {
        const classes = cn(
            'grid grid-flow-col gap-3 items-center relative',
            'rounded-2.5 outline-none focus:outline-none',
            {
                'bg-violet-saturated text-white': type === 'primary' && !isDisabled,
                'bg-white text-black-theme border border-gray-light': type === 'secondary' && !isDisabled,
                'font-bold': type === 'secondary' && !fontWeight,
                'text-gray-standard border border-gray-light': isDisabled && !useDarkDisabled && type === 'secondary',
                'bg-gray-pale text-gray-standard': isDisabled && !useDarkDisabled && type === 'primary',
                'bg-gray-standard text-black-theme': isDisabled && useDarkDisabled,
                'w-full': isFull,
                'w-2/5': isWide,
                'text-opacity-0': isLoading,
            },
            textSize ? `text-${textSize}` : 'text-s',
            fontWeight && `font-${fontWeight}`,
            isBig ? 'min-h-10 px-5 py-2' : `h-8 ${px ? `px-${px}` : `px-6`}`,
            className,
        )

        return (
            <button
                type={htmlType}
                ref={ref}
                disabled={isDisabled || isLoading}
                className={classes}
                onClick={onClick}
                autoFocus={autoFocus}>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center">
                        <Loader theme={type === 'primary' ? 'white' : 'violet'} width={20} height={10} />
                    </div>
                )}
                {children || <span>{text}</span>}
            </button>
        )
    },
)
Button.defaultProps = {
    isFull: false,
    isBig: true,
    isDisabled: false,
    type: 'primary',
    textSize: 's',
    fontWeight: 'bold',
    autoFocus: false,
    htmlType: 'submit',
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    isFull: PropTypes.bool,
    isBig: PropTypes.bool,
    isWide: PropTypes.bool,
    isDisabled: PropTypes.bool,
    fontWeight: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    classNames: PropTypes.string,
    isLoading: PropTypes.bool,
    useDarkDisabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    textSize: PropTypes.string,
    type: PropTypes.oneOf(['primary', 'secondary']),
    htmlType: PropTypes.oneOf(['button', 'reset', 'submit']),
}

export default memo(Button)
