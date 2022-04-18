import React from 'react'

const ProgressRing = ({ radius, stroke, progress }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress / 100 * circumference;
    const height = radius * 2
    const width = height
    const crossPoint1 = width * 1.8/5
    const crossPoint2 = width * 3.2/5
    return (
        <svg
            height={height}
            width={width}
        >
            <circle
                className='animate-spin-5 origin-center'
                stroke='white'
                fill='transparent'
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <path d={`M${crossPoint1} ${crossPoint2}L${crossPoint2} ${crossPoint1}`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d={`M${crossPoint2} ${crossPoint2}L${crossPoint1} ${crossPoint1}`} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default ProgressRing