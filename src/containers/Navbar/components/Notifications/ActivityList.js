import React, { memo, useEffect, useRef } from 'react'
import { isToday, isYesterday } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { useDateDelimiter } from 'hooks/useDateDelimiter'
import { dateFromString, getFullDateFormat } from 'utils/dateUtils'
import { activityType } from 'common/entities/activity'
import StreamActivity from './ActivityItem/StreamActivity'
import UserActivity from './ActivityItem/UserActivity'
import StreamOrderActivity from './ActivityItem/StreamOrderActivity'
import Loader from 'components/Loader'
import { useIntersect } from 'hooks/useIntersect'
import { setActivities } from './notificationsReducer'
import { routes } from 'routes'
import { getUserActivities } from 'requests/user-requests'
import Scrollbar from '../../../../components/Scrollbar'
import WarningActivity from './ActivityItem/WarningActivity'

const limit = 20
const ActivityList = ({ activities, notificationsDispatch }) => {
    const { isDelimited } = useDateDelimiter()
    const { t } = useTranslation()
    const rootRef = useRef()

    const { hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
        'get-user-activities',
        async ({ pageParam }) => {
            const { skip } = pageParam || {}
            return await getUserActivities({ limit, skip })
        },
        {
            onSuccess({ pages }) {
                notificationsDispatch(setActivities(pages.flatMap((page) => page.items)))
            },
            getNextPageParam(_lastPage, pages) {
                const currentLength = pages.flatMap((page) => page.items).length
                const hasMore = currentLength < _lastPage.totalCount
                return (
                    hasMore && {
                        skip: currentLength,
                    }
                )
            },
            keepPreviousData: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            cacheTime: 0,
        },
    )
    const { setNode } = useIntersect(fetchNextPage, { root: rootRef.current, rootMargin: '10px' })

    useEffect(() => {
        return () => {
            notificationsDispatch(setActivities([]))
        }
    }, [notificationsDispatch])

    const formatDate = (date) => {
        if (isToday(date)) {
            return t('today')
        } else if (isYesterday(date)) {
            return t('yesterday')
        } else {
            return getFullDateFormat(date)
        }
    }
    const getUserActivityLink = (activity) => {
        if (
            [
                activityType.newAnnouncement,
                activityType.newLiveStream,
                activityType.newOrderReply,
                activityType.streamSoon,
                activityType.streamStarted,
            ].includes(activity.type)
        ) {
            return routes.stream.getLink(activity.stream._id)
        } else if ([activityType.newStreamOrder, activityType.orderReplyAccepted].includes(activity.type)) {
            return routes.streamOrderDetails.getLink(activity.streamOrder._id)
        } else if ([activityType.newSubscriber].includes(activity.type)) {
            return routes.userDetails.getLink(activity.user._id)
        } else if ([activityType.streamOrderClosed].includes(activity.type)) {
            return routes.multiscreens.path
        } else {
            throw new Error(`No link to ${activity.type}.`)
        }
    }
    const getActivity = (activity) => {
        if ([activityType.streamSoon, activityType.streamStarted].includes(activity.type)) {
            return (
                <StreamActivity
                    link={getUserActivityLink(activity)}
                    key={activity.id}
                    createDate={activity.createDate}
                    type={activity.type}
                    stream={activity.stream}
                />
            )
        }

        if (
            [
                activityType.newAnnouncement,
                activityType.newLiveStream,
                activityType.newStreamOrder,
                activityType.newOrderReply,
                activityType.newSubscriber,
            ].includes(activity.type)
        ) {
            return (
                <UserActivity
                    link={getUserActivityLink(activity)}
                    key={activity.id}
                    createDate={activity.createDate}
                    type={activity.type}
                    user={activity.user}
                />
            )
        }

        if ([activityType.orderReplyAccepted, activityType.streamOrderClosed].includes(activity.type)) {
            return (
                <StreamOrderActivity
                    link={getUserActivityLink(activity)}
                    key={activity.id}
                    createDate={activity.createDate}
                    type={activity.type}
                    streamOrder={activity.streamOrder}
                />
            )
        }
        if ([activityType.newWarning].includes(activity.type)) {
            return (
                <WarningActivity
                    notificationsDispatch={notificationsDispatch}
                    createDate={activity.createDate}
                    body={activity.warning.text}
                    type={activity.type}
                />
            )
        }
    }

    return (
        <div style={{ width: '445px', maxHeight: '367px' }} className="flex flex-col bg-white overflow-hidden">
            <div className="px-5 py-3">
                <span className="font-bold">{t('activity')}</span>
            </div>
            <Scrollbar autoHeight style={{ marginBottom: '-1px' }}>
                <div ref={rootRef}>
                    {activities.map((activity) => {
                        const createDate = dateFromString(activity.createDate)
                        return (
                            <>
                                {isDelimited(createDate) && (
                                    <div className="mb-5 mt-5 first:mt-0 text-s px-5">{formatDate(createDate)}</div>
                                )}
                                <div className="mt-2 first:mt-0">{getActivity(activity)}</div>
                            </>
                        )
                    })}
                    {isLoading && (
                        <div className="flex items-center justify-center h-full py-5">
                            <Loader theme="violet" />
                        </div>
                    )}
                    {hasNextPage && <div ref={setNode}></div>}
                </div>
            </Scrollbar>
        </div>
    )
}

export default memo(ActivityList)
