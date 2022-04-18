import React, { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import cn from 'classnames'

import FormatAmount from 'components/FormatAmount'

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

const Tag = ({ name, postCount, onSelect, isSelected, theme, id }) => {
    const [selected, setSelected] = useState(isSelected || false)
    const { t } = useTranslation()

    const handleSelect = () => {
        setSelected(!selected)
        onSelect({ name, selected: !selected, id })
    }

    const classes = cn(
        'pl-4 mb-2 border border-gray-light w-full rounded-2.5 flex items-center transition-all cursor-pointer',
        selected ? `bg-${theme} text-white` : 'hover:bg-gray-pale hover:border-gray-pale',
        isSafari ? 'p-4.5' : 'p-2',
    )

    return (
        <div onClick={handleSelect} className={classes}>
            <span className="flex-1 text-s">{name}</span>
            <span className="text-xs">
                <FormatAmount amount={postCount} /> {t('publication', { count: postCount })}
            </span>
        </div>
    )
}

Tag.defaultProps = {
    theme: 'violet-saturated',
}

Tag.propTypes = {
    name: PropTypes.string.isRequired,
    postCount: PropTypes.number.isRequired,
    theme: PropTypes.string,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
}

export default memo(Tag)
