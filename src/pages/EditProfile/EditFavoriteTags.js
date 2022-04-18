import React, { useState, useEffect } from 'react'
import { get, getAuth, putAuth } from 'requests/axiosConfig'
import useDebounce from 'hooks/useDebounce'
import { Trans, useTranslation } from 'react-i18next'

import { tag, userTags } from './fields'

import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'

import Button from 'components/Button'
import Tag from 'components/Authorization/Tag'
import Loader from 'components/Loader'

const fetchTags = ({ excludeIds = '', includeIds = '', limit = 10, searchTerm = '' }) => {
    return get(
        `/tags?_fields=${tag}${excludeIds ? `&excludeIds=${excludeIds}` : ''}${
            includeIds ? `&includeIds=${includeIds}` : ''
        }&limit=${limit}${searchTerm !== '' ? `&q=${searchTerm}` : ''}`,
    )
}

function EditFavoriteTags() {
    const { t } = useTranslation()
    const [blockedTagIds, setBlockedTagIds] = useState('')
    const [tags, setTags] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [isChanged, setIsChanged] = useState(false)

    const [chosenTags, setChosenTags] = useState([])

    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 250)

    const fetchLimit = 10

    const initialFetch = () => {
        setIsLoading(true)
        // Get Blocked Tag Ids
        getAuth(`/me?_fields=${userTags('blockedTags')}`).then(({ data }) => {
            let blockedTagsString = data?.result?.blockedTags.map((i) => i._id).join(',')
            setBlockedTagIds(blockedTagsString)

            // Get Already favorite tags
            getAuth(`/me?_fields=${userTags('favoriteTags')}`).then(({ data }) => {
                const initialTags = data?.result?.favoriteTags.map((i) => i._id)
                setChosenTags([...initialTags, ...chosenTags])

                // Fetch other tags
                fetchTags({
                    excludeIds: blockedTagsString,
                    includeIds: initialTags.join(','),
                    limit: fetchLimit,
                }).then(({ data }) => {
                    setTags(data.result.items)
                    setIsLoading(false)
                })
            })
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => initialFetch(), [])

    useEffect(() => {
        if (debouncedSearchTerm) {
            fetchTags({ excludeIds: blockedTagIds, limit: fetchLimit, searchTerm }).then(({ data }) => {
                setTags(data.result.items)
                setIsLoading(false)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm])

    const handleTagClick = ({ selected, id }) => {
        setIsChanged(true)

        if (selected === false) {
            let filtered = chosenTags.filter((tagId) => tagId !== id)
            setChosenTags([...filtered])
        } else {
            setChosenTags([...chosenTags, id])
        }
    }

    const handleSave = () => {
        setIsChanged(false)
        putAuth(`/user/settings`, { favoriteTagIds: chosenTags })
    }

    const handleSearchInput = (e) => {
        setSearchTerm(e.target.value)
        setIsLoading(true)

        if (e.target.value === '') {
            setIsLoading(false)
            setTags([])
        }
    }

    const handleSearchFocus = (e) => {
        if (e.target.value === '') {
            setTags([])
            e.target.placeholder = t('search_placeholder')
        }
    }

    const handleSearchKeyDown = (e) => {
        if (e.keyCode === 27) {
            e.target.blur()
        }
    }

    // onBlur
    const handleSearchBlur = (e) => {
        if (e.target.value === '') {
            setSearchTerm('')
            initialFetch()
        }
    }

    return (
        <React.Fragment>
            <div className="flex w-full mb-3">
                <h2 className="text-xl font-semibold flex-1">{t('favoriteTags')}</h2>
                <div>
                    <Button
                        isDisabled={isChanged ? false : true}
                        text={t('save')}
                        onClick={handleSave}
                        fontWeight="bold"
                    />
                </div>
            </div>

            <p className="text-s mb-10">
                <Trans i18nKey="tagDetails.favoriteTagsEditMsg" />
            </p>

            <div>
                <div className="relative w-full mb-7.5">
                    <SearchIcon className="absolute-center-y left-3.5" />
                    <input
                        value={searchTerm}
                        placeholder={t('search_placeholder')}
                        onChange={handleSearchInput}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onKeyDown={handleSearchKeyDown}
                        className="pl-10 py-3 text-s w-full rounded-2.5 bg-gray-pale outline-none transition-all focus:bg-white border border-gray-pale"
                        type="text"
                    />
                </div>

                <div className="w-full">
                    {isLoading === false &&
                        tags?.map((tag) => (
                            <Tag
                                key={tag._id}
                                isSelected={chosenTags?.includes(tag._id)}
                                postCount={tag.postCount}
                                theme="violet-saturated"
                                onSelect={handleTagClick}
                                name={tag.name}
                                id={tag._id}
                            />
                        ))}

                    {isLoading && (
                        <div className="mt-32">
                            <Loader width={64} height={64} theme="violet" />
                        </div>
                    )}

                    {searchTerm === '' && tags.length === 0 && isLoading === false && (
                        <div className="mt-32">
                            <h2 className="w-full text-center text-s mt-16">
                                {t('tagDetails.interestingSubjectSearchMsg')}
                            </h2>
                        </div>
                    )}

                    {isLoading === false && tags.length === 0 && searchTerm !== '' && (
                        <div className="mt-32">
                            <h2 className="text-center">{t('notFoundMsg')}</h2>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default EditFavoriteTags
