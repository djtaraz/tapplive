import reduceFields, { reduceList } from '../../utils/reduceFields'

export const messageListFields = reduceFields({
    items: [
        'body',
        { sender: [{ photo: ['url'] }] },
        { files: ['url', 'contentType', 'type', { preview: ['url'] }] },
        { product: ['name', 'price', 'photos'] },
        'createDate',
        'chatId',
    ],
})

export const sendMsgFields = reduceList([
    'body',
    'sender',
    { files: ['url'] },
    { product: ['name', 'price', 'photos']},
    'createDate',
    'chatId']
)
