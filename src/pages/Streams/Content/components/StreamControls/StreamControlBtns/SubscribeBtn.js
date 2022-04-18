import React, { memo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useStream } from '../../../../StreamContext'
import Button from 'components/Button'
import { formatCost } from 'utils/numberUtils'
import Modal from 'components/Modal'
import { NotEnoughMoney, Subscribe } from '../../../modals/user'
import { updateStream } from '../../../../streamStorage'
import { useQueryClient } from 'react-query'
import { statusWithControls } from 'common/entities/stream'

const SubscribeBtn = () => {
    const { me } = useSelector((state) => state.root)
    const { state, streamDispatch } = useStream()
    const { stream } = state
    const modalRef = useRef()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const [isPaid, setIsPaid] = useState(false)

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    const handleModalCloseCb = () => {
        if (isPaid) {
            streamDispatch(updateStream({ haveTicket: true }))
            queryClient.refetchQueries(['stream', stream._id], { active: true })
        }
    }
    const btnText = statusWithControls.includes(stream.status) ? t('watch') : t('subscribe')
    return (
        <div className="w-full h-10">
            <Button isFull text={`${btnText} $${formatCost(stream.price.value)}`} onClick={openModal} />

            <Modal onClose={handleModalCloseCb} ref={modalRef}>
                {!isPaid && me?.balances.usd < stream.price.value ? (
                    <NotEnoughMoney onClose={closeModal} />
                ) : (
                    <Subscribe setIsPaid={setIsPaid} onClose={closeModal} />
                )}
            </Modal>
        </div>
    )
}

export default memo(SubscribeBtn)
