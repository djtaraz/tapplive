import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
    dateFromString,
    getFormattedDuration,
    isExpired,
    lessThan1HourFromNow,
    lessThan24HoursFromNow,
} from 'utils/dateUtils'
import { dayTimeFormat } from 'common/formats'
import { streamStatus } from 'common/entities/stream'
import ru from 'date-fns/locale/ru'
import { format } from 'date-fns'

import { ReactComponent as PauseIcon } from 'assets/svg/pause-white.svg'
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg'
import Avatar from 'components/Avatar'
import Timer from 'components/Timer'
import { screens } from 'common/screenResolutions'

const DotSeparator = () => <div className="rounded-full bg-white mx-2 w-0.5 h-0.5"></div>

const StatusCard = ({ isMinified, stream, isMe }) => {
    const { i18n, t } = useTranslation()
    const { screen } = useSelector((state) => state.root)

    const [lessThan24H, setLessThan24H] = useState()
    const [lessThan1H, setLessThan1H] = useState()
    const [expired, setExpired] = useState()

    useEffect(() => {
        setLessThan24H(lessThan24HoursFromNow(dateFromString(stream.startDate)))
        setLessThan1H(lessThan1HourFromNow(dateFromString(stream.startDate)))
        setExpired(isExpired(dateFromString(stream.startDate)))

        const interval = setInterval(() => {
            setLessThan24H(lessThan24HoursFromNow(dateFromString(stream.startDate)))
            setExpired(isExpired(dateFromString(stream.startDate)))
        }, 1000)
        return () => clearInterval(interval)
    }, [stream.startDate])

    const displayTime = (date) => {
        if (lessThan1H || lessThan24H) {
            return (
                <>
                    <ClockIcon className={`mr-1.5 w-3.5 h-3.5 ${expired ? 'text-pink-dark' : 'text-white'}`} />
                    <Timer
                        format={lessThan1H ? 'mm:ss' : 'hh:mm:ss'}
                        fontSize="text-base"
                        fontWeight="semibold"
                        date={dateFromString(date)}
                    />
                </>
            )
        } else {
            return (
                <div className="text-xs font-bold uppercase">
                    {format(
                        dateFromString(date),
                        dayTimeFormat,
                        i18n.language.slice(0, 2) === 'ru' ? { locale: ru } : undefined,
                    )}
                </div>
            )
        }
    }

    return (
        <div
            className="absolute z-10 top-5 left-5 rounded-2.5 bg-overlay flex items-start px-4.5 py-3.5
            opacity-0 group-hover:opacity-100 transition-all duration-300 transform-gpu -translate-y-5 group-hover:translate-y-0 ease-in-out">
            <Avatar photoUrl={stream.streamer?.photo?.url} />
            <div className="ml-2 flex flex-col self-center">
                <span className="text-s text-white">
                    {stream.streamer?.name} {isMe && `(${t('itIsYou')})`}
                </span>
                <div
                    className={`flex  text-white ${
                        isMinified || screen < screens.md
                            ? 'flex-col items-start whitespace-nowrap flex-1	'
                            : 'items-center'
                    }`}>
                    {(stream.status === streamStatus.announcement || stream.status === streamStatus.pending) && (
                        <>{displayTime(stream.startDate)}</>
                    )}
                    {(stream.status === streamStatus.live || stream.status === streamStatus.suspended) && (
                        <span className={`text-base font-semibold flex items-center ${isMinified ? 'mb-1' : ''}`}>
                            {stream.status === streamStatus.live ? (
                                <div className="w-1.5 h-1.5 bg-pink-dark rounded-full mr-1"></div>
                            ) : (
                                <PauseIcon className="mr-2" />
                            )}
                            <span className="mr-2">
                                {stream.status === streamStatus.live
                                    ? t('live').toUpperCase()
                                    : t('suspended').toUpperCase()}
                            </span>
                            <Timer
                                fontSize="text-base"
                                fontWeight="semibold"
                                date={dateFromString(stream.startDate)}
                                format="hh:mm:ss"
                            />
                        </span>
                    )}
                    {(stream.status === streamStatus.closed || stream.status === streamStatus.archived) && (
                        <span className="font-bold">
                            {stream.status === streamStatus.closed ? t('closedStream') : t('archive')}
                            <span className="ml-2">
                                {getFormattedDuration(dateFromString(stream.startDate), dateFromString(stream.endDate))}
                            </span>
                        </span>
                    )}
                    {screen >= screens.md && !isMinified && <DotSeparator />}
                    <span className="text-xs">
                        {[
                            streamStatus.announcement,
                            streamStatus.archived,
                            streamStatus.pending,
                            streamStatus.closed,
                        ].includes(stream.status) && `${t('subscribers')} ${stream?.subscriberCount || 0}`}

                        {[streamStatus.live, streamStatus.suspended].includes(stream.status) && (
                            <>
                                {t('viewers')} {stream.viewerCount}
                                {stream.status !== streamStatus.closed && (
                                    <span className="ml-3">
                                        {t('inPeak')} {stream.peakViewerCount}
                                    </span>
                                )}
                            </>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(StatusCard)
