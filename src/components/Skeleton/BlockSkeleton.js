import React, { memo } from 'react'
import SkeletonWrapper from './SkeletonWrapper'
import BarSkeleton from './BarSkeleton'

function BlockSkeleton() {
    return (
        <div style={{maxWidth: '260px'}}>
            <SkeletonWrapper bg='bg-gray-pale'>
                <div className='grid grid-cols-1 gap-y-2.5'>
                    <BarSkeleton width="40%" />
                    <BarSkeleton width="80%" />
                </div>
            </SkeletonWrapper>
        </div>
    )
}

export default memo(BlockSkeleton)