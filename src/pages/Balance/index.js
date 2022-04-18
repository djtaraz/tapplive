import React, { useRef, useState, useMemo, useEffect } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useInfiniteQuery } from 'react-query'
import { toast } from 'react-toastify'
import { nanoid } from 'nanoid'

import { useIntersect } from 'hooks/useIntersect'
import { array } from 'utils/arrayUtils'
import TransactionSceleton from 'components/Skeleton/TransactionSceleton'
import Modal from 'components/Modal'

import { formatCost } from 'utils/numberUtils'
import { getUserTransactions } from 'requests/transaction-requests'
import TransactionList from './TransactionList'

import Topup from 'modals/Topup'
import Withdraw from './modals/Withdraw/Withdraw'
import { deleteLocationParam, getLocationParam } from '../../utils/browserUtils'

const itemsLimit = 20

function Balance() {
    const { t } = useTranslation()
    const topupPaymentResult = getLocationParam('topupPaymentResult')

    const { data, hasNextPage, fetchNextPage, isLoading, isFetching, refetch } = useInfiniteQuery(
        'get_user_transactions',
        async ({ pageParam } = {}) => {
            return await getUserTransactions({ skip: pageParam?.skip, limit: itemsLimit })
        },
        {
            getNextPageParam(fromQueryFn, pages) {
                const { totalCount } = fromQueryFn
                const currentCount = pages.reduce((result, page) => result + page.items.length, 0)
                return (
                    totalCount > currentCount && {
                        skip: pages.length * itemsLimit,
                    }
                )
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            cacheTime: 0,
        },
    )

    useEffect(() => {
        if (topupPaymentResult === 'true') {
            toast.dark(<div className="font-bold text-s text-white tracking-0.01">{t('balanceTopupOk')}</div>, {
                toastId: nanoid(),
                onClose: () => deleteLocationParam('topupPaymentResult'),
                autoClose: 2500,
            })
        } else if (topupPaymentResult === 'false') {
            toast.error(<div className="font-bold text-s text-white tracking-0.01">{t('balanceTopupFail')}</div>, {
                toastId: nanoid(),
                onClose: () => deleteLocationParam('topupPaymentResult'),
                autoClose: 2500,
            })
        }
    }, [topupPaymentResult, t])

    const transactions = useMemo(() => {
        return (data?.pages || []).flatMap((page) => page.items)
    }, [data?.pages])

    const modalRef = useRef(null)
    const [modalState, setModalState] = useState('')
    const { setNode } = useIntersect(fetchNextPage)
    const { me } = useSelector((state) => state.root)

    const LoadDetector = useMemo(() => {
        if (hasNextPage) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [hasNextPage])

    const handleModalOpen = (type) => {
        setModalState(type)
        modalRef.current.open()
    }

    const handleModalClose = () => {
        modalRef.current.close()
        refetch()
    }

    return (
        <div className="flex w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            <div className={cn('flex w-full flex-col')}>
                <h1 className="text-xl font-bold mb-10">{t('bill')}</h1>

                <div className="bg-violet-saturated p-10 flex rounded-2.5">
                    <div className="flex-1">
                        <div>
                            <div className="text-s text-white">{t('balance')}</div>
                            <div
                                title={`$${formatCost(me?.balances?.usd) || 0}`}
                                className="text-xl font-semibold mt-2 text-white truncate pr-2">
                                ${formatCost(me?.balances?.usd || 0)}
                            </div>
                        </div>
                        <div className="mt-5">
                            <div className="text-s text-white">{t('balanceHold')}</div>
                            <div
                                title={`+ $${formatCost(me?.balances?.usdHold) || 0}`}
                                className="text-xl font-semibold mt-2 text-violet-pale w-full truncate text-gray-standard pr-2">
                                + ${formatCost(me?.balances?.usdHold || 0)}
                            </div>
                        </div>
                    </div>
                    <div className="grid self-end gap-5 items-end">
                        <button
                            onClick={() => handleModalOpen('withdraw')}
                            className="bg-white outline-none focus:outline-none text-violet-saturated text-s font-bold w-28 py-2.5 rounded-2.5">
                            {t('withdraw')}
                        </button>
                        <button
                            onClick={() => handleModalOpen('topup')}
                            className="bg-white outline-none focus:outline-none text-violet-saturated text-s font-bold w-28 py-2.5 rounded-2.5">
                            {t('topup')}
                        </button>
                    </div>
                </div>

                <div className="mt-10">
                    {!isLoading && <TransactionList transactions={transactions} />}
                    {isFetching && array(10).map((_, i) => <TransactionSceleton key={`more-skeleton-${i}`} />)}
                    {isLoading && array(20).map((_, i) => <TransactionSceleton key={`loading-skeleton-${i}`} />)}
                    {LoadDetector}
                </div>
            </div>

            <Modal size="unset" ref={modalRef}>
                {modalState === 'topup' && <Topup onClose={handleModalClose} />}
                {modalState === 'withdraw' && <Withdraw onClose={handleModalClose} />}
            </Modal>
        </div>
    )
}

export default Balance
