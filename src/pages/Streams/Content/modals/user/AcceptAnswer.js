import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { postAuth } from 'requests/axiosConfig'
import Button from 'components/Button'
import { useStream } from '../../../StreamContext'
import BellImg from 'assets/svg/illustrations/bell.svg'
import SubscribedImg from 'assets/svg/illustrations/okey.svg'
import { formatCost } from 'utils/numberUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setMe } from 'slices/rootSlice'
import { useStep } from 'hooks/useStep'

const AcceptAnswer = ({ onClose, setIsApproved }) => {
    const { state } = useStream()
    const { stream } = state

    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const { step, nextStep } = useStep()

    const handleSubscribe = () => {
        postAuth(`/streams/${stream?._id}/approve`).then(() => {
            setIsApproved(true)
            dispatch(
                setMe({
                    ...me,
                    balances: {
                        ...me.balances,
                        usd: me.balances.usd - stream.price.value,
                    },
                }),
            )

            nextStep()
        })
    }

    return (
        <div className="w-full h-full pb-12 px-14.5">
            {step === 1 && (
                <div className="h-full flex flex-col items-center">
                    <img alt="" src={BellImg} />
                    <h1 className="text-xl text-center font-semibold mt-5 mb-3">
                        {t('acceptAnswerFor')} ${formatCost(stream.price.value)}
                    </h1>
                    <p className="text-s">{t('cashWillBeDeducted')}</p>
                    <div className="mt-auto w-full">
                        <Button onClick={handleSubscribe} text={t('acceptAnswer')} fontWeight="bold" isFull />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="h-full flex flex-col items-center">
                    <img alt="" src={SubscribedImg} />
                    <h1 className="text-xl font-semibold mt-5 mb-3">{t('youAcceptedAnswer')} !</h1>
                    <div className="mt-auto w-full">
                        <Button onClick={onClose} text={t('backToOrder')} fontWeight="bold" isFull />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(AcceptAnswer)
