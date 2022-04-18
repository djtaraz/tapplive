import React, { memo, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import NavMenu from 'components/NavMenu'
import { StreamOrderDetailsContext } from '../index'

const OrderContentHeader = () => {
    const {
        isClosed,
        amIAuthor,
        activeMenuItem,
        setActiveMenuItem,
        menuItems
    } = useContext(StreamOrderDetailsContext)
    const { t } = useTranslation()
    
    useEffect(() => {
        if(!activeMenuItem) {
            setActiveMenuItem(menuItems[0])
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [activeMenuItem, menuItems])

    const handleMenuItemSelect = (item) => {
        setActiveMenuItem(item)
    }

    return (amIAuthor && !isClosed) ? (
        <NavMenu
            items={menuItems}
            active={activeMenuItem || menuItems[0]}
            onChange={handleMenuItemSelect}
        />
    ) : (
        <div className='text-m font-bold'>{t('streamOrderDetails.acceptedAnswers')}</div>
    )
}

export default memo(OrderContentHeader)