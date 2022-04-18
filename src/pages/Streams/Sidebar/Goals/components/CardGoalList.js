import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import EmptyImg from 'assets/svg/empty/1.svg'
import { useStream } from '../../../StreamContext'
import GoalCard from './GoalCard'

const CardGoalList = () => {
    const { isMe, state } = useStream()
    const { goals, currentGoal } = state
    const { t } = useTranslation()

    const EmptyState = useMemo(
        () => (
            <div className="h-full flex flex-col items-center justify-center">
                <img src={EmptyImg} alt="Goals empty" />
                <div className="break-word text-s text-center mt-5">
                    {isMe ? t('streamGoals.streamerEmptyGoals') : t('streamGoals.userEmptyGoals')}
                </div>
            </div>
        ),
        [isMe, t],
    )

    return (
        <div className="h-full px-5">
            {goals.length > 0 || currentGoal ? (
                <>
                    {currentGoal && <GoalCard key={currentGoal._id} goal={currentGoal} />}
                    {goals
                        .filter((goal) => goal._id !== currentGoal?._id)
                        .map((goal) => (
                            <div key={goal._id} className="mt-3 first:mt-0">
                                <GoalCard goal={goal} />
                            </div>
                        ))}
                </>
            ) : (
                EmptyState
            )}
        </div>
    )
}

export default memo(CardGoalList)
