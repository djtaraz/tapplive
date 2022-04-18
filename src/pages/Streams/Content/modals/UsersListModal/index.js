/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react'
import { getAuth } from 'requests/axiosConfig'
import { useIntersect } from 'hooks/useIntersect'
import { useTranslation } from 'react-i18next'

import UserItem from './UserItem'
import Loader from 'components/Loader'

const itemsLimit = 20
const fetchData = (limit = itemsLimit, skip = 0, streamId) => {
    return getAuth(
        `/streams/${streamId}/subscribers?_fields=items(photo,name,inMySubscriptions,totalSpent,totalEarned)&skip=${skip}&limit=${limit}`,
    )
}

const UserListModal = ({ streamId }) => {
    const [data, setData] = useState({ items: [], totalCount: 0 })
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation()

    const [itemsToSkip, setItemsToSkip] = useState(0)
    const { setNode } = useIntersect(() => setMore(true))
    const [more, setMore] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetchData(itemsLimit, 0, streamId).then(({ data }) => {
            setIsLoading(false)
            setData(data.result)
            window.scrollTo(0, 0)
        })
    }, [])

    useEffect(() => {
        if (more) {
            fetchData(itemsLimit, itemsToSkip + itemsLimit, streamId).then(({ data }) => {
                setMore(false)
                setItemsToSkip(itemsToSkip + itemsLimit)
                setData((d) => ({
                    items: [...d.items, ...data.result.items],
                    totalCount: data.result.totalCount,
                }))
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [more, itemsToSkip])

    const LoadDetector = useMemo(() => {
        if (data && data.items.length < data.totalCount) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [data])

    return (
        <div className="h-full w-full flex flex-col items-center">
            <div className="flex w-full -z-0 items-center absolute top-6.5">
                <h3 className="bold text-center text-m font-bold flex-1">
                    {t('subscribers')}
                    <span className="ml-1">{data?.totalCount}</span>
                </h3>
            </div>

            <div className="w-full p-1 h-full overflow-auto">
                {data.items.length === 0 && (
                    <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center flex-col">
                        {data.items.length === 0 &&
                            isLoading === false &&
                            t(`streamSubscriptionTip`)
                                .split('\n')
                                .map((item, index) => (
                                    <p key={index} className="px-8 text-center text-s">
                                        {item} <br />
                                    </p>
                                ))}

                        {isLoading && <Loader theme="violet" width={32} height={32} />}
                    </div>
                )}

                <div className="w-full customScrollBar h-full overflow-auto px-7.5">
                    {data.items.map((user) => (
                        <UserItem
                            key={user._id}
                            image={user?.photo?.url}
                            name={user?.name}
                            id={user?._id}
                            inMySubscriptions={user?.inMySubscriptions}
                            userSpendings={user.totalSpent + user.totalEarned}
                        />
                    ))}

                    {LoadDetector}
                </div>
            </div>
        </div>
    )
}

export default UserListModal
