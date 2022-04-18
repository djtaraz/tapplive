import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'wouter'
import Heading from '../Heading'
import { useTranslation } from 'react-i18next'

function PageStripe({ title, watchAll, children }) {
    const { t } = useTranslation()
    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center mb-5">
                <Heading title={title} />
                {watchAll && (
                    <Link to={watchAll} className="text-s font-semibold text-violet-saturated">
                        {`${t('seeAll')} >`}
                    </Link>
                )}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    )
}

PageStripe.defaultTypes = {
    watchAll: null,
}

PageStripe.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    watchAll: PropTypes.string,
}

export default memo(PageStripe)
