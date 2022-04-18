import React, { useEffect, useState, useMemo, memo, useCallback } from 'react'
import { getAuth, deleteAuth, postAuth } from 'requests/axiosConfig'
import fields from './fields'
import PopularUsers from 'containers/PopularUsers'
import LeadersAndTopOrders from 'containers/LeadersAndTopOrders'
import { useTranslation } from 'react-i18next'
import MajorCardStripe from 'components/Card/MajorCardStripe'
import CardStripe from 'components/Card/CardStripe'
import ScrollToTop from 'components/ScrollToTop'

const Recommendations = () => {
    const [content, setContent] = useState(null)
    const { t } = useTranslation()

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getAuth(`/content-summary?_fields=${fields}&limit=10`)
            setContent(data.result)
        }
        fetchData()
    }, [])

    const topStreamData = useMemo(
        () => (content?.topStreams ? content.topStreams.map((stream) => ({ ...stream, type: 'stream' })) : null),
        [content?.topStreams],
    )
    const upcomingData = useMemo(
        () =>
            content?.upcomingStreams ? content.upcomingStreams.map((stream) => ({ ...stream, type: 'stream' })) : null,
        [content?.upcomingStreams],
    )

    const handleToggleSubscription = useCallback(
        async (userId) => {
            const targetUser = content.popularUsers.find((u) => u._id === userId)

            if (targetUser) {
                if (targetUser.inMySubscriptions) {
                    await deleteAuth(`/users/${userId}/subscriptions`)
                } else {
                    await postAuth(`/users/${userId}/subscriptions`, null)
                }

                setContent((c) => {
                    return {
                        ...c,
                        popularUsers: c.popularUsers.map((u) =>
                            u._id === userId
                                ? {
                                      ...u,
                                      inMySubscriptions: !u.inMySubscriptions,
                                      subscriberCount: !u.inMySubscriptions
                                          ? u.subscriberCount + 1
                                          : u.subscriberCount - 1,
                                  }
                                : u,
                        ),
                    }
                })
            }
        },
        [content?.popularUsers],
    )

    return (
        <div
            style={{ gridTemplateRows: 'repeat(4, auto)' }}
            className="grid flex overflow-hidden grid-cols-1 gap-12 py-10">
            <ScrollToTop />
            <MajorCardStripe cardData={topStreamData} title={t('topStreams')} watchAll="/top-streams"></MajorCardStripe>
            <LeadersAndTopOrders topStreamOrders={content?.topStreamOrders} />
            <PopularUsers users={content?.popularUsers} onToggleSubscription={handleToggleSubscription} />
            <CardStripe title={t('upcoming')} watchAll="/upcoming-streams" cardData={upcomingData} />
        </div>
    )
}

export default memo(Recommendations)
