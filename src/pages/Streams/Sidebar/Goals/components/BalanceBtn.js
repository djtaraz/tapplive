import React, { memo, useRef } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import BalanceModal from './BalanceModal'
import { useTranslation } from 'react-i18next'

const BalanceBtn = () => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()

    return (
        <div>
            <Button
                text={t('balance')}
                isFull={true}
                onClick={openModal}
            />

            <Modal ref={modalRef}>
                <BalanceModal />
            </Modal>
        </div>
    )
}

export default memo(BalanceBtn)