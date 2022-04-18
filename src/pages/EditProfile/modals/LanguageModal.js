import React, { memo, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Button from 'components/Button'
import Select from 'components/Select'
import { SUPPORTED_LANGUAGES } from 'i18n'

const LanguageModal = ({ onClose }) => {
    const { t, i18n } = useTranslation()
    const [selected, select] = useState()

    useEffect(() => {
        select({
            value: i18n.language,
            label: t(i18n.language),
        })
    }, [i18n.language, t])

    const nextStepInputRef = useRef(null)

    const [render, setRender] = useState(false)
    useEffect(() => setRender(true), [])

    const selectOption = (option) => {
        select(option)
    }
    const onSubmit = () => {
        i18n.changeLanguage(selected.value)
        onClose()
    }
    return (
        <div
            className={cn(
                'w-full h-full px-12 pb-12.5 flex flex-col transition-opacity duration-1000 opacity-0',
                render && 'opacity-100',
            )}>
            <h1 className="text-xl font-semibold text-center mb-10">{t('lagnuageSelecting')}</h1>

            <div className="w-full">
                <Select
                    onChange={selectOption}
                    options={SUPPORTED_LANGUAGES.map((lang) => ({ value: lang, label: t(lang) }))}
                    isSearchable={false}
                    noIndicator={true}
                    noOptionsMessage={() => null}
                    loadingMessage={() => null}
                    isClearable={false}
                    value={selected}
                    className="w-full"
                />
            </div>

            <div className="w-full self-end mt-auto">
                <Button text={t('save')} onClick={onSubmit} ref={nextStepInputRef} fontWeight="bold" isFull isBig />
            </div>
        </div>
    )
}

export default memo(LanguageModal)
