import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Modal from 'components/Modal'

import { DeleteStream } from '../../../modals/streamer'
import { streamStatus } from 'common/entities/stream'

const DeleteAnnounceBtn = () => {
    const { t } = useTranslation()
    const modalRef = useRef()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    return (
        <div className="w-full h-10">
            <Button isFull onClick={openModal} text={t('deleteAnnounce')} type="secondary" />
            <Modal ref={modalRef}>
                <DeleteStream type={streamStatus.announcement} onClose={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(DeleteAnnounceBtn)
