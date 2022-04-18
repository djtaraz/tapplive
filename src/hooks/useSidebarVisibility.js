import { useLocation } from 'wouter'
import { routes } from '../routes'

const blacklistedRoutes = [
    routes.chats,
    routes.myBalance,
    routes.myProfile,
    routes.streamOrderDetails,
    routes.createProduct,
    routes.viewProduct,
    routes.editProduct,
    routes.streamOrderEdit,
    routes.createStream,
    routes.stream,
    routes.multiscreen,
]
export default function useSidebarVisibility() {
    const [url] = useLocation()
    return (
        blacklistedRoutes
            .map((r) => r.regex)
            .filter((v) => v)
            .every((r) => url.match(r) === null) && !blacklistedRoutes.map((r) => r.path).includes(url)
    )
}
