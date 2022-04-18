import React, { memo } from 'react'

import MessagesList from './components/MessagesList'
import ChatControl from './components/ChatControl'
import { useStream } from '../../StreamContext'
import ProductAttachment from './components/ProductAttachment'
import { streamStatus } from 'common/entities/stream'
import CurrentGoal from '../Goals/components/CurrentGoal'
import { ReactComponent as ArrowUpIcon } from 'assets/svg/arrow-up.svg'

const Chat = () => {
    const { state, isMe } = useStream()
    const { stream, currentGoal } = state

    return (
        <div className="flex flex-col w-full">
            {currentGoal && (
                <CurrentGoal
                    currentAmount={currentGoal.currentAmount}
                    goal={currentGoal.price.value}
                    description={currentGoal.description}
                />
            )}
            <div className="flex-1 overflow-hidden">
                <MessagesList />
            </div>
            {![streamStatus.closed, streamStatus.archived].includes(stream.status) && (isMe || stream.haveTicket) && (
                <ChatControl>
                    {(text, handleSend) => {
                        if (isMe && !text) {
                            return (
                                <div className="ml-4 transform -translate-y-4 flex items-center self-end">
                                    <ProductAttachment streamId={stream?._id} />
                                </div>
                            )
                        }
                        return (
                            <div
                                onClick={handleSend}
                                className="ml-4 transform -translate-y-1 flex items-center justify-center w-9 h-9 bg-black-background hover:bg-violet-saturated transition-colors rounded-full text-white cursor-pointer">
                                <ArrowUpIcon className="w-4 h-4 stroke-current" />
                            </div>
                        )
                    }}
                </ChatControl>
            )}
        </div>
    )
}

export default memo(Chat)
