import React, { memo, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import Button from 'components/Button'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from 'pages/Streams/StreamContext'
import { formatCost } from 'utils/numberUtils'
import QuestionFace from 'assets/svg/illustrations/question.svg'
import Loader from 'components/Loader'
import { useIntersect } from 'hooks/useIntersect'
import { useStep } from 'hooks/useStep'
import { streamDetailsFields } from 'requests/fields/stream-fields'
import { getStreamTransactions } from 'requests/transaction-requests'
import Transaction from '../../components/Transaction'
import { toHHMMSS } from 'utils/numberUtils'
import { dateFromString } from 'utils/dateUtils'
import { setStream } from '../../../streamStorage'
import { getStreamDetails } from '../../../../../requests/stream-requests'
import { useDispatch } from 'react-redux'
import { setError } from '../../../../../slices/rootSlice'

const limit = 20
const FinishStreamModal = ({ onClose, initialStep = 1 }) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { state, streamDispatch, serverSettings } = useStream()
    const { stream } = state
    const { step, nextStep } = useStep(initialStep)
    const [streamData, setStreamData] = useState(stream)

    const handleFinish = () => {
        postAuth(`/streams/${stream._id}/close?_fields=${streamDetailsFields}`).then(({ data }) => {
            streamDispatch(setStream(data.result))
            nextStep()
        })
    }

    useEffect(() => {
        getStreamDetails({ streamId: stream._id, fields: 'totalEarned,subscriberCount,endDate,startDate' })
            .then((stream) => {
                setStreamData(stream)
            })
            .catch((error) => {
                dispatch(setError({ error }))
            })
    }, [stream._id, dispatch])

    const { data, fetchNextPage, isLoading, hasNextPage, refetch } = useInfiniteQuery(
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
            retry: false,
            cacheTime: 0,
            enabled: false,
        },
    )
    useEffect(() => {
        if (step === 3) {
            refetch()
        }
    }, [step, refetch])

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
        <div className="w-full pb-12">
            {step === 1 && (
                <div className="h-full flex flex-col items-center px-14.5">
                    <img alt="" src={QuestionFace} />
                    <h1 className="text-xl text-center font-semibold mt-5 mb-3">{t('endStream')}?</h1>
                    <p className="text-s text-center">{t('streamDetails.allMoneyWillBeCredited')}</p>
                    <div className="mt-auto w-full flex items-center justify-center">
                        <div className="mr-4">
                            <Button onClick={onClose} text={t('back')} fontWeight="bold" />
                        </div>
                        <Button onClick={handleFinish} text={t('finishStream')} type="secondary" fontWeight="bold" />
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col h-full px-14.5">
                    <h1 className="text-xl text-center font-semibold mb-3">{t('closedStream')}</h1>
                    <div className="rounded-2.5 mt-8 mb-5 h-40 border border-gray-light w-full py-6 px-7.5 flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">{t('earned')}</span>
                            <span className="text-lg font-bold">${formatCost(streamData.totalEarned)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">{t('streamSubscribers')}</span>
                            <span className="text-lg font-bold">{streamData.subscriberCount ?? 0} </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">{t('duration')}</span>
                            <span className="text-lg font-bold">
                                {toHHMMSS(
                                    (dateFromString(streamData.endDate || stream.endDate).getTime() -
                                        dateFromString(streamData.startDate).getTime()) /
                                        1000,
                                    true,
                                )}
                            </span>
                        </div>
                    </div>
                    <p className="leading-5 text-xs text-gray-medium text-center mb-5">
                        <Trans i18nKey="streamDetails.endStreamMsg" count={serverSettings.archiveTimeout / 60} />
                    </p>
                    <div className="mt-auto w-full flex items-center justify-center gap-4">
                        <Button onClick={nextStep} isFull text={t('checkStreamEarnings')} fontWeight="bold" />
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="flex flex-col w-full h-full">
                    <h1 className="text-xl text-center font-semibold">{t('streamEarnings')}</h1>
                    <div className="flex-1 overflow-hidden mt-8">
                        <div className="h-full overflow-y-auto customScrollBar px-13.5">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center">
                                    <Loader theme="violet" />
                                </div>
                            ) : transactions.length > 0 ? (
                                <div className="pb-5">
                                    {transactions.map((t) => (
                                        <div className="mt-6 first:mt-0">
                                            <Transaction transaction={t} />
                                        </div>
                                    ))}
                                    {LoadDetector}
                                </div>
                            ) : (
                                <div className="flex items-center text-center h-full text-s tracking-0.01">
                                    {t('noEarnings')}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 w-full px-14.5">
                        <Button onClick={onClose} isFull text={t('ready')} fontWeight="bold" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(FinishStreamModal)
