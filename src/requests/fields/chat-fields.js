import reduceFields, { reduceList } from '../../utils/reduceFields'

export const chatFields = [
    {
        user: ['name', { photo: ['url'] }],
    },
    {
        lastMessage: [
            'chatId',
            'body',
            { sender: ['name'] },
            { files: ['type'] },
            { product: ['name', 'price', 'photos'] },
        ],
    },
    {
        settings: ['showNotifications'],
    },
    'unreadCount',
    'updateDate',
    'isBlocked',
]

export const chatListFields = reduceFields({
    items: chatFields,
})

export const singleChatFields = reduceList(chatFields)