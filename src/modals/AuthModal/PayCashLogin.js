import React, { memo, useEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import QRCode from 'qrcode.react'
import { ReactComponent as PayCashLogo } from 'assets/svg/paycash-logo.svg'
import config from 'envConfig'
import io from 'socket.io-client'

const PayCashLogin = ({ onNext, payCashLoginData }) => {
    const { t } = useTranslation()

    const ws = useRef(null)
    useEffect(() => {
        if (payCashLoginData?.tokenId) {
            ws.current = io(config.socketUrl, {
                query: `sessionId=${payCashLoginData?.tokenId}`,
                transports: ['websocket'],
            })

            ws.current.on('user:eosAuth', (data) => {
                const { sessionId, user } = JSON.parse(data)
                ws.current.disconnect()
                onNext({ sessionId, token: payCashLoginData?.tokenId, ...user })
            })
        }

        return () => {
            if (ws.current) {
                ws.current.disconnect()
            }
        }
    }, [payCashLoginData, onNext])

    return (
        <section
            className={
                'w-full h-full pb-12.5 px-12.5 flex flex-col items-center transition-opacity duration-1000 opacity-100'
            }>
            <h3 className="text-xl font-semibold">{t('enter')}</h3>
            <p className="text-s tracking-0.01 mt-3">{t('scanQRByPhone')}</p>
            <section className="bg-gray-pale p-3.5 rounded-2.5 mt-7.5">
                <QRCode renderAs="svg" size={148} value={payCashLoginData.deepLink} />
            </section>
            <PayCashLogo className="my-5" />
            <p className="text-s tracking-0.01">
                <Trans
                    i18nKey="noAppDownload"
                    components={{
                        a: (
                            // eslint-disable-next-line jsx-a11y/anchor-has-content
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                className="text-violet-saturated hover:text-violet-dark font-bold"
                                href={`https://paycash.app/`}
                                alt="paycash website"
                            />
                        ),
                    }}
                />
            </p>
        </section>
    )
}

export default memo(PayCashLogin)
