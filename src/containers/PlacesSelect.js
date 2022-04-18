import React, { memo, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { components } from 'react-select'
import SelectAsync from 'components/Select/SelectAsync'
import { ReactComponent as LocationIcon } from 'assets/interface-icons/place-icon.svg'
import { useTranslation } from 'react-i18next'

const PlacesSelect = ({ name, isDisabled }) => {
    const { t } = useTranslation()
    const [field, , helpers] = useField(name)
    const [placesService, setPlacesService] = useState()

    useEffect(() => {
        if (window.google?.maps) {
            setPlacesService(new window.google.maps.places.AutocompleteService())
        }
    }, [])

    const handleChange = (selectedOption) => {
        helpers.setValue(selectedOption)
    }

    const handleLoadOptions = useCallback(
        (input, callback) => {
            if (placesService) {
                placesService.getQueryPredictions(
                    {
                        input,
                        fields: ['geometry.location'],
                    },
                    (predictions) => {
                        callback(
                            predictions?.map((p) => ({
                                label: p.description,
                                value: p,
                            })),
                        )
                    },
                )
            }
        },
        [placesService],
    )

    const ValueContainer = ({ children, ...props }) => (
        <div className="relative flex w-full">
            <div className="w-12 relative flex items-center justify-end">
                <LocationIcon className={`mr-2.5 ${isDisabled && 'text-button-disabledFont'}`} />
            </div>
            <components.ValueContainer {...props}>{children}</components.ValueContainer>
        </div>
    )

    return (
        <SelectAsync
            value={field.value}
            onChange={handleChange}
            defaultOptions={[]}
            noIndicator={true}
            loadOptions={handleLoadOptions}
            noOptionsMessage={() => null}
            loadingMessage={() => null}
            isClearable={true}
            components={{
                ValueContainer,
            }}
            placeholder={t('specifyStreamLocation')}
            isDisabled={isDisabled}
        />
    )
}
PlacesSelect.defaultProps = {
    isDisabled: false,
}
PlacesSelect.propTypes = {
    name: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
}

export default memo(PlacesSelect)
