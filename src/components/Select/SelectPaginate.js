import React, { useMemo, memo } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'

export function getMenu(event) {
    return new Promise((resolve) => {
        const { target } = event
        const selectControlElement = target.parentNode.parentNode.parentNode.parentNode

        let interval = setInterval(() => {
            if (!selectControlElement.nextSibling) {
                return
            } else {
                clearInterval(interval)
                resolve(selectControlElement.nextSibling)
            }
        }, 25)
        setTimeout(() => {
            if (interval) {
                clearInterval(interval)
                resolve(null)
            }
        }, 250)
    })
}

export function getAllOptions(menuElement) {
    if (menuElement) {
        const menuListElement = menuElement.children[0]
        const optionList = menuListElement.children

        if (optionList && optionList.length) {
            const optionListArray = Array.from(optionList)
            if (optionListArray.every((option) => option.classList.contains('tap-select__option'))) {
                return optionListArray
            } else {
                return optionListArray.map((option) => option.querySelector('.tap-select__option'))
            }
        }
    } else {
        return []
    }
}

// function getFirstOption(menuElement) {
//     const options = getAllOptions(menuElement)
//     return options[0]
// }

const SelectPaginate = ({ Option, getOptionStyles, onKeyDownObj, ...props } = {}) => {
    const components = {
        IndicatorSeparator: () => null,
        DropdownIndicator: () => null,
    }

    if (Option) {
        components.Option = Option
    }

    const selectStyles = useMemo(
        () => ({
            control: (styles, { isFocused }) => ({
                ...styles,
                backgroundColor: isFocused ? '#fff' : '#F6F6FC',
                padding: '5px 50px 5px 20px',
                borderRadius: '10px',
                border: `1px solid ${isFocused ? '#E7E6F2' : 'transparent'}`,

                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: 'none',
                outline: null,
                height: '48px',

                '&:hover': {
                    borderColor: isFocused ? '#E7E6F2' : 'transparent',
                },
            }),
            menu: (styles) => ({
                ...styles,
                marginTop: '-10px',
                backgroundColor: '#fff',
                border: '1px solid #E7E6F2',
                borderTop: 'none',
                boxShadow: 'none',
                borderRadius: '0 0 10px 10px',
            }),
            placeholder: (styles) => ({
                ...styles,
                color: '#C3C2CC',
                opacity: 1,
                fontWeight: 600,
            }),
            loadingIndicator: (styles) => ({
                ...styles,
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
            }),
            option: (styles, modificators) => ({
                ...styles,
                ...{
                    fontSize: '14px',
                    display: 'block',
                    padding: '10px 10px 10px 30px',
                    background: 'transparent',
                    color: modificators.isSelected ? '#5243C2' : '#000',
                    '&:active': {
                        background: 'transparent',
                    },
                },
                ...(getOptionStyles ? getOptionStyles(modificators) : {}),
            }),
        }),
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [],
    )

    async function handleKeyDown(event) {
        if (event.keyCode === 32) {
            if (onKeyDownObj && onKeyDownObj[32]) {
                onKeyDownObj[32](event)
            }
        } else if (event.keyCode === 13) {
            if (onKeyDownObj && onKeyDownObj[13]) {
                await onKeyDownObj[13](event)
            }
        }
    }

    return (
        <AsyncPaginate
            {...props}
            debounceTimeout={200}
            classNamePrefix="tap-select"
            components={components}
            styles={selectStyles}
            isClearable={false}
            loadingMessage={() => null}
            noOptionsMessage={() => null}
            onKeyDown={handleKeyDown}
        />
    )
}

export default memo(SelectPaginate)
