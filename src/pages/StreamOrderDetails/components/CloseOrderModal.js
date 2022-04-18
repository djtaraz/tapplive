import React, { memo, useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import OkeyImg from 'assets/svg/illustrations/okey.svg'
import QuestionImg from 'assets/svg/illustrations/question.svg'
import Button from 'components/Button'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import { closeOrder, getAcceptedOrdersCount } from 'requests/streamOrder-requests'

const CloseOrderModal = ({ streamOrderId, onOrderClose, onClose }) => {
    const [step, setStep] = useState(0)
    const [acceptedOrders, setAcceptedOrders] = useState(null)
    const { t } = useTranslation()

    useEffect(() => {
        getAcceptedOrdersCount({ streamOrderId }).then((orderCount) => {
            setAcceptedOrders(orderCount)
        })
    }, [streamOrderId])

    const TextContent = useMemo(() => {
        return acceptedOrders !== null ? (
            <div className="text-s mb-12 ">
                {acceptedOrders === 0
                    ? t('streamOrderDetails.closeOrderNoAcceptedMsg')
                    : t('streamOrderDetails.closeOrderMsg')}
            </div>
        ) : (
            <div className="grid gap-1">
                <BarSkeleton width="100%" height={18} />
                <div className="w-full flex justify-center">
                    <BarSkeleton width="60%" height={18} />
                </div>
            </div>
        )
    }, [acceptedOrders, t])

    const handleCloseOrder = async () => {
        await closeOrder({ orderId: streamOrderId })
        onOrderClose()
        setStep((s) => s + 1)
    }

    return (
        <div className="px-14.5 pb-12">
            {step === 0 && (
                <div className="text-center animate-appear">
                    <div className="sq-170 mx-auto">
                        <img className="w-full h-full" src={QuestionImg} alt="" />
                    </div>
                    <div className="text-xl font-semibold tracking-tight mb-3">
                        {t('streamOrderDetails.closeOrder')}?
                    </div>
                    {TextContent}
                    <div className="mt-90p flex justify-center">
                        <Button text={t('back')} type="primary" onClick={onClose} />
                        <div className="ml-5">
                            <Button
                                text={t('streamOrderDetails.closeOrder')}
                                type="secondary"
                                onClick={handleCloseOrder}
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="text-center animate-appear">
                    <div className="sq-170 mx-auto">
                        <img className="mx-auto" src={OkeyImg} alt="" />
                    </div>
                    <div className="text-xl font-semibold tracking-tight mb-3">{t('ready')}!</div>
                    <div className="text-s mb-12 ">{t('streamOrderDetails.orderClosed')}</div>
                    <div className="mt-90p flex justify-center">
                        <Button isFull={true} text={t('finish')} type="primary" onClick={onClose} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(CloseOrderModal)
