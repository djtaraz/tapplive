import Button from './Button'
import { ReactComponent as Illustration } from 'assets/svg/illustrations/user-with-mobile.svg'
import { ReactComponent as GPlayIcon } from 'assets/svg/gplay-icon.svg'
import { ReactComponent as AppleStoreIcon } from 'assets/svg/apple-icon.svg'
import { useTranslation } from 'react-i18next'

const MobileScreen = () => {
    const onClick = (url) => {
        window.location.replace(url)
    }
    const { t } = useTranslation()
    const GPLAY_LINK = process.env.REACT_APP_GPLAY_STORE
    const APPLE_APPSTORE = process.env.REACT_APP_APPLE_STORE

    return (
        <div className="flex flex-col max-w-96 w-full px-5 py-7.5 h-full mx-auto sm:hidden">
            <div className="flex flex-1 flex-col justify-center items-center">
                <Illustration />
                <h1 className="mt-9.5 -tracking-0.01 text-lg text-center font-bold">{t('downloadApp')}</h1>
            </div>
            <div className="w-full mt-auto grid grid-flow-row gap-5">
                {GPLAY_LINK && (
                    <Button type="primary" onClick={() => onClick(GPLAY_LINK)}>
                        <div className="flex justify-center text-white text-left py-2">
                            <GPlayIcon />
                            <div className="ml-3">
                                <div className="text-xs font-normal">{t('downloadIn')}</div>
                                <div className="text-base font-bold -tracking-0.2p">{t('gPlay')}</div>
                            </div>
                        </div>
                    </Button>
                )}
                {APPLE_APPSTORE && (
                    <Button type="primary" onClick={() => onClick(APPLE_APPSTORE)}>
                        <div className="flex justify-center text-white text-left py-2">
                            <AppleStoreIcon />
                            <div className="ml-3">
                                <div className="text-xs font-normal">{t('availableIn')}</div>
                                <div className="text-base font-bold -tracking-0.2p">{t('appStore')}</div>
                            </div>
                        </div>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default MobileScreen
