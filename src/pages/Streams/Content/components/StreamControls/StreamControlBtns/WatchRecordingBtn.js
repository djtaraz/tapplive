import React, { memo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Button from 'components/Button'
import { useStream } from '../../../../StreamContext'
import Modal from 'components/Modal'
import { NotEnoughMoney, Subscribe } from '../../../modals/user'
import { formatCost } from 'utils/numberUtils'
import { updateStream } from '../../../../streamStorage'

const WatchRecordingBtn = () => {
    const { me } = useSelector((state) => state.root)
    const { state, streamDispatch } = useStream()
    const { stream } = state
    const modalRef = useRef()
    const { t } = useTranslation()

    const [isPaid, setIsPaid] = useState(false)

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    const handleModalCloseCb = () => {
        if (isPaid) {
            streamDispatch(updateStream({ haveTicket: true }))
        }
    }

    return (
        <div className="w-full h-10">
            <Button
                isDisabled={!stream.videoUrl}
                isFull
                text={`${t('watchRecording')} $${formatCost(stream.price.value)}`}
                onClick={openModal}
            />

            <Modal onClose={handleModalCloseCb} ref={modalRef}>
                {me?.balances.usd < stream.price.value ? (
                    <NotEnoughMoney />
                ) : (
                    <Subscribe setIsPaid={setIsPaid} onClose={closeModal} />
                )}
            </Modal>
        </div>
    )
}

export default memo(WatchRecordingBtn)
