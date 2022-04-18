import React, { memo } from 'react'
import { ReactComponent as LockIcon } from 'assets/svg/lock.svg'

function PrivateLabel() {
    return (
        <div className="inline-block relative rounded-1.5 overflow-hidden p-2">
            <div className="absolute inset-0 bg-white opacity-75"></div>
            <LockIcon className="relative" />
        </div>
    )
}

export default memo(PrivateLabel)
