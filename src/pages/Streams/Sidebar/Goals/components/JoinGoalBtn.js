import React, { memo, useRef } from 'react'
import Modal from 'components/Modal'
import JoinGoalModal from './JoinGoalModal'
import { useTranslation } from 'react-i18next'
import GoalBtn from './GoalBtn'

const JoinGoalBtn = ({ _id, isActive }) => {
    const modalRef = useRef()
    const { t } = useTranslation()

    const openModal = () => modalRef.current.open()
    const closeModal = () => modalRef.current.close()

    return (
        <div>
            <GoalBtn isActive={isActive} onClick={openModal} text={t('streamGoals.joinGoal')} />

            <Modal ref={modalRef}>
                <JoinGoalModal closeModal={closeModal} _id={_id} />
            </Modal>
        </div>
    )
}

export default memo(JoinGoalBtn)