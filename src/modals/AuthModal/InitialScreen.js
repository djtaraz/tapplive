import React, { memo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ReactComponent as Logo } from 'assets/svg/auth-logo.svg'
import Button from 'components/Button'
import { Trans } from 'react-i18next'

const InitialScreen = ({ onNext }) => {
    const { t, i18n } = useTranslation()
    const nextStepInputRef = useRef(null)
    const titleContent = t('initialModal.title').split('\n'),
        subtitleContent = t('initialModal.subtitle').split('\n')

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            nextStepInputRef.current.focus()
        }
    }

    return (
        <div
            className="w-full h-full flex flex-col items-center outline-none pb-13 px-7.5"
            onKeyDown={handleKeyDown}
            tabIndex={0}>
            <Logo />
            <h1 className="text-xl font-semibold mt-5 text-center">
                {titleContent.map((item, index) => (
                    <span key={index}>
                        {item} <br />
                    </span>
                ))}
            </h1>
            <p className="text-s mt-4 text-center">
                {subtitleContent.map((item, index) => (
                    <span key={index}>
                        {item} <br />
                    </span>
                ))}
            </p>

            <div className="w-full self-end mt-13">
                <Button text={t('start')} ref={nextStepInputRef} fontWeight="bold" onClick={onNext} isFull isBig />
            </div>
            <span className="text-s mt-4 text-center">
                <Trans
                    i18nKey="byClickingStartYouAgreeTheTerms"
                    components={{
                        a: (
                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-violet-saturated hover:text-violet-dark"
                                href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/userAgreement.pdf`}
                                alt="user agreement"
                            />
                        ),
                        1: (
                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-violet-saturated hover:text-violet-dark"
                                href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/privacyPolicy.pdf`}
                                alt="privacy policy"
                            />
                        ),
                    }}
                />
            </span>
        </div>
    )
}

export default memo(InitialScreen)
