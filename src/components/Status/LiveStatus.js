import React, { memo } from 'react'
import PropTypes from 'prop-types'
import {useTranslation} from "react-i18next";

import StatusContainer from "./StatusContainer";
import Timer from "../Timer";

function LiveStatus({ startDate, extended }) {
    const { t } = useTranslation()
    return (
        <StatusContainer radius="lg">
            <div className="w-1.5 h-1.5 bg-pink-dark rounded-full"></div>
            <div className="text-xs uppercase ml-1 mr-1">{t('live')}</div>
            {
                extended && <Timer date={startDate} />
            }
        </StatusContainer>
    )
}

LiveStatus.defaultProps = {
    extended: false
}
LiveStatus.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
    extended: PropTypes.bool.isRequired
}

export default memo(LiveStatus)