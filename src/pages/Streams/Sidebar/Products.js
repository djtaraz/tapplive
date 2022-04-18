import { useIntersect } from 'hooks/useIntersect'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProducts } from 'requests/product-requests'
import PropTypes from 'prop-types'
import { array } from 'utils/arrayUtils'
import EmptyStateImage from 'assets/svg/illustrations/bag.svg'
import Product, { ProductSkeleton } from 'components/ChatProduct'
import ChatProductView from 'components/ChatProductView'
import { useStream } from '../StreamContext'
import Scrollbar from 'components/Scrollbar'

const limit = 5

// size is for scroll preventing
const DEFAULT_SKELETON_SIZE = 3

const Products = ({ changeFilter, productId }) => {
    const { state } = useStream()
    const { stream } = state
    const [products, setProducts] = useState()
    const { t } = useTranslation()
    const [more, setMore] = useState(false)
    const { setNode } = useIntersect(() => setMore(true))
    const [itemsToSkip, setToSkip] = useState(limit)

    useEffect(() => {
        getProducts({ userId: stream.streamer._id, limit, skip: 0 }).then((result) => {
            setProducts(result)
        })
    }, [stream.streamer._id])

    useEffect(() => {
        if (more) {
            getProducts({ userId: stream.streamer._id, limit, skip: itemsToSkip }).then((result) => {
                setMore(false)
                setToSkip(itemsToSkip + limit)
                setProducts((prev) => ({
                    items: [...prev.items, ...result.items],
                    totalCount: result.totalCount,
                }))
            })
        }
    }, [more, itemsToSkip, stream.streamer._id])

    const LoadDetector = useMemo(() => {
        if (products?.items && products.items.length > 0 && products.items.length < products.totalCount) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [products])
    const EmptyState = useMemo(() => {
        return (
            <div className="text-center flex flex-col items-center h-full justify-center px-5">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div style={{ maxWidth: '516px' }} className="text-s mt-3 mx-auto">
                    {t('profilePage.productsEmptyMsg.other')}
                </div>
            </div>
        )
    }, [t])

    const handleProductClick = ({ _id }) => {
        changeFilter({ value: 'products', productId: _id })
    }
    const Skeleton = useCallback(() => {
        let renderCount = DEFAULT_SKELETON_SIZE
        if (products) {
            renderCount = products.totalCount < itemsToSkip ? 0 : products.totalCount - itemsToSkip
        }
        return array(renderCount).map((_, i) => <ProductSkeleton key={`product-skeleton-${i}`} />)
    }, [itemsToSkip, products])

    return (
        <div className="w-full relative overflow-hidden">
            <>
                {products?.items?.length > 0 ? (
                    <>
                        <Scrollbar
                            renderView={({ style, ...props }) => {
                                return (
                                    <div
                                        className={'grid auto-rows-min gap-y-3 px-5 '}
                                        style={{ ...style }}
                                        {...props}
                                    />
                                )
                            }}>
                            {products.items.map((product) => (
                                <Product
                                    onClick={() => handleProductClick(product)}
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                            {LoadDetector}
                            <Skeleton />
                        </Scrollbar>
                    </>
                ) : (
                    EmptyState
                )}
            </>
            <ChatProductView productId={productId} streamerId={stream.streamer._id} />
        </div>
    )
}

Products.propTypes = {
    productId: PropTypes.string.isRequired,
    changeFilter: PropTypes.func.isRequired,
}

export default memo(Products)
