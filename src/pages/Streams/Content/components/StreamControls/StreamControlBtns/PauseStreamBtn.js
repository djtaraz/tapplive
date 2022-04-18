import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'

import Button from 'components/Button'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../../StreamContext'

const SettingsBtn = () => {
    const { state } = useStream()
    const { stream } = state
    const { isLoading, mutateAsync } = useMutation(
        'pauseStream',
        ({ streamId }) => postAuth(`/streams/${streamId}/suspend`),
        { enabled: false },
    )
    const { t } = useTranslation()

    const pauseStream = async () => {
        await mutateAsync({ streamId: stream._id })
    }

    return (
        <div className="w-full h-10">
            <Button isFull onClick={pauseStream} text={t('setToPause')} type="secondary" isLoading={isLoading} />
        </div>
    )
}

export default memo(SettingsBtn)
