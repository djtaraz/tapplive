import React, { memo } from 'react'
import { formatCost } from '../utils/numberUtils'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const AvailableAmount = ({ isAmountExceeded, balance, text }) => {
    const { t } = useTranslation()

    return (
        <div className="text-ms leading-4 align-top font-medium text-gray-medium inline-grid grid-flow-col gap-1">
            <span>{text ? text : t('available')}</span>
            <span className={isAmountExceeded ? 'text-pink-dark' : ''}>{`$${formatCost(balance)}`}</span>
        </div>
    )
}

AvailableAmount.propTypes = {
    isAmountExceeded: PropTypes.bool.isRequired,
    balance: PropTypes.number.isRequired,
    text: PropTypes.string,
}

export default memo(AvailableAmount)
