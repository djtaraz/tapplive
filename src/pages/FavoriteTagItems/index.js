import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import fields from './fields'
import FeedList from 'pages/Feed/FeedList'
import { getFavoriteTags } from 'requests/stream-requests'

function FavoriteTagItems() {
    const { t } = useTranslation()

    return (
        <FeedList
            containerClassName="py-10"
            title={t('followedTags')}
            fetchFn={getFavoriteTags}
            queryKey={'followed-tags'}
            errorMsg="Failed to fetch"
            isFeedItem={true}
            extraFnProp={{ fields }}
        />
    )
}

FavoriteTagItems.defaultProps = {}
FavoriteTagItems.propTypes = {}

export default memo(FavoriteTagItems)
