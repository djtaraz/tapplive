import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as UserIcon } from 'assets/svg/user2.svg'

function SubscribersLabel({ subscriberCount }) {
    return (
        <div className="relative flex items-center rounded-1.5 overflow-hidden px-2 py-1.5 text-white">
            <div className="absolute inset-0 bg-black-background opacity-50"></div>
            <UserIcon className="w-2.5 h-3 relative stroke-current" />
            <span className="relative ml-1 text-xs">{subscriberCount ?? 0}</span>
        </div>
    )
}

SubscribersLabel.propTypes = {
    subscriberCount: PropTypes.number.isRequired,
}

export default memo(SubscribersLabel)
