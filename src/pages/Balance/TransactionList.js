import React, { Fragment, memo } from 'react'
import { isToday, isYesterday } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { dateFromString, getFullDateFormat } from 'utils/dateUtils'
import { useDateDelimiter } from 'hooks/useDateDelimiter'
import TransferReceive from './Transactions/TransferReceive'
import StreamTicket from './Transactions/StreamTicket'
import StreamDonation from './Transactions/StreamDonation'
import TopUpTransaction from './Transactions/MyWithdrawals'
import StreamGoal from './Transactions/StreamGoal'
import TransferSend from './Transactions/TransferSend'
import { transactionType } from '../../common/entities/transaction'

const TransactionList = ({ transactions }) => {
    const { t } = useTranslation()
    const { isDelimited } = useDateDelimiter()

    const formatDate = (date) => {
        if (isToday(date)) {
            return t('today')
        } else if (isYesterday(date)) {
            return t('yesterday')
        } else {
            return getFullDateFormat(date)
        }
    }

    return transactions.map((t, i) => {
        const createDate = dateFromString(t.createDate)
        return (
            <Fragment key={t._id}>
                {isDelimited(createDate) && (
                    <div className={`text-s mb-5 ${i !== 0 ? 'mt-7' : ''}`}>{formatDate(createDate)}</div>
                )}
                <div className="mb-4 last:mb-0">
                    {[transactionType.streamTicket, transactionType.streamTicketRefund].includes(t.type) && (
                        <StreamTicket transaction={t} />
                    )}
                    {t.type === transactionType.transferReceive && <TransferReceive transaction={t} />}
                    {t.type === transactionType.transferSend && <TransferSend transaction={t} />}
                    {t.type === transactionType.streamDonation && <StreamDonation transaction={t} />}
                    {[transactionType.streamGoal, transactionType.streamGoalRefund].includes(t.type) && (
                        <StreamGoal transaction={t} />
                    )}
                    {[transactionType.topup, transactionType.withdrawal].includes(t.type) && (
                        <TopUpTransaction transaction={t} />
                    )}
                </div>
            </Fragment>
        )
    })
}

export default memo(TransactionList)
