import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Modal from 'components/Modal'
import { DelayAnnounce } from '../../../modals/streamer'

const PostponeStreamBtn = ({ delayInterval, isDisabled }) => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    return (
        <div className="w-full h-10">
            <Button
                isFull
                isDisabled={isDisabled}
                text={`${t('postponeFor')} ${delayInterval} ${t('minutes').toLocaleLowerCase()}`}
                onClick={openModal}
                type="secondary"
            />

            <Modal ref={modalRef}>
                <DelayAnnounce onClose={closeModal} delayInterval={delayInterval} />
            </Modal>
        </div>
    )
}

export default memo(PostponeStreamBtn)
