import { memo, useState } from 'react'
import cn from 'classnames'
import { ReactComponent as ChevronDownIcon } from '../../assets/svg/chevron-down.svg'
import { ReactComponent as SearchIcon } from '../../assets/svg/search.svg'
import Scrollbar from 'components/Scrollbar'
import CountryItem from './CountryItem'
import { useTranslation } from 'react-i18next'

const CountryCode = ({ countries, currentCountry, onChange, labels }) => {
    const [isOpened, setOpened] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const { t } = useTranslation()
    const handleActiveLanguage = (country) => {
        onChange(country)
        handleIsOpen()
    }

    const handleIsOpen = () => {
        setOpened(!isOpened)
        setSearchResults([])
    }

    const handleSearch = (e) => {
        let results = countries.filter((i) =>
            i.country.name[labels].toLowerCase().includes(e.target.value.toLowerCase()),
        )
        setSearchResults(results)
    }

    const containerClasses = cn({
        'border-2 border-gray-pale rounded-2.5 min-w-350p absolute left-0 right-0 top-0 z-100 bg-white': isOpened,
    })

    const countrySelectorClasses = cn('h-12 pl-3.5 flex items-center', {
        'bg-gray-pale rounded-l-2.5': !isOpened,
    })

    const chevronClasses = cn('m-2.5 transition-all duration-100 transform', {
        'rotate-180': isOpened,
    })

    const poperClasses = cn(
        'transition-all  flex justify-center flex-col border-violet-pale',
        isOpened ? 'opacity-100' : 'opacity-0',
    )

    return (
        <div className={containerClasses}>
            <div className={countrySelectorClasses} onClick={handleIsOpen}>
                <span className="font-bold">
                    {currentCountry.country.flag} {currentCountry.code}
                </span>
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

                    <div className="mt-4 flex flex-col h-140p max-h-140p overflow-hidden text-left">
                        <Scrollbar>
                            {searchResults.length === 0 &&
                                countries.map((country, index) => (
                                    <CountryItem
                                        isSelected={country === currentCountry}
                                        flag={country.country.flag}
                                        countryCode={country.code}
                                        countryName={country.country.name[labels]}
                                        key={index}
                                        iso={country.country.iso}
                                        onClick={() => handleActiveLanguage(country)}
                                    />
                                ))}

                            {searchResults.length !== 0 &&
                                searchResults.map((country, index) => (
                                    <CountryItem
                                        flag={country.country.flag}
                                        countryCode={country.code}
                                        countryName={country.country.name[labels]}
                                        key={index}
                                        iso={country.country.iso}
                                        onClick={() => handleActiveLanguage(country)}
                                    />
                                ))}
                        </Scrollbar>
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(CountryCode)
