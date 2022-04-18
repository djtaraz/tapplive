import React, { memo } from 'react'

import EmptyImg from 'assets/img/empty/5/5.png'
import EmptyImg2x from 'assets/img/empty/5/5@2x.png'
import { useTranslation } from 'react-i18next'

function Empty() {
    const { t } = useTranslation()
    return (
        <div className="w-full grid gap-4 justify-center" style={{ paddingTop: '120px' }}>
            <img className="justify-self-center" src={EmptyImg} srcSet={`${EmptyImg2x} 2x`} alt={''} />
            <span className="text-s ">{t('search_empty_state')}</span>
        </div>
    )
}

Empty.defaultProps = {}
Empty.propTypes = {}

export default memo(Empty)
