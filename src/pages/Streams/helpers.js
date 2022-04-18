import { streamStatus, goalStatus } from 'common/entities/stream'

export const isStreamActive = (status) => [streamStatus.announcement, streamStatus.live, streamStatus.suspended].includes(status)
export const isGoalActive = status => [goalStatus.pending, goalStatus.accepted, goalStatus.inProgress].includes(status)