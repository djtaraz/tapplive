import { useState, memo, useEffect, Fragment, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useIntersect } from 'hooks/useIntersect'
import { getAuth, deleteAuth, postAuth, get } from 'requests/axiosConfig'
import { peopleFields } from './fields'
import PeoplesGridSkeleton from 'components/Skeleton/PeoplesGridSkeleton'
import PeopleCard from 'pages/PopularUsers/Card'
import EmptyState from './EmptyState'
import { setRecentPeoples, setGlobalSearchTerm } from 'slices/searchSlice'
import { setFollowing } from 'slices/sidebarSlice'
import useDebounce from 'hooks/useDebounce'

const itemsLimit = 20
const fetchData = (limit = itemsLimit, skip = 0, term, isAuth) => {
    const url = `/users?_fields=${peopleFields}&q=${term}&skip=${skip}&limit=${limit}`
    return isAuth ? getAuth(url) : get(url)
}

const People = ({ searchTerm, searchUpdate }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const debouncedSearch = useDebounce(searchTerm, 250)
    const { t } = useTranslation()

    const [itemsToSkip, setItemsToSkip] = useState(0)
    const { setNode } = useIntersect(() => setMore(true))
    const [more, setMore] = useState(false)

    const dispatch = useDispatch()
    const { recentPeoples } = useSelector((state) => state.search)
    const { me, isAuthenticated } = useSelector((state) => state.root)

    useEffect(() => {
        if (debouncedSearch) {
            setIsLoading(true)

            fetchData(20, 0, debouncedSearch, isAuthenticated).then((res) => {
                setData(res.data.result)
                setIsLoading(false)
            })

            dispatch(setGlobalSearchTerm(debouncedSearch))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch])

    useEffect(() => {
        if (debouncedSearch) {
            setData({})
            setIsLoading(true)
            fetchData(20, 0, debouncedSearch, isAuthenticated).then((res) => {
                setData(res.data.result)
                setIsLoading(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchUpdate])

    useEffect(() => {
        if (more) {
            fetchData(itemsLimit, itemsToSkip + itemsLimit, debouncedSearch, isAuthenticated).then((res) => {
                setMore(false)
                setItemsToSkip(itemsToSkip + itemsLimit)
                setData({
                    items: [...data.items, ...res.data.result.items],
                    totalCount: res.data.result.totalCount,
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [more, itemsToSkip])

    useEffect(() => {
        if (!searchTerm) {
            setData({})
            setIsLoading(false)
        } else {
            setIsLoading(true)
            setData({})
        }
    }, [searchTerm])

    const LoadDetector = useMemo(() => {
        if (data && data?.items?.length < data.totalCount) {
            return <div className="h-4" ref={(el) => setNode(el)}></div>
        } else {
            return null
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [data])

    const handleToggleSubscription = async (userId) => {
        const targetUser = data?.items.find((u) => u._id === userId)

        if (targetUser) {
            targetUser.inMySubscriptions
                ? await deleteAuth(`/users/${userId}/subscriptions`)
                : await postAuth(`/users/${userId}/subscriptions`, null)
            updateSidebar()
        }

        setData((d) => ({
            ...d,
            items: d.items.map((u) => (u._id === userId ? { ...u, inMySubscriptions: !u.inMySubscriptions } : u)),
        }))
    }

    const updateSidebar = () => {
        get(`/users/${me?._id}/subscriptions?_fields=items(name, photo)&limit=${4}`).then(({ data }) => {
            dispatch(setFollowing(data?.result?.items))
        })
    }

    const handleUserClick = (user) => {
        window.scrollTo(0, 0)
        dispatch(setRecentPeoples([user, ...recentPeoples.slice(0, 4)]))
    }

    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data &&
                    data?.items?.map((user) => (
                        <PeopleCard
                            onToggleSubscription={handleToggleSubscription}
                            onClick={() => handleUserClick(user)}
                            key={user._id}
                            user={user}
                        />
                    ))}

                {LoadDetector}
            </div>

            {more && <PeoplesGridSkeleton count={10} />}
            {!data && <PeoplesGridSkeleton count={10} />}

            {isLoading && searchTerm && <PeoplesGridSkeleton count={10} />}

            {data?.totalCount === 0 && !isLoading && <EmptyState />}
            {!searchTerm && !isLoading && <EmptyState tip={t('peoples_search_tip')} />}
        </Fragment>
    )
}

export default memo(People)
