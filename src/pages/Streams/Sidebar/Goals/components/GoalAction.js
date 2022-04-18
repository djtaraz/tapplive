import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useStream } from '../../../StreamContext'
import { goalStatus, streamStatus } from 'common/entities/stream'
import { postAuth } from 'requests/axiosConfig'
import JoinGoalBtn from './JoinGoalBtn'
import GoalBtn from './GoalBtn'
import { acceptGoal, removeGoal } from '../../../streamStorage'

const GoalAction = ({ _id, status, isActive }) => {
    const { streamDispatch, state, isMe } = useStream()
    const { stream, currentGoal } = state
    const { t } = useTranslation()

    const handleAcceptGoal = async () => {
        await postAuth(`/streams/${stream._id}/goals/${_id}/accept`)
        streamDispatch(acceptGoal(_id))
    }
    const handleRejectGoal = async () => {
        await postAuth(`/streams/${stream._id}/goals/${_id}/reject`)
        streamDispatch(removeGoal(_id))
    }
    const handleStartGoal = async () => {
        await postAuth(`/streams/${stream._id}/goals/${_id}/start`)
        // streamDispatch(removeGoal(_id))
    }
    const handleCompleteGoal = async () => {
        await postAuth(`/streams/${stream._id}/goals/${_id}/complete`)
        streamDispatch(removeGoal(_id))
    }

    return (
        <>
            {isMe && [goalStatus.pending, goalStatus.accepted].includes(status) && (
                <div className="flex relative">
                    {status === goalStatus.pending && <GoalBtn text={t('confirm')} onClick={handleAcceptGoal} />}
                    {status === goalStatus.accepted && (
                        <GoalBtn
                            text={t('start')}
                            onClick={handleStartGoal}
                            isDisabled={Boolean(currentGoal) || stream.status !== streamStatus.live}
                        />
                    )}
                    <div className="absolute-center h-1/2 w-1px bg-gray-pale"></div>
                    <GoalBtn text={t('reject')} type="secondary" onClick={handleRejectGoal} />
                </div>
            )}
            {isMe && status === goalStatus.inProgress && (
                <GoalBtn text={t('finish')} isActive={isActive} onClick={handleCompleteGoal} />
            )}

            {!isMe && [goalStatus.accepted, goalStatus.inProgress].includes(status) && stream.haveTicket && (
                <JoinGoalBtn _id={_id} isActive={isActive} />
            )}
        </>
    )
}

export default memo(GoalAction)
