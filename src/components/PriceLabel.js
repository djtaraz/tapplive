import React, { memo } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { formatCost } from 'utils/numberUtils'

function PriceLabel({ price, type }) {
    const classes = cn('ml-auto rounded-1.5 text-xs text-white font-bold py-2.5 px-3.5 h-10 flex items-center', {
        'bg-violet-saturated': type === 'primary',
        'bg-black-theme': type === 'secondary',
    })
    return <div className={classes}>${formatCost(price)}</div>
}

PriceLabel.propTypes = {
    value: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['primary', 'secondary']),
}

export default memo(PriceLabel)
