import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'

import StatusContainer from './StatusContainer'
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg'
import { isExpired, lessThan1HourFromNow, lessThan24HoursFromNow } from 'utils/dateUtils'
import Timer from '../Timer'
import { dayTimeFormat } from 'common/formats'

function AnnouncementStatus({ startDate }) {
    const { i18n } = useTranslation()
    const [expired, setExpired] = useState(isExpired(startDate))

    const handleTimerTick = () => {
        setExpired(isExpired(startDate))
    }

    const display = (date) => {
        if (lessThan1HourFromNow(date)) {
            return (
                <>
                    <ClockIcon className={`mr-1.5 w-3.5 h-3.5 ${expired ? 'text-pink-dark' : 'text-black-theme'}`} />
                    <Timer onTick={handleTimerTick} date={startDate} format="mm:ss" />
                </>
            )
        } else if (lessThan24HoursFromNow(date)) {
            return (
                <>
                    <ClockIcon className={`mr-1.5 w-3.5 h-3.5 ${expired ? 'text-pink-dark' : 'text-black-theme'}`} />
                    <Timer onTick={handleTimerTick} date={startDate} format="hh:mm:ss" />
                </>
            )
        } else {
            return (
                <div className="text-xs uppercase">
                    {format(startDate, dayTimeFormat, i18n.language.slice(0, 2) === 'ru' ? { locale: ru } : undefined)}
                </div>
            )
        }
    }

    return <StatusContainer>{display(startDate)}</StatusContainer>
}

AnnouncementStatus.propTypes = {
    startDate: PropTypes.instanceOf(Date).isRequired,
}

export default memo(AnnouncementStatus)
