import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Button from 'components/Button'
import Modal from 'components/Modal'
import StreamSettings from 'pages/Streams/Content/modals/user/StreamSettings'

const PauseStreamBtn = () => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()
    return (
        <div className="w-full h-10">
            <Button isFull text={t('streamSettings')} type="secondary" onClick={openModal} />
            <Modal ref={modalRef}>
                <StreamSettings closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(PauseStreamBtn)
