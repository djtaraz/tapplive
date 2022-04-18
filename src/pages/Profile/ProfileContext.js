import { createContext, useContext } from 'react'

export const ProfileContext = createContext({})
export const useProfile = () => {
    const context = useContext(ProfileContext)

    if(!context) {
        throw new Error('Component must be used inside the ProfileContext provider.')
    }

    return context
}