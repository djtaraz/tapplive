import { useEffect, useRef, useState } from 'react'

const Cover = ({ isPlaying, cover, needPlaceholder }) => {
    const ref = useRef()
    const [width, setWidth] = useState()
    useEffect(() => {
        const node = ref.current
        function onResize() {
            const width = ref.current.clientWidth
            setWidth(width)
        }
        onResize()
        const ro = new ResizeObserver(() => {
            ref.current !== null && onResize()
        })
        ro.observe(node)
        window.addEventListener('resize', onResize)
        return () => {
            ro.unobserve(node)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    // video plays on special status or not playing now
    const isCovered = !isPlaying

    const coveredBgSize = width && width > 300 ? '' : 'bg-40p'
    const bgSize = isCovered && needPlaceholder ? coveredBgSize : 'bg-contain'
    return (
        <div
            ref={ref}
            className={`absolute inset-0 h-full bg-no-repeat bg-center ${bgSize}`}
            style={isCovered ? { backgroundImage: `url("${cover}")` } : {}}
        />
    )
}

export default Cover
