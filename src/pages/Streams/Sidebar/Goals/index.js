import React, { memo } from 'react'

import CardGoalList from './components/CardGoalList'
import { useStream } from '../../StreamContext'
import Loader from 'components/Loader'
import ProposeGoalBtn from './components/ProposeGoalBtn'
import Scrollbar from '../../../../components/Scrollbar'
import BalanceBtn from './components/BalanceBtn'

const Goals = () => {
    const { state, isMe } = useStream()
    const { stream, goalsLoading } = state

    if (goalsLoading) {
        return (
            <div className="h-full w-full px-5 flex items-center justify-center">
                <Loader theme="violet" />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col">
            <div className="flex-1 flex flex-col overflow-hidden">
                <Scrollbar>
                    <CardGoalList />
                </Scrollbar>
                {isMe && (
                    <div className="px-5 mt-5">
                        <BalanceBtn />
                    </div>
                )}
            </div>
            {stream.haveTicket && !isMe && (
                <div className="px-5 mt-5">
                    <ProposeGoalBtn />
                </div>
            )}
        </div>
    )
}

export default memo(Goals)
