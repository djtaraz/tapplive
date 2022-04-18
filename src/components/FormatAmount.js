import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const FormatAmount = ({ amount }) => {
    const { t } = useTranslation()

    const format = (amount) => {
        let si = [
            { value: 1, symbol: '' },
            { value: 1e3, symbol: t('formatAmount.k') },
            { value: 1e6, symbol: t('formatAmount.M') },
            // { value: 1e9, symbol: 'G' },
            // { value: 1e12, symbol: 'T' },
            // { value: 1e15, symbol: 'P' },
            // { value: 1e18, symbol: 'E' },
        ]
        let rx = /\.0+$|(\.[0-9]*[1-9])0+$/
        let i
        for (i = si.length - 1; i > 0; i--) {
            if (Math.floor(amount) >= si[i].value) {
                break
            }
        }
        return (Math.floor((amount / si[i].value) * 10) / 10).toFixed(1).replace(rx, '$1') + ' ' + si[i].symbol
    }

    return <span className='whitespace-nowrap'>{format(amount)}</span>
}

FormatAmount.propTypes = {
    amount: PropTypes.number.isRequired,
}

export default memo(FormatAmount)
