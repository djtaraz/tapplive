import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'

const FinishStreamBtn = ({ openFinishModal }) => {
    const { t } = useTranslation()

    return (
        <div className="w-full h-10">
            <Button isFull onClick={openFinishModal} text={t('finishStream')} />
        </div>
    )
}

export default memo(FinishStreamBtn)
