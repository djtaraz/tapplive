import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { formatCost } from 'utils/numberUtils'
import { priceProp } from 'common/propTypes'
import cn from 'classnames'

function CardPrice({ price, type }) {
    const classes = cn('ml-auto rounded-1.5 text-s text-white font-bold py-2.5 px-3.5', {
        'bg-violet-saturated': type === 'stream',
        'bg-black-theme': type === 'streamOrder',
    })
    return <div className={classes}>${formatCost(price.value)}</div>
}

CardPrice.propTypes = {
    price: priceProp.isRequired,
    type: PropTypes.oneOf(['stream', 'streamOrder']),
}

export default memo(CardPrice)
