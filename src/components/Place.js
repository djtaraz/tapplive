import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { ReactComponent as PlaceIcon } from 'assets/interface-icons/place-icon.svg'

import FormatAmount from 'components/FormatAmount'
import { Link } from 'wouter'

import { isSafari } from 'utils/browserUtils'

const Place = ({ name, postCount, id, onClick }) => {
    const { t } = useTranslation()

    const classes = cn(
        'pl-4 mb-2 border border-gray-light w-full rounded-2.5 flex items-center transition-all cursor-pointer hover:bg-gray-pale hover:border-gray-pale',
        isSafari ? 'p-4.5' : 'p-2',
    )

    return (
        <Link onClick={onClick} to={`/places/${id}`}>
            <div className={classes}>
                <PlaceIcon className="mr-4" />
                <span className="flex-1 text-s font-bold">{name}</span>
                <span className="text-xs">
                    <FormatAmount amount={postCount} /> {t('publication', { count: postCount })}
                </span>
            </div>
        </Link>
    )
}

Place.propTypes = {
    name: PropTypes.string.isRequired,
    postCount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func,
}

export default memo(Place)
