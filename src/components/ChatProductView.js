import React, { memo, useEffect, useState } from 'react'
import cn from 'classnames'

import PropTypes from 'prop-types'
import PriceLabel from './PriceLabel'
import BarSkeleton from './Skeleton/BarSkeleton'
import { getAuth } from 'requests/axiosConfig'
import { productFields } from 'pages/Product/fields'
import Slider from './Slider'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import Scrollbar from './Scrollbar'

const ChatProductView = ({ productId, streamerId }) => {
    const [productData, setProductData] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [buyRequest, setBuyRequest] = useState(false)
    const { t } = useTranslation()

    const resetState = () => {
        setProductData({})
        setIsLoading(true)
        setBuyRequest(false)
    }

    useEffect(() => {
        if (productId === null) {
            resetState()
            return
        }
        getAuth(`/users/${streamerId}/products/${productId}?_fields=${productFields}`).then(({ data }) => {
            setProductData(data.result)
            setIsLoading(false)
        })
    }, [productId, streamerId])

    const producyCardClasses = cn(
        'absolute inset-0 transition-transform duration-300 z-110 bg-gray-pale rounded-b-2.5 transform ',
        {
            'translate-x-0': productId,
            'translate-x-96': !productId,
        },
    )
    const handleBuyRequest = () => setBuyRequest(!buyRequest)

    return (
        <section className={producyCardClasses}>
            {/* need to clear node before closing animation */}
            {productId !== null && (
                <Scrollbar
                    renderView={({ style, ...props }) => {
                        return <div className="px-5 pb-5 flex flex-col" style={{ ...style }} {...props} />
                    }}>
                    <>
                        <div className="mb-5">
                            {isLoading ? (
                                <BarSkeleton />
                            ) : (
                                <h1 className="text-lg -tracking-0.01 font-bold line-clamp-4">{productData.name}</h1>
                            )}
                        </div>
                        <section className="relative">
                            <Slider isLoaded={!isLoading} images={productData?.photos} height={206} />
                            {!isLoading && (
                                <div className="absolute bottom-3 mb-5.5 right-3">
                                    <PriceLabel price={productData.price?.value} type="secondary" />
                                </div>
                            )}
                        </section>
                        <section className="flex mb-8 items-center justify-center">
                            {isLoading ? (
                                <BarSkeleton width={280} height={40} />
                            ) : (
                                <Button
                                    text={buyRequest ? t('sentBuyRequestTip') : t('sendBuyRequest')}
                                    onClick={handleBuyRequest}
                                    isDisabled={buyRequest}
                                    isFull={true}
                                    useDarkDisabled={true}
                                />
                            )}
                        </section>
                        {!isLoading && productData.description && (
                            <>
                                {productData.description && (
                                    <h2 className="text-base tracking-tight font-bold mb-3">{t('description')}</h2>
                                )}

                                <p className="text-s break-all tracking-0.01">{productData.description}</p>
                            </>
                        )}
                    </>
                </Scrollbar>
            )}
        </section>
    )
}

ChatProductView.propTypes = {
    productId: PropTypes.string.isRequired,
    streamerId: PropTypes.string.isRequired,
}

export default memo(ChatProductView)
