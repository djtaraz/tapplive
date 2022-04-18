import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { postAuth } from 'requests/axiosConfig'
import Button from 'components/Button'
import { useStream } from '../../../StreamContext'
import BellImg from 'assets/svg/illustrations/bell.svg'
import SubscribedImg from 'assets/svg/illustrations/okey.svg'
import { formatCost } from 'utils/numberUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setMe } from 'slices/rootSlice'
import { statusWithControls } from 'common/entities/stream'

const SubscribeModal = ({ onClose, withStep = true, setIsPaid }) => {
    const { state } = useStream()
    const { stream } = state

    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const [step, setStep] = useState('initial')

    const handleSubscribe = () => {
        postAuth(`/streams/${stream._id}/tickets`)
            .then(() => {
                setIsPaid(true)
                dispatch(
                    setMe({
                        ...me,
                        balances: {
                            ...me.balances,
                            usd: me.balances.usd - stream.price.value,
                        },
                    }),
                )
                withStep ? setStep('subscribed') : onClose()
            })
            .catch(() => {
                onClose()
            })
    }
    const titleText = statusWithControls.includes(stream.status) ? t('watchFor') : t('subscribeFor')
    const btnText = statusWithControls.includes(stream.status) ? t('watch') : t('subscribe')
    return (
        <div className="w-full h-full pb-12 px-14.5">
            {step === 'initial' && (
                <div className="h-full flex flex-col items-center">
                    <img alt="" src={BellImg} />
                    <h1 className="text-xl text-center font-semibold mt-5 mb-3">
                        {titleText} ${formatCost(stream.price.value)}
                    </h1>
                    <p className="text-s">{t('cashWillBeDeducted')}</p>
                    <div className="mt-auto w-full">
                        <Button onClick={handleSubscribe} text={btnText} fontWeight="bold" isFull />
                    </div>
                </div>
            )}

            {step === 'subscribed' && (
                <div className="h-full flex flex-col items-center">
                    <img alt="" src={SubscribedImg} />
                    <h1 className="text-xl font-semibold mt-5 mb-3">{t('ready')} !</h1>
                    <p className="text-s">{t('streamAddedToSubscribtions')}</p>
                    <div className="mt-auto w-full">
                        <Button onClick={onClose} text={t('backToStream')} fontWeight="bold" isFull />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(SubscribeModal)
