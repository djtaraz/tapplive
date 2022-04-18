import React, { memo } from 'react'
import { useMutation } from 'react-query'

import Button from 'components/Button'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../../StreamContext'

const StartStreamBtn = ({ text, isDisabled, isContinue }) => {
    const { state } = useStream()
    const { stream } = state
    const { isLoading, mutateAsync } = useMutation(
        'startStream',
        ({ streamId }) => postAuth(`/streams/${streamId}/start`),
        { enabled: false },
    )

    const startStream = async () => {
        await mutateAsync({ streamId: stream._id })
    }

    return (
        <div className="w-full h-10">
            <Button
                type={isContinue ? 'secondary' : 'primary'}
                isFull
                isDisabled={isDisabled}
                onClick={startStream}
                text={text}
                isLoading={isLoading}
            />
        </div>
    )
}

export default memo(StartStreamBtn)
