import React, { useMemo, memo } from 'react'
import ReactSelect from 'react-select'

const Select = ({ Option, getOptionStyles, components = {}, noIndicator = false, ...props } = {}) => {
    const overrideComponents = {
        IndicatorSeparator: () => null,
        ...components,
    }

    if (Option) {
        overrideComponents.Option = Option
    }

    if (noIndicator) {
        overrideComponents.DropdownIndicator = () => null
    }

    const selectStyles = useMemo(
        () => ({
            dropdownIndicator: (provided, state) => ({
                ...provided,
                ...(noIndicator
                    ? {}
                    : {
                          transition: 'all .3s',
                          transform: state.selectProps.menuIsOpen && `rotate(180deg)`,
                      }),
            }),
            control: (styles, modificators) => ({
                ...styles,
                backgroundColor: modificators.isFocused ? '#fff' : '#F6F6FC',
                padding: '5px 0px 5px 0px',
                borderRadius: '10px',
                border: `1px solid ${modificators.isFocused ? '#E7E6F2' : 'transparent'}`,
                height: '48px',

                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: 'none',
                outline: null,

                '&:hover': {
                    borderColor: modificators.isFocused ? '#E7E6F2' : 'transparent',
                },
                flexWrap: 'nowrap',
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
            option: (styles, modificators) => ({
                ...styles,
                ...{
                    fontSize: '14px',
                    display: 'block',
                    padding: '10px 10px 10px 30px',
                    background: modificators.isFocused ? '#E7E6F2' : 'none',
                    color: modificators.isSelected ? '#5243C2' : '#000',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',

                    '&:hover': {
                        background: '#E7E6F2',
                        cursor: 'pointer',
                    },
                },
                ...(getOptionStyles ? getOptionStyles(modificators) : {}),
            }),
            valueContainer: (styles) => ({
                ...styles,
                padding: '0px 45px 0px 0px',
            }),
            input: (styles) => ({
                ...styles,
                width: '100%',
                padding: 0,
            }),
            singleValue: (styles) => ({
                ...styles,
                paddingRight: '10px',
            }),
        }),
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
        [],
    )

    return <ReactSelect classNamePrefix="tap-select" components={overrideComponents} styles={selectStyles} {...props} />
}

export default memo(Select)
