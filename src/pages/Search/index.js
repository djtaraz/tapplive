import React, { useState, memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'
import cn from 'classnames'

import { screens } from 'common/screenResolutions'
import { useSelector, useDispatch } from 'react-redux'
import { setGlobalSearchTab } from 'slices/searchSlice'

import NavToggle from 'components/NavToggle'
import Select from './Select'
import FormatAmount from 'components/FormatAmount'
import StreamPreview from './StreamPreview'

import { ReactComponent as PlaceIcon } from 'assets/interface-icons/place-icon.svg'
import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import { ReactComponent as CloseIcon } from 'assets/svg/close.svg'

import Streams from './Streams'
import People from './People'
import Orders from './Orders'
import Tags from './Tags'
import Places from './Places'
import Avatar from 'components/Avatar'

function Search() {
    const { t } = useTranslation()

    const dispatch = useDispatch()
    const {
        recentStreams,
        recentTags,
        recentPlaces,
        recentOrders,
        recentPeoples,
        globalSearchTerm,
        globalSearchTab,
    } = useSelector((state) => state.search)
    const { screen, me } = useSelector((state) => state.root)

    const filters = [
        { name: t('streams'), value: 'streams', label: t('streams') },
        { name: t('people'), value: 'people', label: t('people') },
        { name: t('orders'), value: 'orders', label: t('orders') },
        { name: t('tags'), value: 'tags', label: t('tags') },
        { name: t('places'), value: 'places', label: t('places') },
    ]

    const [filter, setFilter] = useState(globalSearchTab || filters[0])
    const [searchTerm, setSearchTerm] = useState('')
    const [searchUpdate, setSearchUpdate] = useState(false)

    const [isRecentOpened, setIsRecentOpened] = useState(false)
    const [isRecentHovered, setIsRecentHovered] = useState(false)
    const [isRecentAvailable, setIsRecentAvailable] = useState(false)

    useEffect(() => {
        setIsRecentAvailable(checkRecentQueriesLength(filter.value))
        dispatch(setGlobalSearchTab(filter))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter.value])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => (globalSearchTab ? setFilter(globalSearchTab) : filters[0]), [])
    useEffect(() => setSearchTerm(globalSearchTerm), [globalSearchTerm])

    const checkRecentQueriesLength = (value) => {
        switch (value) {
            case 'streams':
                return recentStreams.length || false
            case 'people':
                return recentPeoples.length || false
            case 'orders':
                return recentOrders.length || false
            case 'tags':
                return recentTags.length || false
            case 'places':
                return recentPlaces.length || false
            default:
                return false
        }
    }

    const handleSearchBlur = () => (isRecentHovered ? false : setIsRecentOpened(false))

    const handleSearchKeyDown = (e) => {
        if (e.keyCode === 13) {
            setSearchUpdate(!searchUpdate)
        }
    }

    const handleSelectChange = (e) => {
        setFilter(e)
    }

    return (
        <div className="py-10">
            <div className="flex justify-between mb-7.5">
                <div className="relative w-full">
                    <SearchIcon className="absolute-center-y left-4" />
                    <input
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('search_placeholder')}
                        value={searchTerm}
                        onKeyDown={handleSearchKeyDown}
                        onFocus={() => setIsRecentOpened(true)}
                        onBlur={handleSearchBlur}
                        className={cn(
                            'h-17 pl-12 pr-12 text-xl font-semibold bg-gray-pale w-full focus:bg-white border border-gray-pale',
                            isRecentOpened && !searchTerm && isRecentAvailable
                                ? 'border-b-0 border-r-0 rounded-tl-2.5'
                                : 'rounded-l-2.5',
                        )}
                        type="text"
                    />

                    {searchTerm && (
                        <CloseIcon
                            onClick={() => {
                                setSearchTerm('')
                            }}
                            className="absolute-center-y cursor-pointer right-4"
                        />
                    )}

                    {isRecentOpened && !searchTerm && isRecentAvailable && (
                        <div
                            onMouseEnter={() => {
                                setIsRecentHovered(true)
                            }}
                            onClick={() => setIsRecentOpened(false)}
                            onMouseLeave={() => setIsRecentHovered(false)}
                            className="py-3.5 absolute border border-gray-pale w-full border-t-0 rounded-b-2.5 bg-white z-50">
                            <div className="ml-12 text-s text-gray-standard mb-2">{t('latter')}</div>

                            {filter.value === 'streams' &&
                                recentStreams.map((stream) => <StreamPreview type="stream" stream={stream} />)}

                            {filter.value === 'people' &&
                                recentPeoples.map((user) => (
                                    <Link to={me?._id === user._id ? `/me` : `/user/${user._id}`}>
                                        <div className="w-full flex px-12 py-2 items-center transition-all cursor-pointer hover:bg-gray-pale">
                                            <Avatar
                                                alt="User Avatar"
                                                to="/me"
                                                photoUrl={user.photo?.url}
                                                crop="60x60"
                                            />
                                            <span className="font-bold text-s ml-2.5">{user?.name}</span>
                                        </div>
                                    </Link>
                                ))}

                            {filter.value === 'orders' &&
                                recentOrders.map((order) => <StreamPreview type="order" stream={order} />)}

                            {filter.value === 'tags' &&
                                recentTags.map((tag) => (
                                    <Link to={`/tags/${tag?._id}`}>
                                        <div className="w-full flex px-12 py-2.5 items-center transition-all cursor-pointer hover:bg-gray-pale">
                                            <span className="text-s flex-1">{tag?.name}</span>
                                            <span className="text-xs">
                                                <FormatAmount amount={tag?.postCount} />{' '}
                                                {t('publication', { count: tag?.postCount })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}

                            {filter.value === 'places' &&
                                recentPlaces.map((place) => (
                                    <Link to={`/places/${place?._id}`}>
                                        <div className="w-full flex px-12 py-2.5 items-center transition-all cursor-pointer hover:bg-gray-pale">
                                            <PlaceIcon className="mr-4" />
                                            <span className="flex-1 text-s font-bold">{place?.location?.name}</span>
                                            <span className="text-xs">
                                                <FormatAmount amount={place?.postCount} />{' '}
                                                {t('publication', { count: place?.postCount })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'flex items-center  rounded-r-2.5 ',
                        screen < screens.md ? '' : 'border border-gray-pale px-5 justify-between',
                    )}>
                    {screen >= screens.md && (
                        <NavToggle onChange={(newFilter) => setFilter(newFilter)} active={filter} items={filters} />
                    )}

                    {screen < screens.md && (
                        <div className="w-100" style={{ width: '150px' }}>
                            <Select
                                white={true}
                                defaultValue={{
                                    value: filter.value,
                                    label: filter.label,
                                }}
                                onChange={handleSelectChange}
                                options={filters}
                            />
                        </div>
                    )}
                </div>
            </div>

            {filter.value === 'streams' && <Streams searchUpdate={searchUpdate} searchTerm={searchTerm} />}
            {filter.value === 'people' && <People searchUpdate={searchUpdate} searchTerm={searchTerm} />}
            {filter.value === 'orders' && <Orders searchUpdate={searchUpdate} searchTerm={searchTerm} />}
            {filter.value === 'tags' && <Tags searchUpdate={searchUpdate} searchTerm={searchTerm} />}
            {filter.value === 'places' && <Places searchUpdate={searchUpdate} searchTerm={searchTerm} />}
        </div>
    )
}

export default memo(Search)
