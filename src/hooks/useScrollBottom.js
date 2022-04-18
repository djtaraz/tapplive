import { useLayoutEffect, useCallback } from 'react'


export const useScrollBottom = (el) => {
    const scrollToBottom = useCallback(() => {
        if (el.current) {
            const scrollHeight = el.current.scrollHeight
            el.current.scrollTop = scrollHeight
        }
    }, [el])

    useLayoutEffect(() => {
        scrollToBottom()
    }, [scrollToBottom])

    return scrollToBottom
}