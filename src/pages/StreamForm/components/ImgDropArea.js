import React, { memo, useState, useRef } from 'react'
import { ReactComponent as UploadIcon } from '../../../assets/svg/upload-violet.svg'
import cn from 'classnames'
import { ReactComponent as TrashIcon } from '../../../assets/svg/trash-white.svg'
import { useField } from 'formik'
import { Trans } from 'react-i18next'

const ImgDropArea = ({ name }) => {
    const [field, , helpers] = useField(name)
    const fileInputRef = useRef()
    const [highlighted, setHighlighted] = useState(false)
    const coverCn = cn('relative flex flex-col justify-center items-center rounded-2.5 cursor-pointer h-340p', {
        'border border-dashed': !field.value,
        'border-violet-saturated': !field.value && highlighted,
        'border-gray-standard': !field.value && !highlighted,
    })

    const preventDefaults = (event) => {
        event.stopPropagation()
        event.preventDefault()
    }
    const handleDragEnter = (event) => {
        preventDefaults(event)
        if (!highlighted) {
            setHighlighted(true)
        }
    }
    const handleDragOver = (event) => {
        preventDefaults(event)
        if (!highlighted) {
            setHighlighted(true)
        }
    }
    const handleDragLeave = (event) => {
        preventDefaults(event)
        if (highlighted) {
            setHighlighted(false)
        }
    }
    const handleDrop = (event) => {
        preventDefaults(event)
        if (highlighted) {
            setHighlighted(false)
        }

        const [file] = event.dataTransfer.files
        helpers.setValue(file)
    }
    const handleInputChange = (event) => {
        const [file] = event.target.files

        if (file) {
            helpers.setValue(file)
        }
    }
    const handleImageDelete = (event) => {
        preventDefaults(event)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        helpers.setValue(undefined)
    }

    return (
        <label
            onDragEnter={!field.value ? handleDragEnter : undefined}
            onDragOver={!field.value ? handleDragOver : undefined}
            onDragLeave={!field.value ? handleDragLeave : undefined}
            onDrop={handleDrop}
            className={coverCn}
            htmlFor="stream-cover">
            <input
                onChange={handleInputChange}
                accept="image/jpeg,image/png"
                type="file"
                hidden
                id="stream-cover"
                ref={fileInputRef}
            />
            {!field.value ? (
                <div className="flex flex-col items-center pointer-events-none">
                    <UploadIcon className="mb-5.5" />
                    <p className="text-center font-bold text-m">
                        <Trans i18nKey="imageDropTip" />
                    </p>
                </div>
            ) : (
                <>
                    <img
                        src={field.value?.url ? field.value?.url : URL.createObjectURL(field.value)}
                        alt="Stream cover"
                        className="object-cover w-full h-full rounded-2.5"
                    />
                    <div
                        onClick={handleImageDelete}
                        className="cursor-pointer transition-opacity hover:opacity-100 bg-black-theme p-2.5 flex items-center z-50 absolute top-5 right-5 rounded-2.5 opacity-60 justify-center">
                        <TrashIcon />
                    </div>
                </>
            )}
        </label>
    )
}

export default memo(ImgDropArea)
