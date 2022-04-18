import React from 'react'
import { useTranslation } from 'react-i18next'

function ClosedStatus() {
    const { t } = useTranslation()
    return (
        <div className="relative py-2.5 px-3.5 rounded-1.5 overflow-hidden text-s font-semibold">
            <div className="absolute inset-0 bg-black-background"></div>
            <span className='relative text-white'>{t('closed')}</span>
        </div>
    )
}

export default ClosedStatus