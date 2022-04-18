import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as ExclamationIcon } from 'assets/svg/exclamation-outlined-2.svg'
import { ReactComponent as ClockIcon } from 'assets/svg/clock.svg'
import { ReactComponent as RefundIcon } from 'assets/svg/refund.svg'

const TransactionIcon = ({ status, isRefund, noPending }) => {
    const Icon = useMemo(() => {
            if (status === 'failed') {
                return <ExclamationIcon className='text-pink-dark w-2.5 h-2.5 ' />
            } else if (status === 'pending' && !noPending) {
                return <ClockIcon className='w-2.5 h-2.5 ' />
            } else if (isRefund) {
                return <RefundIcon className='w-2.5 h-2.5' />
            } else {
                return null
            }
        }
        , [status, isRefund, noPending])

    return Icon ? (
        <div className='flex items-center justify-center w-5 h-5 rounded-full bg-gray-pale'>
            {Icon}
        </div>
    ) : null
}
TransactionIcon.defaultProps = {
    noPending: false
}
TransactionIcon.propTypes = {
    status: PropTypes.oneOf(['completed', 'failed', 'pending']),
    isRefund: PropTypes.bool,
    noPending: PropTypes.bool,
}

export default memo(TransactionIcon)