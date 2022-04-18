import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import Avatar from 'components/Avatar'
import { routes } from 'routes'
import TransactionTemplate from 'containers/Transaction/TransactionTemplate'
import DescriptionLink from '../../../containers/DescriptionLink'

const TransferSend = ({ transaction }) => {
    const { t } = useTranslation()
    const { opponentUser, amount, isIncome, type } = transaction
    const linkToUser = routes.userDetails.path.replace(':id', opponentUser._id)
    return (
        <TransactionTemplate
            Avatar={<Avatar size="sm" crop="40x40" to={linkToUser} photoUrl={opponentUser?.photo?.url} />}
            Title={<div className="text-s font-bold">{t(`transactionType.${type}`)}</div>}
            Description={<DescriptionLink link={linkToUser} text={opponentUser.name} />}
            amount={amount.value}
            isIncome={isIncome}
        />
    )
}

export default memo(TransferSend)
