import Select from 'react-select'

const ReactSelect = (props) => {
    const selectStyles = {
        dropdownIndicator: (provided, state) => ({
            ...provided,
            transition: 'all .3s',
            transform: state.selectProps.menuIsOpen && `rotate(180deg)`,
        }),
        control: (styles) => ({
            ...styles,
            padding: '15px 0px 15px 20px',
            borderRadius: '0 10px 10px 0',
            border: '1px solid #F6F6FC',

            fontSize: '14px',
            fontWeight: '400',
            boxShadow: 'none',
            outline: null,

            '&:hover': {
                borderColor: '#F6F6FC',
            },
        }),

        menu: (styles) => ({
            ...styles,
            marginTop: '-10px',
            backgroundColor: '#fff',
            border: '1px solid #F6F6FC',
            borderTop: 'none',
            boxShadow: 'none',
            borderRadius: '0 0 10px 10px',
        }),

        option: (styles, { isSelected }) => ({
            ...styles,
            fontWeight: '400',
            fontSize: '14px',
            display: 'block',
            padding: '10px 10px 10px 30px',
            background: 'none',
            color: isSelected ? '#5243C2' : '#000',

            '&:hover': {
                background: '#E7E6F2',
                cursor: 'pointer',
            },
        }),
    }

    return (
        <Select
            components={{
                IndicatorSeparator: () => null,
            }}
            isSearchable={false}
            styles={selectStyles}
            {...props}
        />
    )
}

export default ReactSelect
