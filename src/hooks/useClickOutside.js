import React from 'react'

export const useClickOutside = (ref, callback, event = 'click') => {
    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            callback()
        }
    }
    React.useEffect(() => {
        document.addEventListener(event, handleClick)
        return () => {
            document.removeEventListener(event, handleClick)
        }
    })
}
