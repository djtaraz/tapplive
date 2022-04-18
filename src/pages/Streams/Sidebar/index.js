import { memo, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import NavMenu from 'components/NavMenu'

import Chat from './Chat'
import Products from './Products'
import Goals from './Goals'
import { isStreamActive } from '../helpers'
import { useStream } from '../StreamContext'
import { setGoals } from '../streamStorage'
import { getStreamerGoals, getStreamViewerGoals } from 'requests/stream-requests'

const Sidebar = () => {
    const { state, isMe, streamDispatch } = useStream()
    const { stream } = state
    const { t } = useTranslation()

    const filters = useMemo(
        () => [
            { name: t('chat'), value: 'chat', onActiveStream: false },
            { name: t('goals'), value: 'goals', onActiveStream: true },
            { name: t('products'), value: 'products', productId: null, onActiveStream: false },
        ],
        [t],
    )
    const [filter, setFilter] = useState(filters[0])

    useEffect(() => {
        // reset on stream change
        if (stream._id) {
            setFilter(filters[0])
        }
    }, [filters, stream._id])

    const handleFilterChange = (newFilter) => setFilter(newFilter)
    useQuery(
        ['streamGoals', isMe, stream._id],
        async ({ queryKey }) => {
            const [, isMe, streamId] = queryKey

            return isMe ? await getStreamerGoals({ streamId }) : await getStreamViewerGoals({ streamId })
        },
        {
            onSuccess(data) {
                streamDispatch(setGoals(data))
            },
            cacheTime: 0,
            refetchOnWindowFocus: false,
            enabled: !state.isGoalsEnough,
        },
    )
    return (
        <div className="h-full flex flex-col overflow-hidden bg-gray-pale transition-all rounded-2.5">
            <div className="px-5 sticky top-0 left-0 z-10 w-full py-7.5 flex justify-between items-center">
                <NavMenu
                    onChange={(newFilter) => setFilter(newFilter)}
                    active={filter}
                    items={filters.filter((item) => (item.onActiveStream ? isStreamActive(stream.status) : true))}
                />
            </div>

            <div className="flex flex-grow overflow-hidden pb-5">
                {filter.value === 'chat' && <Chat />}
                {isStreamActive(stream.status) && filter.value === 'goals' && <Goals />}
                {filter.value === 'products' && (
                    <Products changeFilter={handleFilterChange} productId={filter.productId} />
                )}
            </div>
        </div>
    )
}

export default memo(Sidebar)
