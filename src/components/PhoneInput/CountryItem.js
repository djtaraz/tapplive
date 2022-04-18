import { forwardRef } from 'react'

import cn from 'classnames'

const CountryItem = forwardRef(({ flag, countryName, countryCode, onClick, isSelected }, ref) => {
    const classes = cn(
        'font-semibold p-1.5  w-full cursor-pointer hover:bg-gray-pale px-3.5 truncate',
        isSelected && 'bg-gray-pale',
    )

    return (
        <div title={countryName} ref={ref} onClick={onClick} className={classes}>
            {flag} {countryName} {countryCode}
        </div>
    )
})

export default CountryItem
