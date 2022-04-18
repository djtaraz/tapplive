import React from 'react'
import PropTypes from 'prop-types'
import CircleSkeleton from './CircleSkeleton'
import BarSkeleton from './BarSkeleton'

function MajorCardSkeleton({ wide }) {
    return (
        <div className="relative inline-block h-full w-full">
            <div
                style={{
                    gridTemplateColumns: wide ? '1fr 1fr' : '1fr',
                }}
                className="grid gap-5 bg-gray-light rounded-3">
                <div style={{ paddingBottom: '132%' }}></div>
            </div>
            <div className="absolute inset-0 flex  p-5">
                <div className="self-end">
                    <CircleSkeleton radius={40} bg="bg-gray-pale" />
                    <div className='mt-4'>
                        <BarSkeleton bg="bg-gray-pale" />
                    </div>
                    <div className='mt-1'>
                        <BarSkeleton width='50%' bg="bg-gray-pale" />
                    </div>
                    <div className='mt-1 flex'>
                        {
                            Array(4).fill(1).map((_, i) => (
                                <div key={`skeleton-${i}`} className='ml-1 first:ml-0'>
                                    <BarSkeleton width={40}  bg="bg-gray-pale" />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

MajorCardSkeleton.defaultProps = {
    wide: false,
}
MajorCardSkeleton.propTypes = {
    wide: PropTypes.bool,
}

export default MajorCardSkeleton
