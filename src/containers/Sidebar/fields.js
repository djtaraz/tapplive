import reduceFields from 'utils/reduceFields'

const fields = {
    items: ['name', 'cover', 'status', 'startDate', { streamer: ['name', 'photo'] }, 'viewerCount', 'subscriberCount'],
}

export default reduceFields(fields)
