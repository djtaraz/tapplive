import React, { memo, useMemo } from 'react'
import { Link, useLocation } from 'wouter'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import SkeletonNavbar from 'components/Skeleton/NavbarSkeleton'
import Button from 'components/Button'
import { ReactComponent as LogoIcon } from 'assets/svg/logo.svg'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import { ReactComponent as SearchIconActive } from 'assets/svg/search-active.svg'
import { formatCost } from 'utils/numberUtils'
import NavbarSearch from 'components/NavbarSearch'
import usePageLocation from 'hooks/usePageLocation'
import { useSelector, useDispatch } from 'react-redux'
import { screens } from 'common/screenResolutions'
import NavLink from 'components/NavLink'
import Avatar from 'components/Avatar'
import { routes } from 'routes'
import { ReactComponent as StreamsIcon } from 'assets/interface-icons/streams-icon.svg'
import { ReactComponent as FeedIcon } from 'assets/interface-icons/recomendations-icon.svg'
import { setModalState } from 'slices/rootSlice'
import Messages from './components/Messages'
import LeaderFrame from '../Leaders/LeaderFrame'
import Notifications from './components/Notifications'
import { LanguageSelector } from './components/LanguageSelector'

const Navbar = () => {
    const { t, ready } = useTranslation()
    const [location, setLocation] = useLocation()
    const dispatch = useDispatch()

    const { screen, isAuthenticated, me } = useSelector((state) => state.root)

    const { unreadMsgCount } = useSelector((state) => state.chat)

    const borderedAvatarLocations = usePageLocation([`/user/${me?._id}`, '/me'])
    const activeSearchLocations = usePageLocation(['/search'])

    const navLinkClasses = 'font-semibold text-base md:text-lg cursor-pointer'
    const navLinkActiveClasses = 'text-violet-saturated'

    const navLinkLiClasses = cn('first:ml-0', screen >= screens.md ? 'ml-10.5' : 'ml-5.5')

    const navLinks = useMemo(
        () => [
            {
                title: t('feed'),
                icon: StreamsIcon,
                to: routes.feed.path,
            },
            {
                title: t('recommendations'),
                icon: FeedIcon,
                to: routes.recommendations.path,
            },
        ],
        [t],
    )

    return ready ? (
        <div
            className={cn(
                'grid items-center bg-white z-100 p-5 border-b border-gray-light absolute left-0 right-0 top-0',
                isAuthenticated ? 'grid-cols-header_adaptive md:grid-cols-header' : 'grid-cols-header',
            )}>
            <div className="flex items-center">
                <Link to={'/'}>
                    <a className="py-2.5 px-3 w-10 h-10 bg-violet-saturated rounded-2">
                        <LogoIcon />
                    </a>
                </Link>
                {isAuthenticated && (
                    <ul className="hidden sm:flex ml-8">
                        {navLinks.map((link) => (
                            <li key={link.to} className={navLinkLiClasses}>
                                {screen >= screens.md ? (
                                    <NavLink
                                        to={link.to}
                                        activeClasses={navLinkActiveClasses}
                                        className={navLinkClasses}>
                                        {link.title}
                                    </NavLink>
                                ) : (
                                    <Link to={link.to}>
                                        <div
                                            className={
                                                location.includes(link.to) ? navLinkActiveClasses : navLinkClasses
                                            }>
                                            <link.icon />
                                        </div>
                                    </Link>
                                )}
                            </li>
                        ))}

                        {screen < screens.md && (
                            <div className="ml-5.5">
                                <Link to="/search">
                                    <a>
                                        {activeSearchLocations ? (
                                            <SearchIconActive className="w-5 h-5" />
                                        ) : (
                                            <SearchIcon className="w-5 h-5" />
                                        )}
                                    </a>
                                </Link>
                            </div>
                        )}
                    </ul>
                )}
            </div>
            <div className={cn('justify-self-center hidden md:block', isAuthenticated && 'hidden')}>
                {isAuthenticated && screen >= screens.lg && (
                    <div style={{ width: '216px' }}>
                        <NavbarSearch placeholder={t('search_placeholder')} />
                    </div>
                )}
                {!isAuthenticated && (
                    <div style={{ width: '216px' }}>
                        <NavbarSearch placeholder={t('search_placeholder')} />
                    </div>
                )}
            </div>
            <div className="justify-self-end hidden sm:grid grid-flow-col items-center gap-5">
                {isAuthenticated && me && (
                    <>
                        {screen <= screens.md && screen > screens.sm && (
                            <Link to="/search">
                                <a>
                                    {activeSearchLocations ? (
                                        <SearchIconActive className="w-5 h-5" />
                                    ) : (
                                        <SearchIcon className="w-5 h-5" />
                                    )}
                                </a>
                            </Link>
                        )}
                        <Link to="/me/balance">
                            <div className="p-2 bg-black-theme text-xs text-white rounded-2.5 cursor-pointer">
                                ${formatCost(me?.balances?.usd || 0)}
                                {me?.balances?.usdHold ? (
                                    <span className="opacity-70"> + ${formatCost(me?.balances?.usdHold)}</span>
                                ) : (
                                    ''
                                )}
                            </div>
                        </Link>
                        <Notifications />
                        <Messages active={unreadMsgCount > 0} />
                        <LeaderFrame
                            isBordered={borderedAvatarLocations}
                            icon={me.tLevel?.misc.icon}
                            colors={me.tLevel?.misc.frameColors}>
                            <Avatar alt="User Avatar" to={`/user/${me._id}`} photoUrl={me?.photo?.url} crop="40x40" />
                        </LeaderFrame>
                    </>
                )}
                {!isAuthenticated && <LanguageSelector />}
                {isAuthenticated ? (
                    <Button onClick={() => setLocation('/streams/create')} text={t('newStream')} />
                ) : (
                    <Button onClick={() => dispatch(setModalState(true))} text={t('login')} />
                )}
            </div>
        </div>
    ) : (
        <SkeletonNavbar />
    )
}

export default memo(Navbar)
