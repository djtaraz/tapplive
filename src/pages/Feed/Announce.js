import React, { memo, useCallback, useState } from 'react'

import { streamsFields } from './fields'
import { useTranslation } from 'react-i18next'
import { getSubscriptions, getStreams } from '../../requests/stream-requests'
import Empty from './EmptyState'

import FeedList from './FeedList'

function Announce() {
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
                extraFnProp={{ statuses: ['announcement'] }}
                queryKey={'feed-announce-bought'}
                errorMsg="Failed to fetch"
                emptyCallback={emptyCallback}
            />
            <FeedList
                title={t('recommendations')}
                fetchFn={getStreams}
                extraFnProp={{ fields: streamsFields, statuses: ['announcement'] }}
                queryKey={'feed-announce-recommendations'}
                errorMsg="Failed to fetch"
                emptyCallback={emptyCallback}
            />
            {Object.values(state).every((elem) => elem === 0) && <Empty text={t('thereIsNothing')} />}
        </div>
    )
}

export default memo(Announce)
