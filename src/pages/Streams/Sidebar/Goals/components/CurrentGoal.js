import React, { memo, useLayoutEffect, useState, useRef } from 'react'
import { formatCost } from 'utils/numberUtils'

const CurrentGoal = ({ currentAmount, goal, description }) => {
    const containerRef = useRef()
    const completedPercent = currentAmount * 100 / goal
    const [width, setWidth] = useState()

    useLayoutEffect(() => {
        const { width } = containerRef.current.getBoundingClientRect()
        setWidth((width * completedPercent) / 100)
    }, [completedPercent])

    return (
        <div
            ref={containerRef}
            className='relative flex items-center z-10 rounded-2.5 px-5 mx-3 py-4 bg-violet-saturated overflow-hidden'>
            <div
                style={{
                    width
                }}
                className='absolute -z-1 left-0 top-0 bottom-0 w-1/4 bg-violet-dark'>
            </div>
            <div className='mr-5 font-bold text-s text-white'>${formatCost(currentAmount)}</div>
            <div
                className='text-s font-bold text-white opacity-50 mr-4.5'>${formatCost(goal)}</div>
            <div className='w-0.5 h-3.5 bg-white rounded-0.5 opacity-50 mr-3'></div>
            <div className='text-ms text-white font-medium truncate' title={description}>{description}</div>
        </div>
    )
}

export default memo(CurrentGoal)