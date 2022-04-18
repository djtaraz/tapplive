import React, { memo } from 'react'

import { isGoalActive, isStreamActive } from '../../../helpers'
import GoalAction from './GoalAction'
import { useStream } from '../../../StreamContext'
import { goalStatus } from 'common/entities/stream'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatCost } from '../../../../../utils/numberUtils'

const Separator = ({ isActive }) => (
    <div className={`h-1px bg-gray-pale ${isActive ? 'opacity-20' : 'opacity-100'}`}></div>
)

const GoalCard = ({ _id, goal }) => {
    const { me } = useSelector(state => state.root)
    const { state } = useStream()
    const { stream } = state
    const isActive = goal.status === goalStatus.inProgress
    const { t } = useTranslation()

    return (
        <div className={`rounded-2.5 pt-3.5 ${isActive ? 'text-white bg-violet-saturated' : 'bg-white'}`}>
            <div className='flex items-center justify-between px-3.5'>
                <div className='text-lg3 font-semibold'>${formatCost(goal.currentAmount)}</div>
                <div className='text-lg3 font-semibold opacity-50'>${formatCost(goal.price.value)}</div>
            </div>
            <div className='mt-1 px-3.5 pb-5'>
                <div className='text-s font-bold'>{goal.description}</div>
                <div
                    className='mt-0.5 text-xs'>{goal.user._id === me?._id ? t('streamGoals.yourGoal') : `${t('goal')} ${goal.user.name}`} {goal.status === goalStatus.pending ? `(${t('streamGoals.goalPending')})` : ''}</div>
            </div>
            <Separator isActive={isActive} />
            {
                isStreamActive(stream.status) && isGoalActive(goal.status) && (
                    <div>
                        <GoalAction _id={goal._id} status={goal.status} isActive={isActive} />
                    </div>
                )
            }
        </div>
    )
}

export default memo(GoalCard)