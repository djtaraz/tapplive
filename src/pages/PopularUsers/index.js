import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { deleteAuth, postAuth, get } from 'requests/axiosConfig'
import fields from './fields'
import Card from './Card'
import Skeleton from './Skeleton'
import { setFollowing } from 'slices/sidebarSlice'
import FeedList from 'pages/Feed/FeedList'
import { getUsersList } from 'requests/user-requests'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'

function PopularUsers() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const { me } = useSelector((state) => state.root)
    const dispatch = useDispatch()

    const handleToggleSubscription = async (targetUser) => {
        if (targetUser) {
            if (targetUser.inMySubscriptions) {
                await deleteAuth(`/users/${targetUser._id}/subscriptions`)
            } else {
                await postAuth(`/users/${targetUser._id}/subscriptions`, null)
            }

            updateSidebar()
            await queryClient.refetchQueries(['popular-users', localStorage.getItem('sessionId')], { active: true })
        }
    }

    const updateSidebar = () => {
        get(`/users/${me?._id}/subscriptions?_fields=items(name,photo)&limit=${4}`).then(({ data }) => {
            dispatch(setFollowing(data?.result?.items))
        })
    }

    return (
        <FeedList
            title={t('popularUsers')}
            containerClassName="py-10"
            fetchFn={getUsersList}
            extraFnProp={{
                fields,
            }}
            Skeleton={Skeleton}
            renderItem={({ item }) => (
                <Card key={item._id} user={item} onToggleSubscription={() => handleToggleSubscription(item)} />
            )}
            queryKey={'popular-users'}
            errorMsg="Failed to fetch"
            useInfiniteScroll={true}
            forceGridTemplate="grid-cols-1 md:grid-cols-2 gap-5"
        />
    )
}

export default memo(PopularUsers)
