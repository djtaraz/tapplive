import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { components } from 'react-select'
import { useSelector } from 'react-redux'

import { get } from 'requests/axiosConfig'
import Avatar from 'components/Avatar'
import AsyncSelect from 'components/Select/SelectPaginate'
import LabelGrid from './LabelGrid'

const Option = (props) => {
    const user = props.value
    return (
        <div
            className={`grid grid-cols-a-1 gap-3 items-center hover:bg-gray-light pl-7.5 ${
                props.isFocused ? 'bg-gray-light' : ''
            }`}>
            <Avatar size="xs" to={`/user/${user._id}`} photoUrl={user.photo?.url} crop="50x50" />
            <components.Option {...props} />
        </div>
    )
}

const UsersSelect = ({ name, isEditable }) => {
    const { me } = useSelector((state) => state.root)
    const { t } = useTranslation()
    const [field, , helpers] = useField(name)

    const handleChange = (selectedOptions) => {
        helpers.setValue(selectedOptions)
    }

    const loadOptions = useCallback(
        async function (search, prevOptions) {
            const { data } = await get(
                `/users?_fields=items(name,photo)&q=${search.trim()}&skip=${
                    prevOptions.length
                }&limit=${20}&excludeIds=${me?._id}`,
            )
            const options = [...prevOptions, ...data.result.items.map((item) => ({ label: item.name, value: item }))]

            return {
                options,
                hasMore: data.result.totalCount > options.length,
            }
        },
        [me],
    )

    return (
        <div>
            <LabelGrid isEditable={isEditable} name={name} />
            {isEditable && (
                <AsyncSelect
                    defaultOptions={[]}
                    value={field.value}
                    onChange={handleChange}
                    placeholder={t('chooseFromUsers')}
                    loadOptions={loadOptions}
                    Option={Option}
                    controlShouldRenderValue={null}
                    hideSelectedOptions={true}
                    isMulti={true}
                    getOptionStyles={() => ({
                        fontSize: '14px',
                        padding: '13px 30px 13px 0',
                    })}
                    openMenuOnClick={false}
                    blurInputOnSelect={false}
                />
            )}
        </div>
    )
}
UsersSelect.defaultProps = {
    isEditable: true,
}
UsersSelect.propTypes = {
    name: PropTypes.string.isRequired,
    isEditable: PropTypes.bool,
}

export default memo(UsersSelect)
