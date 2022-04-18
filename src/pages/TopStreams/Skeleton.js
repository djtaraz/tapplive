import React, { memo } from 'react'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import CardSkeleton from 'components/Skeleton/CardSkeleton'

function Skeleton() {
    return (
        <CardSkeleton>
            <div style={{ paddingBottom: '65%' }}>
                <BarSkeleton height="100%" />
            </div>
        </CardSkeleton>
    )
}

export default memo(Skeleton)