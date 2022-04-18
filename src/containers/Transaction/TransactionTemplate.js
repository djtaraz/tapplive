import React, { memo } from 'react'

import { formatCost } from 'utils/numberUtils'

const TransactionTemplate = ({
     amount,
     isIncome,
     Avatar,
     Title,
     Description,
 }) => {

    return (
        <div className='flex items-center'>
            <div className='flex mr-3.5'>
                {Avatar}
            </div>
            <div className='flex-1 grid gap-1 truncate pr-5'>
                {Title}
                {Description}
            </div>
            <div className='font-bold'>
                {isIncome ? '+' : '-'}${formatCost(amount)}
            </div>
        </div>
    )
}

export default memo(TransactionTemplate)