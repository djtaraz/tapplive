import React, { memo, useCallback, useState } from 'react'

import { streamsFields } from './fields'
import { useTranslation } from 'react-i18next'
import { getSubscriptions, getStreams } from '../../requests/stream-requests'
import FeedList from './FeedList'
import Empty from './EmptyState'

function Live() {
    const { t } = useTranslation()
    const [state, setState] = useState({})
    const emptyCallback = useCallback((key, length) => {
        setState((prev) => ({
            ...prev,
            [key]: length,
        }))
    }, [])

    return (
        <div className="grid gap-y-8.5">
            <FeedList
                title={t('subscriptions')}
                fetchFn={getSubscriptions}
                extraFnProp={{ statuses: ['live'] }}
                queryKey={'feed-live-bought'}
                errorMsg="Failed to fetch"
                emptyCallback={emptyCallback}
            />
            <FeedList
                title={t('recommendations')}
                fetchFn={getStreams}
                extraFnProp={{ fields: streamsFields, statuses: ['live'] }}
                queryKey={'feed-live-recommendations'}
                errorMsg="Failed to fetch"
                emptyCallback={emptyCallback}
            />
            {Object.values(state).every((elem) => elem === 0) && <Empty text={t('thereIsNothing')} />}
        </div>
    )
}

export default memo(Live)
