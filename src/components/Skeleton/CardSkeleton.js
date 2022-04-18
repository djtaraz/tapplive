import React, { memo } from 'react'
import CircleSkeleton from './CircleSkeleton'
import BarSkeleton from './BarSkeleton'
import { childrenProp } from '../../common/propTypes'

function CardSkeleton() {
    return (
        <div>
            <div className="bg-gray-light col-span-full rounded-2.5 self-start">
                <div className="pb-2/3"></div>
            </div>
            <div className='flex mt-5'>
                <CircleSkeleton bg="bg-gray-pale" />
                <div className="flex-1 grid grid-cols-1 gap-y-2.5 ml-2.5">
                    <BarSkeleton bg="bg-gray-pale" width="80%" />
                    <BarSkeleton bg="bg-gray-pale" width="40%" />
                </div>
            </div>
        </div>
    )
}

CardSkeleton.propTypes = {
    children: childrenProp,
}

export default memo(CardSkeleton)
