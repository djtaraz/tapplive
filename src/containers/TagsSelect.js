import React, { memo, useCallback, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { components } from 'react-select'
import { useField } from 'formik'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { getMyTags } from 'requests/tag-requests'
import FormatAmount from 'components/FormatAmount'
import AsyncSelect, { getAllOptions, getMenu } from 'components/Select/SelectPaginate'
import LabelGrid from './LabelGrid'

const Option = (props) => {
    const { t } = useTranslation()

    return (
        <div
            className={`flex items-center hover:bg-gray-light ${
                props.isFocused ? 'bg-gray-light key-tags__option--focused' : ''
            }`}>
            <div title={props.label} className="flex-1 truncate">
                <components.Option {...props} />
            </div>
            <div className="flex text-xs pr-7.5">
                <FormatAmount amount={props.value.postCount} />
                <span className="ml-1">{t('publications')}</span>
            </div>
        </div>
    )
}

const TagsSelect = ({ name, isDisabled, maxLength }) => {
    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const [field, , helpers] = useField(name)
    const [inputValue, setInputValue] = useState('')

    const handleChange = (selectedOptions) => {
        helpers.setValue(selectedOptions)
    }

    const loadOptions = useCallback(
        async (search, prevOptions) => {
            if (me) {
                const { items, totalCount } = await getMyTags({
                    q: search.trim().replace('#', ''),
                    skip: prevOptions.length,
                    limit: 20,
                    excludeIds: me?.blockedTags.map(({ _id }) => _id),
                })

                const options = [...prevOptions, ...items.map((item) => ({ label: item.name, value: item }))]

                return {
                    //filter already chosen options
                    options,
                    hasMore: totalCount > options.length,
                }
            } else {
                return {
                    options: prevOptions,
                }
            }
        },
        [me],
    )

    const handleInputChange = (value) => {
        if (maxLength && value?.length > maxLength + 1) {
            // including '#'
            return
        }

        setInputValue(value.includes('#') || value === '' ? value : `#${value}`)
    }

    const keyDownObj = useMemo(
        () => ({
            32: async (event) => {
                event.preventDefault()
                const name = event.target.value?.trim()

                if (name && name !== '#' && !(field.value || []).map(({ label }) => label).includes(name)) {
                    helpers.setValue([...(field.value || []), { label: name, value: { name } }])
                    event.target.blur()
                    event.target.focus()
                } else {
                    helpers.setValue([...(field.value || [])])
                }
            },
            13: async (event) => {
                event.preventDefault()

                const menuElement = await getMenu(event)

                if (menuElement) {
                    const options = getAllOptions(menuElement)

                    if (options.length) {
                        const focusedOption = options.find((option) =>
                            option.classList.contains('tap-select__option--is-focused'),
                        )
                        if (focusedOption) {
                            focusedOption.click()
                        }
                    }
                } else {
                    const name = event.target.value?.trim()

                    if (name && name !== '#' && !(field.value || []).map(({ label }) => label).includes(name)) {
                        helpers.setValue([...(field.value || []), { label: name, value: { name } }])
                        event.target.blur()
                        event.target.focus()
                    } else {
                        helpers.setValue([...(field.value || [])])
                    }
                }
            },
        }),
        [helpers, field.value],
    )

    return (
        <div>
            <LabelGrid isEditable={!isDisabled} name={name} />
            <AsyncSelect
                value={field.value}
                onChange={handleChange}
                placeholder={t('enterKeyTags')}
                loadOptions={loadOptions}
                Option={Option}
                controlShouldRenderValue={null}
                hideSelectedOptions={true}
                openMenuOnClick={true}
                isMulti={true}
                getOptionStyles={() => ({
                    fontSize: '14px',
                    padding: '13px 30px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                })}
                onKeyDownObj={keyDownObj}
                inputValue={inputValue}
                onInputChange={handleInputChange}
            />
        </div>
    )
}
TagsSelect.defaultProps = {
    isDisabled: false,
}
TagsSelect.propTypes = {
    name: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
}

export default memo(TagsSelect)
