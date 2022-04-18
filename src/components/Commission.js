import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

const Commission = ({ value }) => {
    const { t } = useTranslation()

    return (
        <div className="inline-block text-ms leading-4 align-top font-medium text-gray-medium">
            {`${t('commission')} $${value}`}
        </div>
    )
}

export default memo(Commission)
