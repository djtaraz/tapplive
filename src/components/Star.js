import React, { memo } from 'react'
import { ReactComponent as StarLgStroked } from '../assets/svg/star-lg-stroked.svg'
import { ReactComponent as StarLgFilled } from '../assets/svg/star-lg-filled.svg'

const Star = ({ className, isFilled, onClick }) => {
    return isFilled ? (
            <StarLgFilled
                className={className}
                onClick={onClick}
            />
    ) : (
        <StarLgStroked
            className={className}
            onClick={onClick}
        />
    )
}

export default memo(Star)