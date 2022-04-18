import React, { memo, useCallback } from 'react'
import { Link } from 'wouter'

import Avatar from 'components/Avatar'
import ProductMessage from 'components/ProductMessage'
import ChatText from './ChatText'
import ChatDonation from './ChatDonation'

const Message = ({ msg }) => {
    const MessageContent = useCallback(() => {
        if (msg.product) {
            return (
                <div className="mt-2">
                    <ProductMessage msg={msg} labelPosition="right" />
                </div>
            )
        } else if (msg.transaction && msg.transaction.type === 'streamDonation') {
            return (
                <div className="mt-2">
                    <ChatDonation text={msg.body} amount={msg.transaction.amount.value} />
                </div>
            )
        } else {
            return <ChatText text={msg.body} />
        }
    }, [msg])

    return (
        <div className="grid grid-cols-a-1 gap-3 mt-2.5 first:mt-0">
            <Avatar size="xs" crop="40x40" photoUrl={msg?.sender?.photo?.url} to={`/user/${msg.sender._id}`} />
            <div>
                <Link to={`/user/${msg.sender._id}`}>
                    <a className="text-xs text-violet-saturated font-bold mr-2 hover:underline cursor-pointer">
                        {msg.sender.name}
                    </a>
                </Link>
                <MessageContent />
            </div>
        </div>
    )
}

export default memo(Message)
