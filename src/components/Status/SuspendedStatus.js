import React, { memo } from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from "react-i18next";

import { ReactComponent as PauseIcon } from 'assets/svg/pause.svg'
import StatusContainer from "./StatusContainer";
import Timer from "../Timer";

function SuspendedStatus({ startDate, extended }) {
    const { t } = useTranslation()
    return (
        <StatusContainer>
            <PauseIcon />
            <div className="text-xs uppercase ml-1 mr-1">{t('live')}</div>
            {
                extended && <Timer date={startDate} />
            }
        </StatusContainer>
    )
}

SuspendedStatus.defaultProps = {
    extended: false
}
SuspendedStatus.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    extended: PropTypes.bool.isRequired
}

export default memo(SuspendedStatus)