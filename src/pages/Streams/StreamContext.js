import { createContext, useContext } from 'react'
export const StreamContext = createContext({})

export const useStream = () => {
    const context = useContext(StreamContext)
    if (!context) {
        throw new Error('Component must be used inside the StreamContext provider.')
    }
    return context
}
