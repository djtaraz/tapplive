import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import Button from '../components/Button'
import Product, { ProductSkeleton } from '../components/Product'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { getProducts } from '../requests/product-requests'

const MyProductsModal = ({ onSubmit, closeModal }) => {
    const { me } = useSelector(state => state.root)
    const [choosenProduct, setChoosenProduct] = useState()
    const { data, isLoading } = useQuery(
        ['myProducts', me?._id],
        async ({ queryKey }) => {
            const [, userId] = queryKey
            return getProducts({ userId })
        },
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { t } = useTranslation()

    const handleChooseProduct = async () => {
        setIsSubmitting(true)
        await onSubmit(choosenProduct._id)
        setIsSubmitting(false)
        closeModal()
    }

    return (
        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-col flex-1 overflow-hidden'>
                <div
                    className='text-xl font-medium tracking-tighter text-center mb-3'>{t('product.attachProduct')}</div>
                <div className='text-s text-center mb-5'>{t('product.chooseAnyProduct')}</div>
                <div className='flex-1 overflow-auto px-13.5 py-2.5 customScrollBar'>
                    <div className='grid grid-cols-4 gap-x-3 gap-y-5'>
                        {
                            !isLoading ? data.items?.map((product) => (
                                <Product key={product._id}
                                         onClick={() => setChoosenProduct(product)}
                                         product={product}
                                         isSelected={choosenProduct?._id === product._id}
                                />
                            )) : (
                                Array(4).fill(1).map((_, i) => <ProductSkeleton key={`product=skeleton=${i}`} />)
                            )
                        }
                    </div>
                </div>
            </div>
            <div className='flex border-t border-gray-light pt-6 pb-7.5 px-13.5'>
                <div className='ml-auto'>
                    <Button
                        isDisabled={!choosenProduct}
                        onClick={handleChooseProduct}
                        text={t('send')}
                        type='primary'
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyProductsModal