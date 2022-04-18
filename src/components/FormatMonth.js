import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const FormatMonth = ({ month }) => {
    const { t } = useTranslation()

    const format = (month) => {
        switch (month) {
            case 0:
                return t('months.jan')
            case 1:
                return t('months.feb')
            case 2:
                return t('months.mar')
            case 3:
                return t('months.apr')
            case 4:
                return t('months.may')
            case 5:
                return t('months.jun')
            case 6:
                return t('months.jul')
            case 7:
                return t('months.aug')
            case 8:
                return t('months.sep')
            case 9:
                return t('months.oct')
            case 10:
                return t('months.nov')
            case 11:
                return t('months.dec')

            default:
                return false
        }
    }

    return <span>{format(parseInt(month))}</span>
}

FormatMonth.propTypes = {
    month: PropTypes.number.isRequired,
}

export default memo(FormatMonth)
