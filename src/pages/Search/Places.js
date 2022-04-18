import { useState, memo, useEffect, Fragment, useMemo } from 'react'
import { useIntersect } from 'hooks/useIntersect'
import { getAuth, get } from 'requests/axiosConfig'
import { placeFields } from './fields'

import Place from 'components/Place'
import TagPlaceSkeleton from './TagPlaceSkeleton'
import EmptyState from './EmptyState'

import { useDispatch, useSelector } from 'react-redux'
import { setRecentPlaces, setGlobalSearchTerm } from 'slices/searchSlice'

import { useTranslation } from 'react-i18next'
import useDebounce from 'hooks/useDebounce'

const itemsLimit = 20
const fetchData = (limit = itemsLimit, skip = 0, term, isAuth) => {
    const reqURL = `/places?_fields=${placeFields}&q=${term}&skip=${skip}&limit=${limit}`
    return isAuth ? getAuth(reqURL) : get(reqURL)
}

const Places = ({ searchTerm, searchUpdate }) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [itemsToSkip, setItemsToSkip] = useState(0)
    const { setNode } = useIntersect(() => setMore(true))
    const [more, setMore] = useState(false)

    const debouncedSearch = useDebounce(searchTerm, 250)
    const { t } = useTranslation()

    const dispatch = useDispatch()
    const { recentPlaces } = useSelector((state) => state.search)
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

    const handlePlaceClick = (place) => {
        window.scrollTo(0, 0)
        dispatch(setRecentPlaces([place, ...recentPlaces.slice(0, 4)]))
    }

    return (
        <Fragment>
            <div className="w-full grid">
                {!isLoading &&
                    data?.items?.map((place) => (
                        <Place
                            onClick={() => handlePlaceClick(place)}
                            key={place._id}
                            name={place?.location?.name}
                            id={place?._id}
                            postCount={place?.postCount}
                        />
                    ))}

                {LoadDetector}
            </div>

            {more && <TagPlaceSkeleton count={10} />}
            {!data && <TagPlaceSkeleton count={10} />}

            {isLoading && searchTerm && <TagPlaceSkeleton count={10} />}

            {data?.totalCount === 0 && !isLoading && <EmptyState />}
            {!searchTerm && !isLoading && <EmptyState tip={t('places_search_tip')} />}
        </Fragment>
    )
}

export default memo(Places)
