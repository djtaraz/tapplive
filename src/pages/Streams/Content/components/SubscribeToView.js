import { useTranslation } from 'react-i18next'
import { SubscribeBtn } from './StreamControls/StreamControlBtns'

const SubscribeToView = () => {
    const { t } = useTranslation()

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black-theme bg-opacity-50 z-0">
            <span className="text-white text-lg font-bold -tracking-0.01 text-center mb-6">{t('subscribeToLive')}</span>
            <div>
                <SubscribeBtn />
            </div>
        </div>
    )
}

export default SubscribeToView
