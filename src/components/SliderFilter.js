import React, { useEffect, useState, useRef, memo, useMemo } from 'react'
import PropTypes from 'prop-types'

import cn from 'classnames'
import { array } from '../utils/arrayUtils'
import BarSkeleton from './Skeleton/BarSkeleton'
import { useTranslation } from 'react-i18next'

function SliderFilter({ active, items, onClick, showLoading }) {
    const sliderRef = useRef()
    const [activeRef, setActiveRef] = useState()
    const itemClasses = cn('cursor-pointer text-s font-bold px-5 py-2 transition z-100')
    const { ready } = useTranslation()

    useEffect(() => {
        if (activeRef) {
            setActive(activeRef)
        }
    }, [activeRef])

    const SkeletonLoading = useMemo(() =>
            array(3).map((_, i) => (
                <div className='px-5 py-2 ml-2 first:ml-0' key={`skeleton-${i}`}>
                    <BarSkeleton width={80} height={16} />
                </div>
            )),
        [],
    )

    const handleFilterClick = (activeItem) => (evt) => {
        setActive(evt.target)
        onClick(activeItem)
    }

    const setActive = (el) => {
        if (sliderRef.current && el) {
            const { height, width} = el.getBoundingClientRect()
            if (sliderRef.current) {
                const sl = sliderRef.current
                sl.style.height = `${height}px`
                sl.style.width = `${width}px`
                sl.style.left = `${el.offsetLeft}px`
            }
        }
    }

    return (
        <div className='relative inline-flex items-center'>
            {ready &&
            items.map((item) => (
                <div
                    ref={(el) => {
                        if (active === item.value) {
                            setActiveRef(el)
                        }
                    }}
                    key={item.value}planBroadcast
                    onClick={handleFilterClick(item.value)}
                    className={`${itemClasses} ${active === item.value ? 'text-white duration-150' : 'duration-75'}`}>
                    {item.name}
                </div>
            ))}
            {!ready && showLoading && SkeletonLoading}
            <div style={{ willChange: 'width, left', transition: 'left 0.15s ease-out, width 0.1s ease-in-out' }}
                 ref={sliderRef} className='absolute bg-violet-saturated rounded-7.5 z-50'></div>
            <div className='absolute inset-0 pointer-events-none border border-gray-light rounded-7.5 z-40'>
            </div>
        </div>
    )
}

SliderFilter.defaultProps = {
    showLoading: true,
}
SliderFilter.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ).isRequired,
    active: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    showLoading: PropTypes.bool,
}

export default memo(SliderFilter)
