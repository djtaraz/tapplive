import { useState, memo, useEffect, Fragment, useMemo } from 'react'
import { useIntersect } from 'hooks/useIntersect'
import { get, getAuth } from 'requests/axiosConfig'
import { orderFields } from './fields'

import CardGridSkeleton from 'components/Skeleton/CardGridSkeleton'
import StreamOrderCard from 'components/Card/StreamOrderCard'
import EmptyState from './EmptyState'

import { useDispatch, useSelector } from 'react-redux'
import { setRecentOrders, setGlobalSearchTerm } from 'slices/searchSlice'

import { useTranslation } from 'react-i18next'
import useDebounce from 'hooks/useDebounce'

const itemsLimit = 20
const fetchData = (limit = itemsLimit, skip = 0, term, isAuth) => {
    const reqURL = `/streamorders?_fields=${orderFields}&q=${term}&skip=${skip}&limit=${limit}`
    return isAuth ? getAuth(reqURL) : get(reqURL)
}

const Orders = ({ searchTerm, searchUpdate }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [itemsToSkip, setItemsToSkip] = useState(0)
    const { setNode } = useIntersect(() => setMore(true))
    const [more, setMore] = useState(false)

    const debouncedSearch = useDebounce(searchTerm, 250)
    const { t } = useTranslation()

    const dispatch = useDispatch()
    const { recentOrders } = useSelector((state) => state.search)
    const { isAuthenticated } = useSelector((state) => state.root)

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

    const gridTemplate = `grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-296`

    const handleOrderClick = (order) => {
        window.scrollTo(0, 0)
        dispatch(setRecentOrders([order, ...recentOrders.slice(0, 4)]))
    }

    return (
        <Fragment>
            <div className={`grid ${gridTemplate} gap-x-5 gap-y-8.5`}>
                {data?.items?.map((order) => (
                    <StreamOrderCard onClick={() => handleOrderClick(order)} key={order._id} order={order} />
                ))}

                {LoadDetector}
            </div>

            {more && <CardGridSkeleton showTitle={false} count={10} />}
            {!data && <CardGridSkeleton showTitle={false} count={10} />}

            {isLoading && searchTerm && <CardGridSkeleton showTitle={false} count={10} />}

            {data?.totalCount === 0 && !isLoading && <EmptyState />}
            {!searchTerm && !isLoading && <EmptyState tip={t('orders_search_tip')} />}
        </Fragment>
    )
}

export default memo(Orders)
