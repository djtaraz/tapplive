import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from '../../../StreamContext'
import DelayImg from 'assets/svg/illustrations/bag.svg'
import { updateStream } from '../../../streamStorage'

const DelayAnnounceModal = ({ onClose, delayInterval }) => {
    const { t } = useTranslation()
    const { state, streamDispatch } = useStream()
    const { stream } = state

    const handleDelay = () => {
        postAuth(`streams/${stream._id}/delay`).then(() => {
            onClose()
            streamDispatch(updateStream({ canDelay: false }))
        })
    }

    return (
        <div className="w-full h-full flex items-center flex-col pb-12 px-14.5">
            <img alt="" src={DelayImg} />
            <h1 className="text-xl font-semibold mt-5 mb-3 text-center">
                {t('postponeStreamFor').split(' ')[0]} {t('postponeStreamFor').split(' ')[1]}
                <br />
                {t('postponeStreamFor').split(' ')[2]} {delayInterval} {t('minutes').toLocaleLowerCase()}
            </h1>
            <p className="text-s text-center">{t('streamDetails.youCanPostponeStreamOnlyOnce')}</p>
            <div className="mt-auto w-full">
                <Button onClick={handleDelay} text={t('postponeStream')} isFull fontWeight="bold" />
            </div>
        </div>
    )
}

export default memo(DelayAnnounceModal)
