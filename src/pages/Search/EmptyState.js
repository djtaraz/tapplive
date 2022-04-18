import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SearchEmptyState } from 'assets/svg/illustrations/search-empty-state.svg'

const EmptyState = ({ tip }) => {
    const { t } = useTranslation()

    return (
        <div className="w-full flex flex-col items-center justify-center mt-32">
            <SearchEmptyState />
            <p className="mt-4 text-s">{tip ? tip : t('search_empty_state')}</p>
        </div>
    )
}

export default memo(EmptyState)
