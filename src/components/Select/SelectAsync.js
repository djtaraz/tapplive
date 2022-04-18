import React, { memo, useMemo } from 'react'
import ReactSelect from 'react-select/async'

const SelectAsync = ({ Option, getOptionStyles, components = {}, isDisabled, ...props } = {}) => {
    const overrideComponents = {
        IndicatorSeparator: () => null,
        DropdownIndicator: () => null,
        ...components,
    }

    const selectStyles = useMemo(
        () => ({
            control: (styles, { isFocused }) => ({
                ...styles,
                backgroundColor: isFocused ? '#fff' : '#F6F6FC',
                padding: '5px 0px 5px 0px',
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
            loadingIndicator: (styles) => ({
                ...styles,
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
            }),
            indicatorsContainer: (styles) => ({
                ...styles,
                position: 'absolute',
                top: '50%',
                right: '5px',
                transform: 'translateY(-50%)',
            }),
            singleValue: (styles) => ({
                ...styles,
                paddingRight: '36px',
                color: isDisabled ? '#AFAFB3' : '',
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
            /* eslint-disable-next-line react-hooks/exhaustive-deps */
        }),
        [getOptionStyles, isDisabled],
    )

    return (
        <ReactSelect
            classNamePrefix="tap-select"
            components={overrideComponents}
            styles={selectStyles}
            isDisabled={isDisabled}
            {...props}
        />
    )
}

export default memo(SelectAsync)
