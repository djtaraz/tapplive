import React, { useMemo, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { get } from 'requests/axiosConfig'

import Button from 'components/Button'
import PageStripe from 'components/Layout/PageStripe'
import { userProps } from 'common/propTypes'
import Skeleton from './Skeleton'
import { array } from 'utils/arrayUtils'
import { useSelector, useDispatch } from 'react-redux'
import { screens } from 'common/screenResolutions'
import Avatar from '../../components/Avatar'
import AuthLink from 'components/AuthLink'

import { setFollowing } from 'slices/sidebarSlice'

const minCardWidth = 296
const usePopularUsersCount = () => {
    const { screen, isAuthenticated } = useSelector((state) => state.root)

    const memoCount = useMemo(() => {
        if (screen >= screens['2xl']) {
            const value = Math.floor(document.body.clientWidth / minCardWidth)
            /* ...value - 1... = space for auth sidebar */
            return isAuthenticated ? value - 1 : value
        } else if (screen === screens.xl) {
            return isAuthenticated ? 4 : 5
        } else if (screen === screens.lg) {
            return isAuthenticated ? 3 : 4
        } else if (screen === screens.md) {
            return 3
        } else {
            return 2
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [screen, isAuthenticated])
    const [count, setCount] = useState(memoCount)

    useEffect(() => {
        setCount(memoCount)
    }, [memoCount])

    return [count, setCount]
}

function PopularUsers({ users, onToggleSubscription }) {
    const { screen, me, isAuthenticated } = useSelector((state) => state.root)
    const [count, setCount] = usePopularUsersCount()
    const containerRef = useRef()
    const { t } = useTranslation()

    const dispatch = useDispatch()

    useEffect(() => {
        const node = containerRef.current

        function onResize() {
            const { width } = containerRef.current.getBoundingClientRect()

            if ([screens['2xl'], screens['3xl'], screens['4xl']].includes(screen)) {
                setCount(Math.floor(width / minCardWidth))
            }
        }

        onResize()
        const ro = new ResizeObserver(() => {
            containerRef.current !== null && onResize()
        })
        ro.observe(node)
        window.addEventListener('resize', onResize)
        return () => {
            ro.unobserve(node)

            window.removeEventListener('resize', onResize)
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [screen])

    const LoadingSkeleton = useMemo(() => array(count).map((_, i) => <Skeleton key={`skeleton-${i}`} />), [count])

    const data = useMemo(() => {
        if (!users || count === 0) {
            return null
        } else {
            return count < users.length ? users.slice(0, count) : users
        }
    }, [count, users])

    const updateSidebar = () => {
        get(`/users/${me?._id}/subscriptions?_fields=items(name, photo)&limit=${4}`).then(({ data }) => {
            dispatch(setFollowing(data?.result?.items))
        })
    }

    const handleToggleSubscribtion = async (user) => {
        await onToggleSubscription(user._id)

        updateSidebar()
    }

    return (
        <PageStripe title={t('popularUsers')} watchAll="/popular-users">
            <div
                ref={containerRef}
                style={{
                    height: '130px',
                    gridTemplateColumns: Array(count)
                        .fill(1)
                        .map(() => 'minmax(0,1fr)')
                        .join(' '),
                }}
                className="grid gap-5">
                {data
                    ? data.map((user) => (
                          <div
                              key={user._id}
                              className="box-border flex items-center rounded-3 border border-gray-light p-5">
                              <Avatar crop="60x60" size="m" photoUrl={user?.photo?.url} to={`/user/${user._id}`} />
                              <div className="ml-3.5 overflow-hidden flex-1">
                                  <AuthLink to={`/user/${user._id}`}>
                                      <a className="grid">
                                          <div className="truncate text-m font-semibold">{user.name}</div>
                                      </a>
                                  </AuthLink>
                                  <div className="text-s">
                                      {t('subscribers')} {user.subscriberCount}
                                  </div>
                                  {me?._id !== user?._id && (
                                      <div className="mt-3">
                                          <Button
                                              onClick={() => handleToggleSubscribtion(user)}
                                              isBig={false}
                                              px={user.inMySubscriptions ? '4' : '6'}
                                              text={user.inMySubscriptions ? t('cancel_track') : t('track')}
                                              type={user.inMySubscriptions ? 'secondary' : 'primary'}
                                              fontWeight="normal"
                                              isDisabled={!isAuthenticated}
                                          />
                                      </div>
                                  )}
                              </div>
                          </div>
                      ))
                    : LoadingSkeleton}
            </div>
        </PageStripe>
    )
}

PopularUsers.defaultTypes = {}
PopularUsers.propTypes = {
    users: PropTypes.arrayOf(PropTypes.exact(userProps)),
    onToggleSubscription: PropTypes.func.isRequired,
}

export default PopularUsers
