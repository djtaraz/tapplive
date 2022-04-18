import { useLocation } from 'wouter'

export default function usePageLocation(locationsArray) {
    const [location] = useLocation()

    return locationsArray.includes(location)
}
