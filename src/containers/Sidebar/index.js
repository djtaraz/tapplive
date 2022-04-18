import React, { useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import { useSelector, useDispatch } from 'react-redux'

import { get } from 'requests/axiosConfig'
import { setStreams, setFollowing } from 'slices/sidebarSlice'
import Avatar from 'components/Avatar'
import { getSubscriptions } from '../../requests/stream-requests'
import StreamCard from 'components/Card/StreamCard'

const Sidebar = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { me } = useSelector((state) => state.root)
    const { streams, following } = useSelector((state) => state.sidebar)

    const fetchFollowing = (limit = 4) => {
        get(`/users/${me?._id}/subscriptions?_fields=items(name, photo)&limit=${limit}`).then(({ data }) => {
            dispatch(setFollowing(data?.result?.items))
        })
    }

    useEffect(() => {
        if (me) {
            getSubscriptions({ limit: 4 }).then((result) => {
                dispatch(setStreams(result.items))
            })

            fetchFollowing(4)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me])

    return (
        <div className="h-full py-10">
            <div className="px-7.5 py-5 bg-gray-pale w-full rounded-2.5 overflow-hidden">
                <h2 className="font-bold mb-3">{t('sidebar.first_block_headline')}</h2>

                {streams?.length === 0 && <p className="text-s">{t('sidebar.first_block_placeholder')}</p>}

                <div className="grid-cols-1 grid gap-5 w-full">
                    {streams &&
                        streams.map((stream) => <StreamCard key={stream?._id} stream={stream} showTags={false} />)}
                </div>
            </div>
            <div className="p-7.5 bg-gray-pale rounded-2.5 mt-5">
                <h2 className="font-bold mb-3">{t('sidebar.second_block_headline')}</h2>
                {following?.length === 0 && <p className="text-s">{t('sidebar.second_block_placeholder')}</p>}

                {following &&
                    following.map((person) => (
                        <div key={person._id} className="self-start col-start-1 col-end-2 mb-3.5 flex items-center">
                            <Avatar
                                photoUrl={person.photo?.url}
                                crop="40x40"
                                to={`/user/${person._id}`}
                                alt="User Profile"
                            />

                            <Link to={`/user/${person._id}`}>
                                <a className="block truncate text-s text-violet-saturated ml-3">
                                    {person.name || 'Unknown'}
                                </a>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default memo(Sidebar)
