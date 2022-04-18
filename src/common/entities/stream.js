export const streamStatus = {
    announcement: 'announcement',
    live: 'live',
    suspended: 'suspended',
    closed: 'closed',
    archived: 'archived',
    pending: 'pending',
}

export const goalStatus = {
    pending: 'pending',
    accepted: 'accepted',
    rejected: 'rejected',
    inProgress: 'inProgress',
    completed: 'completed',
}

export const statusWithControls = [streamStatus.live, streamStatus.closed]
export const statusWithThumbnail = [streamStatus.suspended, streamStatus.announcement]
export const activeStream = [streamStatus.announcement, streamStatus.live, streamStatus.suspended]
export const statusWithReview = [streamStatus.live, streamStatus.closed, streamStatus.suspended, streamStatus.archived]
export const statusWithBalance = [
    streamStatus.announcement,
    streamStatus.pending,
    streamStatus.live,
    streamStatus.suspended,
]
