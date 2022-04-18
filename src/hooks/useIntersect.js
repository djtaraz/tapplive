import { useState, useEffect, useMemo } from 'react'

const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: '1.0'
}
export const useIntersect = (callback, options = {}) => {
    const [node, setNode] = useState()
    const currentObserver = useMemo(() => new IntersectionObserver(
        (entries) => {
            const [target] = entries
            if (target.isIntersecting) {
                callback(entries)
            }
        },
        {
            ...defaultOptions,
            ...options
        },
    ), [callback, options])

    useEffect(() => {
        currentObserver.disconnect()

        if (node) {
            currentObserver.observe(node)
        }

        return () => {
            currentObserver.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node])

    return { setNode }
}
