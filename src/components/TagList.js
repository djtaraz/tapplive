import React, { useRef, useMemo, useState, memo, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Link } from 'wouter'
import HashTag from './HashTag'
import FlyoutMenu from './FlyoutMenu'
import { idProp } from '../common/propTypes'
import BarSkeleton from './Skeleton/BarSkeleton'

const getLeftMargin = (el) => Number.parseInt(window.getComputedStyle(el, null).getPropertyValue('margin-left'))

function TagList({ tags }) {
    const tagContainerRef = useRef()
    const targetRef = useRef()
    const tagRefs = useRef([])
    const tagMenuRef = useRef()
    const [visibleTags, setVisibleTags] = useState()

    const handleCardWidth = useCallback(() => {
        if (tagContainerRef.current) {
            const tagCounterWidth = 30 // hardcoded
            const { width: cardWidth } = tagContainerRef.current.getBoundingClientRect()
            let visibleTagsIds = []
            let sum = 0

            tagRefs.current.some((currentElement, i, list) => {
                const { width } = currentElement.el.getBoundingClientRect()
                const margin = getLeftMargin(currentElement.el)
                const curElTotalWidth = margin + width
                const isLast = i === list.length - 1

                if (i === 0 || cardWidth >= sum + curElTotalWidth + (isLast ? 0 : tagCounterWidth)) {
                    sum += curElTotalWidth
                    visibleTagsIds.push(currentElement.id)
                    return false
                }

                return true
            })

            setVisibleTags(tags.filter((t) => visibleTagsIds.includes(t._id)))
        }
    }, [tags, setVisibleTags])

    useLayoutEffect(() => {
        handleCardWidth()

        window.addEventListener('resize', handleCardWidth)
        return () => {
            window.removeEventListener('resize', handleCardWidth)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const hiddenTags = useMemo(() => {
        if (visibleTags) {
            return tags.filter((t) => !visibleTags.some((item) => item._id === t._id))
        } else {
            return null
        }
    }, [visibleTags, tags])

    const classes = (tag) =>
        cn(
            'ml-1 first:ml-0 truncate ',
            visibleTags?.map((t) => t._id).includes(tag._id)
                ? 'pointer-events-auto max-w-full'
                : 'absolute left-0 top-0 pointer-events-none invisible max-w-xs',
        )

    return (
        <div ref={tagContainerRef} className="flex items-center mt-1 ">
            {tags.map((tag, i) => (
                <Link to={`/tags/${tag._id}`} key={tag._id}>
                    <a
                        ref={(el) => {
                            tagRefs.current[i] = {
                                el,
                                id: tag._id,
                            }
                        }}
                        href={`/tags/${tag._id}`}
                        className={classes(tag)}>
                        <HashTag text={tag.name} />
                    </a>
                </Link>
            ))}
            {hiddenTags && hiddenTags.length > 0 && (
                <div
                    onClick={(e) => {
                        e.stopPropagation()
                        if (!tagMenuRef.current.isOpened) {
                            tagMenuRef.current.open()
                        } else {
                            tagMenuRef.current.close()
                        }
                    }}
                    ref={targetRef}
                    className="relative self-stretch ml-1 px-1 cursor-pointer pointer-events-auto">
                    <span className="h-full flex items-center text-xs">+{hiddenTags.length}</span>
                    <FlyoutMenu targetRef={targetRef} ref={tagMenuRef} elements={hiddenTags} />
                </div>
            )}
            {!visibleTags && (
                <div style={{ gridTemplateColumns: 'repeat(3, auto)' }} className="inline-grid gap-1">
                    {Array(3)
                        .fill(1)
                        .map((_, i) => (
                            <BarSkeleton key={`tag-skeleton-${i}`} width={40} height={20} />
                        ))}
                </div>
            )}
        </div>
    )
}

TagList.defaultTypes = {}
TagList.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            _id: idProp,
            name: PropTypes.string.isRequired,
        }),
    ),
}

export default memo(TagList)
