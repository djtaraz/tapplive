import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'
import EmptyStateImage from 'assets/svg/illustrations/bag.svg'
import { getProducts } from 'requests/product-requests'
import Product, { ProductSkeleton } from 'components/Product'
import { useProfile } from '../ProfileContext'
import FeedList from 'pages/Feed/FeedList'

const ProfileSubscriptions = () => {
    const { userId, isMe } = useProfile()
    const { t } = useTranslation()
    const [, setLocation] = useLocation()

    const EmptyState = useCallback(
        () => (
            <div className="text-center py-90p">
                <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
                <div style={{ maxWidth: '516px' }} className="text-s mt-3 mx-auto">
                    {isMe ? t('profilePage.productsEmptyMsg.me') : t('profilePage.productsEmptyMsg.other')}
                </div>
            </div>
        ),
        [isMe, t],
    )

    const handleProductClick = ({ _id }) => setLocation(`/product/${userId}/${_id}`)

    return (
        <FeedList
            fetchFn={getProducts}
            extraFnProp={{
                userId,
            }}
            renderItem={({ item }) => (
                <Product onClick={() => handleProductClick(item)} key={item._id} product={item} />
            )}
            containerClassName="mt-11"
            queryKey={`profile-products-${userId}`}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            forceGridTemplate="grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            EmptyComponent={<EmptyState />}
            Skeleton={ProductSkeleton}
            skeletonCount={3}
        />
    )
}

export default memo(ProfileSubscriptions)
