import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import ImgObject from 'components/ImgObject'
import { routes } from 'routes'
import TransactionTemplate from 'containers/Transaction/TransactionTemplate'
import TransactionIcon from 'containers/Transaction/TransactionIcon'
import DescriptionLink from 'containers/DescriptionLink'
import { cropImage } from '../../../utils/cropImage'

const StreamTicket = ({ transaction }) => {
    const { t } = useTranslation()
    const { stream, amount, isIncome, type, status } = transaction
    const isRefund = type.toLowerCase().includes('refund')
    const linkToStream = stream ? routes.stream.path.replace(':id', stream._id) : undefined

    return (
        <TransactionTemplate
            Avatar={
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <ImgObject
                        id={stream?._id}
                        link={linkToStream}
                        url={cropImage(stream?.thumbnailOrCoverUrl || stream?.cover?.url, 40)}
                    />
                </div>
            }
            Title={
                <div className="justify-self-start grid grid-flow-col gap-2">
                    <TransactionIcon isRefund={isRefund} status={status} />
                    <div className="text-s font-bold">{t(`transactionType.${type}`)}</div>
                </div>
            }
            Description={<DescriptionLink link={linkToStream} text={stream?.name} />}
            amount={amount.value}
            isIncome={isIncome}
        />
    )
}

export default memo(StreamTicket)
