import { memo, useEffect, useState } from 'react'
import cn from 'classnames'
import { ReactComponent as ChevronDownIcon } from '../../assets/svg/chevron-down.svg'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import Scrollbar from 'components/Scrollbar'
import { useTranslation } from 'react-i18next'
import { useField } from 'formik'
import { get } from 'requests/axiosConfig'
import { phoneCodesList } from 'components/PhoneInput/fields'
import CountryItem from 'components/PhoneInput/CountryItem'

const CountrySelector = ({ name, placeholder }) => {
    const [field, , helpers] = useField(name)

    const [isOpened, setOpened] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const { t, i18n } = useTranslation()
    const [countries, setCountries] = useState([])
    const labels = i18n.language.split('-')[0]
    useEffect(() => {
        get(
            `/phonecodes?sort=sortNumber,country.name.${labels || 'en'}&_fields=${phoneCodesList(labels || 'en')}`,
        ).then(({ data }) => {
            setCountries(data.result.items)
        })
    }, [labels])

    const closeMenu = () => {
        setOpened(false)
        setSearchResults([])
    }
    const toggleMenu = () => {
        setOpened((prev) => !prev)
        setSearchResults([])
    }
    const handleISOChange = (iso) => {
        helpers.setValue(iso)
        closeMenu()
    }
    const handleSearch = (e) => {
        const results = countries.filter((i) =>
            i.country.name[labels].toLowerCase().includes(e.target.value.toLowerCase()),
        )
        setSearchResults(results)
    }

    const containerClasses = cn('w-full border-2', {
        'border-gray-pale rounded-2.5 absolute left-0 right-0 top-0 z-100 bg-white': isOpened,
        'border-transparent': !isOpened,
    })

    const countrySelectorClasses = cn('h-12 pl-3.5 flex items-center', {
        'bg-gray-pale rounded-2.5': !isOpened,
    })

    const chevronClasses = cn('m-4 transition-all duration-100 transform ml-auto', {
        'rotate-180': isOpened,
    })

    const poperClasses = cn(
        'transition-all  flex justify-center flex-col border-violet-pale',
        isOpened ? 'opacity-100' : 'opacity-0',
    )
    const country = countries.find((country) => country.country.iso === field.value)

    return (
        <div className="flex relative min-h-13" tabindex="0" onFocus={toggleMenu} onBlur={closeMenu}>
            <div className={containerClasses}>
                <div className={countrySelectorClasses}>
                    {!country ? (
                        <div className="font-semibold text-s text-gray-standard">{placeholder}</div>
                    ) : (
                        <div className="font-semibold w-full truncate">
                            {country?.country?.flag} {country?.country?.name?.[labels]}
                        </div>
                    )}
                    <ChevronDownIcon className={chevronClasses} />
                </div>

                {isOpened && (
                    <div className={poperClasses}>
                        <div className="px-3">
                            <div className="relative w-full">
                                <SearchIcon className="absolute-center-y left-3.5" />
                                <input
                                    onChange={handleSearch}
                                    placeholder={t('search_placeholder')}
                                    className="pl-10 h-10 text-s w-full transition-all  py-3  outline-none focus:bg-white border border-gray-pale rounded-2.5 bg-gray-pale"
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col h-140p max-h-140p overflow-hidden">
                            <Scrollbar>
                                {searchResults.length === 0 &&
                                    countries.map((country, index) => (
                                        <CountryItem
                                            isSelected={country === field.value}
                                            flag={country.country.flag}
                                            countryName={country.country.name[labels]}
                                            key={index}
                                            iso={country.country.iso}
                                            onClick={() => handleISOChange(country.country.iso)}
                                        />
                                    ))}

                                {searchResults.length !== 0 &&
                                    searchResults.map((country, index) => (
                                        <CountryItem
                                            flag={country.country.flag}
                                            countryName={country.country.name[labels]}
                                            key={index}
                                            iso={country.country.iso}
                                            onClick={() => handleISOChange(country.country.iso)}
                                        />
                                    ))}
                            </Scrollbar>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(CountrySelector)
