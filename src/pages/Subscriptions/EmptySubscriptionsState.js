import { useTranslation } from 'react-i18next'
import Button from 'components/Button'

import EmptyStateImage from 'assets/svg/illustrations/search-empty-state.svg'
import { routes } from 'routes'
import { useLocation } from 'wouter'

const EmptyState = ({ className }) => {
    const { t } = useTranslation()
    const [, setLocation] = useLocation()

    return (
        <div className={`text-center pt-5 ${className}`}>
            <img className="sq-140 mx-auto" src={EmptyStateImage} alt="" />
            <div className="text-s mt-3">{t('profilePage.subscriptionsEmptyMsg')}</div>
            <div className="mt-8 mb-18 flex justify-center">
                <Button text={t('startSearching')} type="primary" onClick={() => setLocation(routes.search.path)} />
            </div>
        </div>
    )
}

export default EmptyState
