import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Modal from 'components/Modal'
import UnsubscribeModal from '../../../modals/user/Unsubscribe'

const UnsubscribeBtn = () => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current !== null && modalRef.current.close()

    return (
        <div className="w-full h-10">
            <Button isFull type="secondary" text={`${t('cancelSubscribtion')}`} onClick={openModal} />

            <Modal ref={modalRef}>
                <UnsubscribeModal onClose={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(UnsubscribeBtn)
