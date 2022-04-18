import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Avatar from 'components/Avatar'
import TransactionTemplate from 'containers/Transaction/TransactionTemplate'
import TransactionIcon from 'containers/Transaction/TransactionIcon'
import DescriptionLink from '../../../../containers/DescriptionLink'

const Transaction = ({ transaction }) => {
    const { t } = useTranslation()
    const { opponentUser, isIncome, amount, type, status } = transaction
    const isRefund = type.toLowerCase().includes('refund')

    return (
        <TransactionTemplate
            Avatar={
                <Avatar
                    size="sm"
                    to={opponentUser?._id ? `/user/${opponentUser?._id}` : ''}
                    photoUrl={opponentUser?.photo?.url}
                    crop="40x40"
                />
            }
            Title={
                <div className="justify-self-start grid items-center grid-flow-col gap-2">
                    <TransactionIcon status={status} isRefund={isRefund} noPending={true} />
                    <div className="text-s font-bold truncate">{t(`transactionType.${type}`)}</div>
                </div>
            }
            Description={
                <DescriptionLink
                    link={opponentUser ? `/user/${opponentUser._id}` : undefined}
                    text={opponentUser?.name}
                />
            }
            isIncome={isIncome}
            amount={amount.value}
        />
    )
}

export default memo(Transaction)
