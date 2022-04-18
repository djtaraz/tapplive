import React, { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import Button from 'components/Button'
import FormGroup from 'components/Formik/FormGroup'
import { ReactComponent as CopyIcon } from 'assets/svg/copy-icon.svg'
import { useStream } from '../../../StreamContext'
import { getStreamSettings } from 'requests/stream-requests'
import Loader from 'components/Loader'
import Input from 'components/Input'
import { toast } from 'react-toastify'

const StreamSettings = ({ closeModal }) => {
    const { state } = useStream()
    const { stream } = state
    const [visible, setVisible] = useState(false)

    const { t } = useTranslation()
    const { isLoading, data } = useQuery({
        queryKey: ['stream-settings', stream._id],
        queryFn: ({ queryKey }) => {
            const [, streamId] = queryKey
            return getStreamSettings({ streamId })
        },
        refetchOnWindowFocus: false,
    })
    const toggleVisibility = () => {
        setVisible((prev) => !prev)
    }
    const subTitle = useMemo(() => {
        const text = t('copyStreamKey')
        const OBSPosition = text.indexOf('OBS')
        return [text.substr(0, OBSPosition), text.substr(OBSPosition + 3)]
    }, [t])
    const copyText = (text) => {
        toast.dark(<div className="font-bold text-s text-white tracking-0.01">{t('copied')}</div>, {
            toastId: text,
            autoClose: 2500,
        })
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="relative w-full flex flex-col px-11 pb-12">
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-white bg-opacity-50 flex items-center justify-center h-full">
                    <Loader theme="violet" />
                </div>
            )}
            <h1 className="-tracking-0.5p text-center text-xl font-semibold mb-1">{t('streamSettings')}</h1>
            <span className="tracking-0.01 text-center text-s mb-10">
                {subTitle[0]}
                <a
                    href="https://obsproject.com/"
                    rel="noreferrer"
                    target="_blank"
                    className="font-medium underline text-violet-saturated cursor-pointer">
                    OBS
                </a>
                {subTitle[1]}
            </span>
            <div className="flex-1 px-3">
                <FormGroup gap={5}>
                    <Input
                        name="rtmpUrl"
                        value={data?.rtmpUrl}
                        icon={CopyIcon}
                        iconPosition="end"
                        iconClick={() => copyText(data?.rtmpUrl)}
                    />
                </FormGroup>
                <FormGroup gap={3}>
                    <Input
                        name="rtmpKey"
                        value={data?.rtmpKey}
                        type={visible ? 'text' : 'password'}
                        icon={CopyIcon}
                        iconPosition="end"
                        iconClick={() => copyText(data?.rtmpKey)}
                    />
                </FormGroup>
                <div className="flex justify-end">
                    {visible && (
                        <span className="text-pink-dark text-ms -tracking-0.2p font-medium mr-1.5 justify-self-start">
                            {t('doNotTellAnyoneTheTranslationKey')}
                        </span>
                    )}
                    <span
                        className="text-violet-saturated font-bold text-s tracking-0.01 cursor-pointer select-none"
                        onClick={toggleVisibility}>
                        {visible ? t('hide') : t('showData')}
                    </span>
                </div>
            </div>
            <div className="px-3">
                <Button text={t('understand')} isFull isBig onClick={closeModal} />
            </div>
        </div>
    )
}

export default memo(StreamSettings)
