import { Fragment, memo, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAuth, deleteAuth, postAuth } from 'requests/axiosConfig'
import { productFields, userFields } from '../fields'
import { useSelector, useDispatch } from 'react-redux'
import { setFollowing } from 'slices/sidebarSlice'

import Button from 'components/Button'
import DeleteProductModal from '../modals/DeleteProductModal'
import Modal from 'components/Modal'
import Slider from 'components/Slider'
import { useLocation } from 'wouter'
import BarSkeleton from 'components/Skeleton/BarSkeleton'
import UserCard from 'pages/PopularUsers/Card'
import PriceLabel from 'components/PriceLabel'

import { routes } from 'routes'
import { setError } from 'slices/rootSlice'

function ProductView({ params }) {
    const [productData, setProductData] = useState({})
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [buyRequest, setBuyRequest] = useState(false)
    const { me } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [, setLocation] = useLocation()

    const [isMyProduct, setIsMyProduct] = useState(params.userId === me?._id)
    const modalRef = useRef(null)

    useEffect(() => {
        getAuth(`/users/${params.userId}/products/${params.id}?_fields=${productFields}`)
            .then(({ data }) => {
                setProductData(data.result)
                setIsLoading(false)
            })
            .catch((error) => {
                setLocation(routes.feed.path)
                dispatch(setError({ message: t('objectNotFound'), error, id: 'product-not-found' }))
            })

        getAuth(`/users/${params.userId}?_fields=${userFields}`)
            .then(({ data }) => setUser(data.result))
            .catch(() => {
                setLocation(routes.feed.path)
            })

        params.userId === me?._id ? setIsMyProduct(true) : setIsMyProduct(false)
    }, [dispatch, me?._id, params.id, params.userId, setLocation, t])

    const handleBuyRequest = () => setBuyRequest(!buyRequest)

    const handleModalOpen = () => modalRef.current.open()
    const handleModalClose = () => modalRef.current.close()

    const handleProductDelete = () => {
        deleteAuth(`users/${params.userId}/products/${params.id}`)
        handleModalClose()
        setLocation('/me?tab=products')
    }

    const handleToggleSubscription = async (userId) => {
        if (user.inMySubscriptions) {
            await deleteAuth(`/users/${userId}/subscriptions`)
            setUser({ ...user, inMySubscriptions: false, subscriberCount: user.subscriberCount - 1 })
        } else {
            await postAuth(`/users/${userId}/subscriptions`, null)
            setUser({ ...user, inMySubscriptions: true, subscriberCount: user.subscriberCount + 1 })
        }

        updateSidebar()
    }

    const updateSidebar = () => {
        getAuth(`/users/${me?._id}/subscriptions?_fields=items(name, photo)&limit=${4}`).then(({ data }) => {
            dispatch(setFollowing(data.result.items))
        })
    }

    return (
        <div className="flex flex-col w-full py-10" style={{ maxWidth: '548px', margin: '0 auto' }}>
            {isLoading ? (
                <div className="mb-8">
                    <BarSkeleton />
                </div>
            ) : (
                <h1 className="text-lg font-bold mb-8">{productData.name}</h1>
            )}

            <Slider isLoaded={!isLoading} images={productData?.photos} />

            {isLoading ? (
                <div className="flex mb-8 items-center justify-center">
                    <div className="flex-1 flex">
                        <BarSkeleton height={40} />
                        <div className="ml-5">
                            <BarSkeleton height={40} />
                        </div>
                    </div>
                    <BarSkeleton height={40} width={40} />
                </div>
            ) : (
                <section className="flex mb-8 items-center justify-center">
                    <div className="flex flex-1">
                        {isMyProduct ? (
                            <Fragment>
                                <Button
                                    onClick={() => setLocation(`/me/products/edit/${params.id}`)}
                                    text={t('edit')}
                                    fontWeight="bold"
                                />

                                <div className="ml-5">
                                    <Button
                                        onClick={handleModalOpen}
                                        text={t('deleteProduct')}
                                        type="secondary"
                                        fontWeight="bold"
                                    />
                                </div>
                            </Fragment>
                        ) : (
                            <Button
                                text={buyRequest ? t('sentBuyRequestTip') : t('sendBuyRequest')}
                                onClick={handleBuyRequest}
                                isDisabled={buyRequest}
                            />
                        )}
                    </div>

                    <PriceLabel price={productData.price?.value} type="secondary" />
                </section>
            )}

            {productData.description && (
                <section className="mb-8">
                    {isLoading ? (
                        <div className="mb-3">
                            <BarSkeleton />
                        </div>
                    ) : (
                        <h2 className="text-m font-bold mb-3">{t('description')}</h2>
                    )}
                    {isLoading ? (
                        <div className="flex flex-col">
                            <BarSkeleton width={300} />
                        </div>
                    ) : (
                        <p className="text-s">{productData.description}</p>
                    )}
                </section>
            )}

            {!isMyProduct && (
                <section>
                    <UserCard
                        onToggleSubscription={handleToggleSubscription}
                        avatarSize={'10'}
                        isBordered={false}
                        user={user}
                        padding={0}
                        textSize="s"
                    />
                </section>
            )}

            <Modal size="sm" ref={modalRef}>
                <DeleteProductModal onClose={handleModalClose} onSubmit={handleProductDelete} />
            </Modal>
        </div>
    )
}

export default memo(ProductView)
