import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import { LeaveFeedback } from '../../../modals/user'
import Modal from 'components/Modal'

const LeaveFeedbackBtn = () => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    return (
        <div className="w-full h-10">
            <Button isFull type="secondary" onClick={openModal} text={t('giveFeedback')} />

            <Modal ref={modalRef}>
                <LeaveFeedback onClose={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(LeaveFeedbackBtn)
