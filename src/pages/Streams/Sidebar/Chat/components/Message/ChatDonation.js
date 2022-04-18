import React, { memo } from 'react'

import { formatCost } from 'utils/numberUtils'

const ChatDonation = ({ text, amount }) => {
    return (
        <div className='inline-block rounded-b-2.5 rounded-tl-1 rounded-tr-2.5 bg-violet-saturated px-5 py-4.5 text-white'>
            <div className='text-lg font-bold'>${formatCost(amount)}</div>
            {text && <div title={text} className='text-xs leading-5 break-word'>{text}</div>}
        </div>
    )
}

export default memo(ChatDonation)