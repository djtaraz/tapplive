import React, { createContext, memo, useMemo, useState, useContext, useCallback, useEffect } from 'react'

const ScrollContext = createContext({ socket: null })
const ScrollProvider = ({ children }) => {
    const [scrollMemory, updateScrollMemory] = useState({})

    const resetScroll = useCallback(
        (id) => {
            const scroll = scrollMemory[id]
            !scroll && window.scrollTo(0, 0)
            return scroll
        },
        [scrollMemory],
    )
    const setScroll = useCallback(
        (id) => updateScrollMemory((prev) => ({ ...prev, [id]: [window.scrollX, window.scrollY] })),
        [],
    )

    return <ScrollContext.Provider value={{ setScroll, resetScroll }}>{children}</ScrollContext.Provider>
}

export const useScroll = (componentId) => {
    const id = useMemo(() => componentId, [componentId])
    const { setScroll, resetScroll } = useContext(ScrollContext)

    useEffect(() => {
        resetScroll && resetScroll(id)
    }, [resetScroll, id])

    useEffect(() => {
        return () => {
            setScroll && setScroll(id)
        }
    }, [setScroll, id])

    return null
}

export default memo(ScrollProvider)
