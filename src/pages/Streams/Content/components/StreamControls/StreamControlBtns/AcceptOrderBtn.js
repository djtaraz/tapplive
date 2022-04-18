import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { formatCost } from 'utils/numberUtils'
import { useStream } from '../../../../StreamContext'
import Modal from 'components/Modal'
import { AcceptAnswer, NotEnoughMoney } from 'pages/Streams/Content/modals/user'
import { updateStream } from '../../../../streamStorage'
import { streamStatus } from 'common/entities/stream'
import { useSelector } from 'react-redux'

const AcceptOrderBtn = () => {
    const { t } = useTranslation()
    const { state, streamDispatch } = useStream()
    const { me } = useSelector((state) => state.root)
    const { stream } = state
    const modalRef = useRef()

    const handleModalOpen = () => modalRef.current.open()
    const handleModalClose = () => modalRef.current.close()

    const [isApproved, setIsApproved] = useState(false)

    const handleModalCloseCb = () => {
        if (isApproved) {
            streamDispatch(updateStream({ status: streamStatus.announcement }))
        }
    }

    return (
        <div className="w-full h-10">
            <Button
                isFull
                onClick={handleModalOpen}
                text={`${t('acceptAnswer')}  $${formatCost(stream?.price?.value)}`}
            />
            <Modal onClose={handleModalCloseCb} ref={modalRef}>
                {me?.balances.usd < stream.price.value ? (
                    <NotEnoughMoney onClose={handleModalClose} />
                ) : (
                    <AcceptAnswer setIsApproved={setIsApproved} onClose={handleModalClose} />
                )}
            </Modal>
        </div>
    )
}

export default memo(AcceptOrderBtn)
