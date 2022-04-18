import React, { memo } from 'react'
import {useTranslation} from "react-i18next";

import StatusContainer from "./StatusContainer";

function EndedStatus() {
    const { t } = useTranslation()
    return (
        <StatusContainer>
            <div className="text-xs uppercase">{t('ended')}</div>
        </StatusContainer>
    )
}

export default memo(EndedStatus)
