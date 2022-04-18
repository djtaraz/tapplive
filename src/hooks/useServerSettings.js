import { useState, useLayoutEffect } from 'react'
import { useQuery } from 'react-query'

import { getAuth } from '../requests/axiosConfig'

const setToLocaleStorage = (value) =>
    localStorage.setItem(
        'serverSettings',
        JSON.stringify({
            value,
            expiryOn: new Date().getTime() + 3600000,
        }),
    )
export const refreshServerSettings = () => {
    getAuth(
        '/server-settings?_fields=delayInterval,archiveTimeout,streamMinPrice,streamMaxPrice,commission,delayTimeout,maxPauseInterval,streamOrderCloseTimeout,transferCommission',
    ).then(({ data }) => setToLocaleStorage(data.result))
}
export const useServerSettings = () => {
    const [settings, setSettings] = useState(() => {
        const itemStr = localStorage.getItem('serverSettings')
        if (!itemStr) {
            return undefined
        }
        const fromStorageValue = JSON.parse(itemStr)

        if (new Date().getTime() > fromStorageValue.expiry) {
            localStorage.removeItem('serverSettings')
            return undefined
        }
        return fromStorageValue.value
    })
    const { refetch } = useQuery(
        'server-settings',
        () =>
            getAuth(
                '/server-settings?_fields=delayInterval,archiveTimeout,streamMinPrice,streamMaxPrice,commission,delayTimeout,maxPauseInterval,streamOrderCloseTimeout,transferCommission',
            ).then(({ data }) => data.result),
        {
            onSuccess(result) {
                setToLocaleStorage(result)
                setSettings(result)
            },
            enabled: false,
            refetchOnMount: true,
        },
    )

    useLayoutEffect(() => {
        if (!settings) {
            refetch()
        }
    }, [settings, refetch])

    return settings || {}
}
