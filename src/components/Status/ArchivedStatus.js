import React, { memo } from 'react'
import {useTranslation} from "react-i18next";

import StatusContainer from "./StatusContainer";

function ArchivedStatus() {
    const { t } = useTranslation()
    return (
        <StatusContainer>
            <div className="text-xs uppercase ml-1">{t('archived')}</div>
        </StatusContainer>
    )
}

export default memo(ArchivedStatus)