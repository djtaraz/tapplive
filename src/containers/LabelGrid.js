import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { FieldArray, useField } from 'formik'

import { ReactComponent as CloseIcon } from 'assets/svg/close2.svg'

const LabelGrid = ({ name, isEditable }) => {
    const [field] = useField(name)

    return (
        <FieldArray name={name}>
            {
                (arrayHelpers) => {

                    return (
                        <div className='flex flex-wrap mb-3.5 -m-2'>
                            {
                                (field.value || []).map((v, i) => {
                                    return (
                                        <div key={v.value._id || `option-${i}`}
                                             style={{
                                                 maxWidth: 'max(60px, 100% - 1rem)',
                                             }}
                                             className={`truncate relative text-s py-2 ${isEditable ? 'pl-3.5 pr-7.5' : 'px-3.5'} bg-white rounded-2.5 border border-gray-light ml-2 mt-2`}>
                                            <span>{v.value.name}</span>
                                            {
                                                isEditable && (
                                                    <div
                                                        onClick={() => arrayHelpers.remove(i)}
                                                        className='flex items-center justify-center absolute-center-y right-2 inline w-4 h-4 cursor-pointer'>
                                                        <CloseIcon />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            }
        </FieldArray>
    )
}
LabelGrid.defaultProps = {
    isEditable: false
}
LabelGrid.propTypes = {
    name: PropTypes.string.isRequired,
    isEditable: PropTypes.bool
}

export default memo(LabelGrid)