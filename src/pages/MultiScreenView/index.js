import { memo, useMemo } from 'react'
import { useQueries } from 'react-query'
import { setError } from '../../slices/rootSlice'
import { useDispatch } from 'react-redux'
import { getLocationParam } from 'utils/browserUtils'
import { getStreamDetails } from 'requests/stream-requests'
import Content from './Content'
import { useLocation } from 'wouter'
import { routes } from 'routes'

const MultiScreenView = () => {
    const param = useMemo(() => getLocationParam('streams'), [])
    const idsList = useMemo(() => param.split(',') || [], [param])
    const dispatch = useDispatch()
    const [, setLocation] = useLocation()

    const results = useQueries(
        idsList.map((streamId) => {
            return {
                queryKey: ['stream', streamId],
                queryFn: ({ queryKey }) => {
                    const [, streamId] = queryKey
                    return getStreamDetails({ streamId })
                },
                refetchOnWindowFocus: false,
                cacheTime: 0,
                onError(error) {
                    dispatch(setError({ message: 'Failed to fetch', error }))
                    setLocation(routes.feed.path)
                },
                retry: 1,
            }
        }),
    )
    const data = useMemo(() => results, [results])

    return <Content data={data} />
}

export default memo(MultiScreenView)
