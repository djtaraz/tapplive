import { useEffect, useState, useMemo } from 'react'
import cn from 'classnames'
import { get, getAuth } from 'requests/axiosConfig'

import { Trans, useTranslation } from 'react-i18next'
import { profileData, review } from './fields'

import { useIntersect } from 'hooks/useIntersect'
import { array } from 'utils/arrayUtils'

import ProfileImagePlaceholder from 'assets/svg/profile-user-image.svg'
import { ReviewSkeleton, UserDataSkeleton } from './Skeleton'
import Review from './Review'
import { cropImage } from '../../../../utils/cropImage'

const fetchData = (userId) => {
    return getAuth(`/users/${userId}?_fields=${profileData}`)
}

const itemsLimit = 10
const fetchReviews = (userId, limit = itemsLimit, skip = 0) => {
    return getAuth(`/users/${userId}/reviews?_fields=${review}&skip=${skip}&limit=${limit}`)
}

const RatingTab = ({ userId }) => {
    const { t } = useTranslation()
    const [profileData, setProfileData] = useState({})
    const [reviews, setReviews] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [itemsToSkip, setItemsToSkip] = useState(0)
    const { setNode } = useIntersect(() => setMore(true))
    const [more, setMore] = useState(false)

    useEffect(() => {
        fetchData(userId).then(({ data }) => {
            let prevResult = { ...data.result }
            get(`/users/${data.result._id}/reviews?limit=1`).then(({ data }) => {
                setProfileData({ ...prevResult, totalCount: data.result.allReviewsCount })
                setIsLoading(false)
            })
        })

        fetchReviews(userId).then(({ data }) => {
            setReviews(data.result)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (more) {
            fetchReviews(userId, itemsLimit, itemsToSkip + itemsLimit).then(({ data }) => {
                setMore(false)
                setItemsToSkip(itemsToSkip + itemsLimit)
                setReviews({
                    items: [...reviews.items, ...data.result.items],
                    totalCount: data.result.totalCount,
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [more, itemsToSkip])

    const LoadDetector = useMemo(() => {
        if (reviews && reviews?.items?.length < reviews?.totalCount) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [reviews])

    const getFloatRating = () => {
        return profileData?.rating ? profileData.rating / 10 : '0'
    }

    return (
        <div className="pt-5.5 h-full flex flex-col overflow-hidden">
            {isLoading ? (
                <UserDataSkeleton />
            ) : (
                <div className="flex items-center pb-10 px-7.5">
                    <div className="relative w-20 h-20">
                        <img
                            className="w-20 h-20 object-cover rounded-5"
                            alt="streamer-profile-img"
                            src={
                                profileData?.photo?.url
                                    ? cropImage(profileData?.photo?.url, 100)
                                    : ProfileImagePlaceholder
                            }
                        />
                        {profileData && profileData?.tLevel?.misc?.frameColors && (
                            <div
                                className="absolute -inset-3 -z-1"
                                style={{
                                    transform: 'scale(.83)',
                                    borderRadius: '25px',
                                    background: `linear-gradient(180deg, ${profileData?.tLevel?.misc?.frameColors.join(
                                        ',',
                                    )})`,
                                }}></div>
                        )}
                        <div className="absolute -bottom-1.5 -right-1.5 bg-black-theme w-9 h-9 flex justify-center items-center text-white rounded-full text-ms font-bold">
                            {profileData?.rating && getFloatRating()}
                        </div>
                    </div>

                    <div className="flex flex-col ml-6">
                        <h2 className="font-semibold text-ml mb-2.5">{profileData?.name}</h2>
                        <span className="text-s">
                            {t('profilePage.point', { count: profileData?.totalCount || 0 })}
                        </span>
                    </div>
                </div>
            )}

            <div
                className={cn(
                    `flex-1 customScrollBar overflow-auto pb-5`,
                    reviews?.totalCount === 0 ? 'flex  justify-center pt-16.5 pb-20' : 'pl-7.5',
                )}>
                {reviews?.items?.map((review) => (
                    <Review user={review?.user} body={review?.body} rating={review?.rating} />
                ))}

                {reviews?.totalCount === 0 && (
                    <p className="text-center">
                        <Trans i18nKey="followingDetails.reviewsMsg" />
                    </p>
                )}

                {more && array(10).map((_, i) => <ReviewSkeleton key={`more-skeleton-${i}`} />)}
                {!reviews && array(20).map((_, i) => <ReviewSkeleton key={`loading-skeleton-${i}`} />)}
                {LoadDetector}
            </div>
        </div>
    )
}

export default RatingTab
