import React, { memo, useState, useEffect } from 'react'
import { useField } from 'formik'

import { getCovers } from 'requests/streamOrder-requests'
import { cropImage } from '../../../utils/cropImage'

const CoverGrid = ({ name }) => {
    const [field, , helpers] = useField(name)
    const [covers, setCovers] = useState()

    useEffect(() => {
        getCovers().then(({ items }) => {
            setCovers(items)
            if (!field.value) {
                helpers.setValue(items[0]?._id)
            }
        })
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [])

    const handleCoverClick = (coverId) => () => {
        helpers.setValue(coverId)
    }

    return (
        <div className="grid grid-cols-6 gap-x-3 gap-y-3.5">
            {covers
                ? covers.map((cover) => (
                      <div
                          key={cover._id}
                          className={`relative rounded-2.5 ${field.value === cover._id ? 'shadow-primary' : ''}`}>
                          <div className="pb-3/4"></div>
                          <div
                              onClick={handleCoverClick(cover._id)}
                              className="p-0.5 absolute inset-0 cursor-pointer overflow-hidden">
                              <div className="absolute inset-0.5 bg-gray-pale rounded-2.5"></div>
                              <img
                                  src={cropImage(cover.url, 100)}
                                  className="relative w-full h-full object-cover rounded-2.5"
                                  alt=""
                              />
                          </div>
                      </div>
                  ))
                : Array(12)
                      .fill(null)
                      .map((_, i) => (
                          <div key={`cover-${i}`} className="p-0.5 rounded-2.5">
                              <div className="pb-3/4 bg-gray-pale rounded-2.5"></div>
                          </div>
                      ))}
        </div>
    )
}

export default memo(CoverGrid)
