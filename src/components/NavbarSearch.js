import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'

import cn from 'classnames'

import { useSelector, useDispatch } from 'react-redux'
import { setGlobalSearchTerm, setRecentQueries, setGlobalSearchTab } from 'slices/searchSlice'

import { useTranslation } from 'react-i18next'
import { useLocation } from 'wouter'

import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'

function NavbarSearch({ placeholder }) {
    const [isRecentOpened, setIsRecentOpened] = useState(false)
    const [isRecentHovered, setIsRecentHovered] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')

    const { recentQueries } = useSelector((state) => state.search)
    const dispatch = useDispatch()

    const [, setLocation] = useLocation()
    const { t } = useTranslation()

    const handleRecentClick = (query) => {
        setLocation(`/search`)
        setIsRecentOpened(false)
        dispatch(setGlobalSearchTerm(query))
    }

    const handleSearchChange = (e) => setSearchTerm(e.target.value)

    const handleKeyDown = (e) => {
        if (e.target.value !== '') {
            if (e.keyCode === 13) {
                setIsRecentHovered(false)
                setIsRecentOpened(false)

                dispatch(setRecentQueries([...new Set([searchTerm, ...recentQueries.slice(0, 4)])]))
                dispatch(setGlobalSearchTerm(searchTerm))
                dispatch(setGlobalSearchTab(null))

                setLocation(`/search`)

                setSearchTerm('')
                e.target.value = ''
                e.target.blur()
            }
        } else {
            return false
        }
    }

    const handleSearchBlur = () => (isRecentHovered ? false : setIsRecentOpened(false))

    return (
        <div className="relative w-full">
            <SearchIcon className="absolute-center-y left-3.5" />
            <input
                onChange={handleSearchChange}
                placeholder={placeholder}
                className={cn(
                    'h-10 pl-10 pr-4 text-s bg-gray-pale w-full focus:bg-white border border-gray-pale',
                    isRecentOpened && !searchTerm && (recentQueries.length || false)
                        ? 'border-b-0 rounded-t-2.5'
                        : 'rounded-2.5',
                )}
                type="text"
                onKeyDown={handleKeyDown}
                onFocus={() => setIsRecentOpened(true)}
                onBlur={handleSearchBlur}
            />

            {isRecentOpened && !searchTerm && (recentQueries.length || false) && (
                <div
                    onMouseEnter={() => {
                        setIsRecentHovered(true)
                    }}
                    onClick={() => setIsRecentOpened(false)}
                    onMouseLeave={() => setIsRecentHovered(false)}
                    className="py-3.5 absolute border border-gray-pale w-full border-t-0 rounded-b-2.5 bg-white z-50">
                    <div className="ml-4 text-xs text-gray-standard mb-2">{t('latter_queries')}</div>

                    {recentQueries &&
                        recentQueries.map((query) => (
                            <div
                                className="text-s px-4 font-bold truncate overflow-hidden py-1.5 hover:bg-gray-pale transition-all cursor-pointer"
                                onClick={() => handleRecentClick(query)}>
                                {query}
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}

NavbarSearch.defaultProps = {}
NavbarSearch.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
}

export default memo(NavbarSearch)
