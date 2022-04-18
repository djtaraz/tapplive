import React, { forwardRef, memo } from 'react'

import TagsList from './TagsList'
import { useStream } from '../../StreamContext'

const StreamHeading = forwardRef((_, ref) => {
    const { state } = useStream()
    const { stream } = state
    return (
        <div>
            <h1 ref={ref} className="text-lg font-bold truncate">
                {stream.name}
            </h1>

            {stream?.tags?.length > 0 && (
                <div className="flex flex-wrap mt-1 pr-5">
                    <TagsList tags={stream?.tags} />
                </div>
            )}
        </div>
    )
})

export default memo(StreamHeading)
