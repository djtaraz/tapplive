import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as LogoIcon } from 'assets/svg/logo.svg'
import { useSelector } from 'react-redux'
import cn from 'classnames'

const Footer = ({ isStreamFooter = false }) => {
    const { t, i18n } = useTranslation()
    const { isFooterVisible } = useSelector((state) => state.root)

    const footerClasses = cn(
        'hidden sm:flex flex-col items-center bg-gray-pale pt-10 pb-5 text-s tracking-0.01 text-center',
        {
            'rounded-2.5 mt-10': isStreamFooter,
        },
    )
    if (!isFooterVisible && !isStreamFooter) {
        return null
    }
    return (
        <footer className={footerClasses}>
            <picture className="block py-2.5 px-3 w-10 h-10 bg-violet-saturated rounded-2 mb-5">
                <LogoIcon />
            </picture>
            <section className="flex flex-col max-w-xl">
                <span>{t('footer.serviceProvider')}</span>
                <span>{t('footer.registeredService')}</span>
                <span>
                    {t('footer.inquiriesEmail')}
                    <a
                        className="text-violet-saturated hover:text-violet-dark"
                        target="_blank"
                        rel="noreferrer"
                        href="mailto: paycashtab@gmail.com">
                        paycashtab@gmail.com
                    </a>
                </span>
                <span className="mt-5">{t('footer.notice')}</span>
            </section>

            <section className="flex items-center mt-8">
                <a
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-violet-saturated hover:text-violet-dark font-semibold"
                    href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/userAgreement.pdf`}
                    alt="user agreement">
                    {t('userAgreement')}
                </a>
                <div className="bg-black-theme rounded-full w-0.5 h-0.5 mx-5" />
                <a
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-violet-saturated hover:text-violet-dark font-semibold"
                    href={`${process.env.PUBLIC_URL}/locales/${i18n.language}/privacyPolicy.pdf`}
                    alt="privacy policy">
                    {t('privacyPolicy')}
                </a>
            </section>
        </footer>
    )
}

export default memo(Footer)
