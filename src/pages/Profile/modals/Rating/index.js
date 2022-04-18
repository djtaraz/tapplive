import { useTranslation } from 'react-i18next'
import NavMenu from 'components/NavMenu'
import { useState } from 'react'

import TLevelTab from './TlevelTab'
import RatingTab from './RatingTab'

const RatingModals = ({ userId, forceTLevel }) => {
    const { t } = useTranslation()

    const tabs = [
        { name: t('rating'), value: 'rating' },
        { name: t('t-level'), value: 'tlevel' },
    ]

    const [tab, setTab] = useState(tabs[forceTLevel ? 1 : 0])

    return (
        <div className="w-384p h-578p">
            <div className="items-center left-0 top-10 w-full h-0 flex justify-between absolute z-50">
                <div></div>
                <div>
                    <NavMenu onChange={(newTab) => setTab(newTab)} active={tab} items={tabs} />
                </div>
                <div></div>
            </div>
            {tab.value === 'tlevel' && <TLevelTab userId={userId} />}
            {tab.value === 'rating' && <RatingTab userId={userId} />}
        </div>
    )
}

export default RatingModals
