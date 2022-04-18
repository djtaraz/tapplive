import React, { memo, useMemo } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query'
import { Trans, useTranslation } from 'react-i18next'

import { useIntersect } from 'hooks/useIntersect'
import Loader from 'components/Loader'
import { useStream } from '../../../StreamContext'
import { formatCost } from 'utils/numberUtils'
import { getStreamTransactions } from 'requests/transaction-requests'
import Transaction from '../../../Content/components/Transaction'
import { getAuth } from 'requests/axiosConfig'

const limit = 20
const BalanceModal = () => {
    const { state, serverSettings } = useStream()
    const { stream } = state
    const { t } = useTranslation()
    const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery(
        ['stream-transactions', stream._id],
        ({ queryKey, pageParam }) => {
            const [, streamId] = queryKey
            return getStreamTransactions({ streamId, limit, skip: pageParam?.skip })
        },
        {
            getNextPageParam(fromQueryFn, pages) {
                const { totalCount } = fromQueryFn
                const currentCount = pages.reduce((result, page) => result + page.items.length, 0)
                return (
                    totalCount > currentCount && {
                        skip: pages.length * limit,
                    }
                )
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            cacheTime: 0,
        },
    )
    const { data: streamTotal, isLoading: isTotalEarnedLoading } = useQuery(
        'stream-total',
        async () => {
            const { data } = await getAuth(`/streams/${stream._id}?_fields=totalEarned`)
            return data.result
        },
        {
            cacheTime: 0,
        },
    )
    const transactions = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) || []
    }, [data?.pages])

    const { setNode } = useIntersect(fetchNextPage)

    const LoadDetector = useMemo(() => {
        if (hasNextPage && !isLoading) {
            return <div ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [hasNextPage, isLoading])

    return (
        <div className="flex flex-col w-full">
            <div className="text-center px-13.5">
                <h1 className="text-xl font-semibold">{t('balance')}</h1>
                <div className="flex justify-between items-center px-7.5 py-4.5 rounded-5 border border-gray-light mt-8">
                    <div className="font-semibold">{t('earned')}</div>
                    {!isTotalEarnedLoading ? (
                        <div className="text-lg font-bold">${formatCost(streamTotal.totalEarned)}</div>
                    ) : (
                        <div className="ml-auto">
                            <Loader theme="violet" />
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-medium mt-5 leading-5">
                    <Trans i18nKey="streamDetails.endStreamMsg" count={serverSettings.archiveTimeout / 60} />
                </p>
            </div>
            <div className="flex-1 overflow-hidden mt-8">
                <div className="h-full overflow-y-auto customScrollBar px-13.5">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader theme="violet" />
                        </div>
                    ) : (
                        <div className="pb-5">
                            {transactions.map((t) => (
                                <div key={t._id} className="mt-6 first:mt-0">
                                    <Transaction transaction={t} />
                                </div>
                            ))}
                            {LoadDetector}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(BalanceModal)
