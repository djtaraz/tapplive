import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { get, putAuth } from 'requests/axiosConfig'
import { tagsList } from './fields'
import useDebounce from 'hooks/useDebounce'

import { ReactComponent as SearchIcon } from 'assets/svg/search.svg'
import { ReactComponent as BlockTagIcon } from 'assets/svg/block-tag.svg'
import Tag from 'components/Authorization/Tag'
import Button from 'components/Button'
import Loader from 'components/Loader'
import Scrollbar from 'components/Scrollbar'

const BlockTags = ({ onNext, userData }) => {
    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    const { t } = useTranslation()

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [initialSearch, setInitialSearch] = useState(true)

    const [tags, setTags] = useState([])
    const [chosenTags, setChosenTags] = useState([])
    const [notFound, setNotFound] = useState(false)

    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    useEffect(() => {
        get(`/tags?_fields=${tagsList}&excludeIds=${userData.excludeIds}`).then((res) => {
            setTags(res.data.result.items)
            setIsSearching(false)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSearch])

    useEffect(() => {
        if (debouncedSearchTerm) {
            get(
                `/tags?_fields=${tagsList}&excludeIds=${userData.excludeIds}${
                    searchTerm !== '' ? `&q=${searchTerm}` : ''
                }`,
            ).then(({ data }) => {
                setIsSearching(false)
                setTags(data.result.items)

                if (data.result.items.length === 0) {
                    setNotFound(true)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm])

    const handleChange = (e) => {
        setIsSearching(true)
        setNotFound(false)

        setSearchTerm(e.target.value)

        if (e.target.value === '') {
            setIsSearching(false)
            setTags([])
        }
    }

    const handleSearchKeyDown = (e) => {
        if (e.keyCode === 27) {
            e.target.blur()
        }
    }

    const handleTagClick = ({ name, selected, id }) => {
        if (selected === false) {
            let filtered = chosenTags.filter((tag) => tag.name !== name)
            setChosenTags([...filtered])
        } else {
            setChosenTags([...chosenTags, { name, id }])
        }
    }

    const handleSearchFocus = (e) => {
        if (e.target.value === '') {
            setTags([])
            e.target.placeholder = t('search_placeholder')
        }
    }

    const handleSearchBlur = (e) => {
        if (e.target.value === '') {
            setSearchTerm('')
            setInitialSearch(!initialSearch)
        }
    }

    const handleNextStep = () => {
        if (chosenTags.length !== 0) {
            const blockTagIds = chosenTags.map((item) => item.id)

            putAuth(`/user/settings`, {
                blockedTagIds: blockTagIds,
            }).then(() => {
                onNext()
            })
        } else {
            onNext()
        }
    }

    return (
        <div
            className={cn(
                'w-full h-full pb-4.5 flex flex-col items-center transition-opacity duration-1000 opacity-0',
                render && 'opacity-100',
            )}>
            <h1 className="text-xl font-semibold flex items-center">
                <BlockTagIcon className={`mr-3`} />
                {t('blockTags')}
            </h1>
            <p className="text-s mt-3">{t('tagDetails.chooseNotInterestingSubjects')}</p>

            <div className="w-full px-5.5 flex justify-center">
                <div className="relative w-full mt-4" style={{ width: '400px' }}>
                    <SearchIcon className="absolute-center-y left-3.5" />
                    <input
                        className="pl-10 py-3 text-s w-full rounded-2.5 bg-gray-pale outline-none transition-all focus:bg-white border border-gray-pale"
                        placeholder={t('search_placeholder')}
                        onChange={handleChange}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onKeyDown={handleSearchKeyDown}
                        type="text"
                    />
                </div>
            </div>

            <div className="w-full">
                <div
                    className={cn(
                        'mt-3 flex items-center h-48 max-h-48 flex-col w-full overflow-y-hidden',
                        tags.length !== 0 && 'border-b border-gray-pale',
                    )}>
                    {/* Search Cases */}
                    {isSearching && (
                        <span className="w-full text-center text-s mt-16">
                            <Loader width={32} height={12} theme="violet" />
                        </span>
                    )}

                    {/* Not Found */}
                    {searchTerm !== '' && notFound && tags.length === 0 && isSearching === false && (
                        <span className="w-full text-center text-s mt-16">{t('notFoundMsg')}</span>
                    )}

                    {/* Search Tip */}
                    {!notFound && tags.length === 0 && isSearching === false && (
                        <span className="w-full text-center text-s mt-16">
                            {t('tagDetails.interestingSubjectSearchMsg')}
                        </span>
                    )}

                    <Scrollbar className="w-full" autoHeight>
                        <div className="pl-5.5 pr-5.5 pb-3">
                            {tags.length !== 0 &&
                                isSearching === false &&
                                tags.map((tag) => {
                                    return userData.excludeIds ? (
                                        userData.excludeIds.split(',').includes(tag._id) === false && (
                                            <React.Fragment key={tag._id}>
                                                <Tag
                                                    isSelected={
                                                        chosenTags.map((i) => i.name).includes(tag.name) ? true : false
                                                    }
                                                    postCount={tag.postCount}
                                                    onSelect={handleTagClick}
                                                    theme="pink-dark"
                                                    name={tag.name}
                                                    id={tag._id}
                                                />
                                            </React.Fragment>
                                        )
                                    ) : (
                                        <React.Fragment key={tag._id}>
                                            <Tag
                                                isSelected={
                                                    chosenTags.map((i) => i.name).includes(tag.name) ? true : false
                                                }
                                                postCount={tag.postCount}
                                                onSelect={handleTagClick}
                                                theme="pink-dark"
                                                name={tag.name}
                                                id={tag._id}
                                            />
                                        </React.Fragment>
                                    )
                                })}
                        </div>
                    </Scrollbar>
                </div>
            </div>

            <div className="w-full self-end mt-6 px-12.5">
                <Button
                    text={chosenTags.length === 0 ? t('skip') : t('ready')}
                    onClick={handleNextStep}
                    fontWeight="bold"
                    isFull
                    isBig
                />
            </div>
        </div>
    )
}

export default memo(BlockTags)
