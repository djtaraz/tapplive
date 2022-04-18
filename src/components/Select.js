import Select from 'react-select'

const ReactSelect = (props) => {
    const selectStyles = {
        dropdownIndicator: (provided, state) => ({
            ...provided,
            transition: 'all .3s',
            transform: state.selectProps.menuIsOpen && `rotate(180deg)`,
        }),
        control: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? '#fff' : '#F6F6FC',
            padding: '5px 0px 5px 20px',
            borderRadius: '10px',
            border: '1px solid #E7E6F2',

            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: 'none',
            outline: null,

            '&:hover': {
                borderColor: '#E7E6F2',
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
        option: (styles, { isSelected }) => ({
            ...styles,
            fontWeight: 'bold',
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
            styles={selectStyles}
            {...props}
        />
    )
}

export default ReactSelect
