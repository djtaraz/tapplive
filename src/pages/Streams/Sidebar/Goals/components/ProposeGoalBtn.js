import React, { memo, useRef } from 'react'

import Button from 'components/Button'
import Modal from 'components/Modal'
import ProposeGoalModal from './ProposeGoalModal'
import { useTranslation } from 'react-i18next'

const ProposeGoalBtn = ({ _id }) => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    return (
        <div>
            <Button
                text={t('streamGoals.proposeGoal')}
                type='primary'
                isFull={true}
                onClick={openModal}
            />

            <Modal ref={modalRef} >
                <ProposeGoalModal _id={_id} closeModal={closeModal} />
            </Modal>
        </div>
    )
}

export default memo(ProposeGoalBtn)