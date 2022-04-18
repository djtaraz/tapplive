import {
    Balance,
    ChatList,
    EditProfile,
    FavoriteTagItems,
    Feed,
    FollowedChannels,
    Leaders,
    PopularUsers,
    RecentStreams,
    Recommendations,
    Subscriptions,
    TagDetails,
    PlaceDetails,
    TopOrders,
    TopStreams,
    UpcomingStreams,
    Search,
    StreamOrderEdit,
    StreamOrderCreate,
    CreateStream,
    Streams,
    MultiScreenView,
    Profile,
} from 'pages'
import StreamOrderDetails from './pages/StreamOrderDetails'

import ViewProduct from './pages/Product/ProductView'
import ProductActions from './pages/Product/ProductActions'
import UpdateStream from './pages/StreamForm/UpdateStream'

export const routes = {
    feed: {
        path: '/feed',
        component: Feed,
        isPrivate: true,
    },
    recommendations: {
        path: '/recommendations',
        component: Recommendations,
        isPrivate: false,
    },
    topStreams: {
        path: '/top-streams',
        component: TopStreams,
    },
    topOrders: {
        path: '/top-orders',
        component: TopOrders,
    },
    upcomingStreams: {
        path: '/upcoming-streams',
        component: UpcomingStreams,
    },
    leaders: {
        path: '/leaders',
        component: Leaders,
    },
    popularUsers: {
        path: '/popular-users',
        component: PopularUsers,
    },
    recentStreams: {
        path: '/recent-streams',
        component: RecentStreams,
        isPrivate: true,
    },
    followedTags: {
        path: '/followed-tags',
        component: FavoriteTagItems,
        isPrivate: true,
    },
    followedChannels: {
        path: '/followed-channels',
        component: FollowedChannels,
        isPrivate: true,
    },
    userDetails: {
        path: '/user/:id',
        component: Profile,
        isPrivate: true,
        getLink(userId) {
            return this.path.replace(':id', userId)
        },
    },
    search: {
        path: '/search',
        component: Search,
    },
    tagDetails: {
        path: '/tags/:id',
        component: TagDetails,
    },
    placeDetails: {
        path: '/places/:id',
        component: PlaceDetails,
    },
    subscriptions: {
        path: '/subscriptions',
        component: Subscriptions,
        isPrivate: true,
    },
    myProfile: {
        path: '/me/edit',
        component: EditProfile,
        isPrivate: true,
    },
    myBalance: {
        path: '/me/balance',
        component: Balance,
        isPrivate: true,
    },
    chats: {
        path: '/chats',
        component: ChatList,
        isPrivate: true,
    },
    createStreamOrder: {
        path: '/stream-orders/create',
        component: StreamOrderCreate,
        isPrivate: true,
    },
    streamOrderDetails: {
        path: '/stream-orders/:id',
        regex: /stream-orders\/\w+/,
        component: StreamOrderDetails,
        isPrivate: true,
        getLink(streamOrderId) {
            return this.path.replace(':id', streamOrderId)
        },
    },
    streamOrderEdit: {
        path: '/stream-orders/edit/:id',
        regex: /stream-orders\/edit\/\w+/,
        component: StreamOrderEdit,
        isPrivate: true,
    },
    createProduct: {
        path: '/me/products/create',
        component: ProductActions,
        isPrivate: true,
    },
    viewProduct: {
        path: '/product/:userId/:id',
        component: ViewProduct,
        isPrivate: true,
        regex: /product\/\w+\/\w+/,
    },
    editProduct: {
        path: '/me/products/edit/:id',
        component: ProductActions,
        isPrivate: true,
        regex: /me\/products\/edit\/\w+/,
    },
    createStream: {
        path: '/streams/create',
        component: CreateStream,
        isPrivate: true,
    },
    updateStream: {
        path: '/streams/update/:id',
        component: UpdateStream,
        isPrivate: true,
    },
    stream: {
        path: '/streams/:id',
        component: Streams,
        isPrivate: true,
        regex: /streams\/\w+/,
        getLink(streamId) {
            return this.path.replace(':id', streamId)
        },
    },
    multiscreen: {
        path: '/multiscreen',
        component: MultiScreenView,
        isPrivate: true,
        regex: /multiscreen/,
    },
}
