import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { statusProp } from 'common/propTypes'
import LiveStatus from './LiveStatus'
import ClosedStatus from './EndedStatus'
import AnnouncementStatus from './AnnouncementStatus'
import ArchivedStatus from './ArchivedStatus'
import SuspendedStatus from './SuspendedStatus'

function Status({ status, startDate, extended }) {
    const Status = useMemo(() => {
        return {
            live: <LiveStatus startDate={startDate} extended={extended} />,
            closed: <ClosedStatus />,
            announcement: <AnnouncementStatus startDate={startDate} />,
            active: <AnnouncementStatus startDate={startDate} />,
            archived: <ArchivedStatus />,
            suspended: <SuspendedStatus startDate={startDate} extended={extended} />,
        }[status]
    }, [status, startDate, extended])

    return Status || null
}

Status.defaultTypes = {
    startDate: null,
    extended: false,
}
Status.propTypes = {
    status: statusProp.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    extended: PropTypes.bool,
}

export default Status
