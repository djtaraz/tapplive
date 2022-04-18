import cn from 'classnames'

export const useInputStyles = ({ isLarge, Icon, iconPosition, iconClick, disabled, validationError }) => {
    const inputCn = cn(
        'w-full bg-gray-pale rounded-2.5 font-semibold text-s transition-all bg-gray-pale focus:bg-white border',
        validationError ? 'border-pink-dark' : 'border-transparent focus:border-gray-light',
        isLarge ? 'h-9' : 'h-12',
        {
            'px-5': !Icon,
            'pl-12.5 pr-5': Icon && iconPosition === 'start',
            'pr-12.5 pl-5': Icon && iconPosition === 'end',
        },

        {
            'text-button-disabledFont': disabled,
            'text-pink-dark': validationError,
        },
    )
    const iconCn = cn(
        'absolute-center-y w-5 h-5',
        {
            'left-5': iconPosition === 'start',
            'right-5': iconPosition === 'end',
            'cursor-pointer': iconClick,
        },
        {
            'text-button-disabledFont': disabled,
            'text-black-theme': !disabled,
            'text-pink-dark': validationError,
        },
    )

    const errorCn = cn(
        'text-xs text-pink-dark h-3 transition-all transform translate-y-3',
        validationError ? 'opacity-100' : 'opacity-0',
    )

    return {
        inputCn,
        iconCn,
        errorCn,
    }
}
