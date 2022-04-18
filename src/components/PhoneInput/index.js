import { getExampleNumber } from 'libphonenumber-js'
import examples from 'libphonenumber-js/examples.mobile.json'
import { useEffect } from 'react'
import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { get } from 'requests/axiosConfig'
import CountryCode from './CountryCode'
import { phoneCodesList } from './fields'

const russiaCountryCode = 0

const PhoneInput = ({ phoneNumberInputHandler, value, inputRef }) => {
    const [currentCountry, setCurrentCountry] = useState({
        _id: '',
        code: '+7',
        country: {
            _id: '',
            iso: 'RU',
            flag: '+7',
            name: {
                en: 'Russia',
            },
        },
    })
    const [countries, setCountries] = useState([])

    const { t, i18n } = useTranslation()
    const browserLanguage = i18n.language.split('-')[0]

    const exampleNumber = getExampleNumber(currentCountry.country.iso, examples).formatNational()

    useEffect(() => {
        get(
            `/phonecodes?sort=sortNumber,country.name.${browserLanguage || 'en'}&_fields=${phoneCodesList(
                browserLanguage || 'en',
            )}`,
        ).then(({ data }) => {
            setCountries(data.result.items)
            setCurrentCountry(data.result.items[russiaCountryCode])
        })
    }, [browserLanguage])

    const countryCodeInputHandler = (country) => {
        setCurrentCountry(country)
    }

    const onChange = (event) => {
        phoneNumberInputHandler(event, currentCountry.country.iso)
    }

    return (
        <div className="flex mb-4 relative">
            {currentCountry && countries.length !== 0 && (
                <CountryCode
                    countries={countries}
                    onChange={countryCodeInputHandler}
                    labels={browserLanguage}
                    currentCountry={currentCountry}
                />
            )}
            <input
                placeholder={t('enterPhoneNumber')}
                className={`pl-4 h-12  text-base ml-0.5 rounded-r-2.5 bg-gray-pale flex-1 outline-none font-primary ${
                    value ? 'font-bold' : 'font-semibold'
                } transition-all focus:bg-white border border-gray-pale`}
                onChange={onChange}
                type="text"
                maxLength={exampleNumber.length}
                ref={inputRef}
            />
        </div>
    )
}

export default memo(PhoneInput)
