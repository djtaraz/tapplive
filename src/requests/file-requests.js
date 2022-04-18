import { postAuth } from './axiosConfig'

export const uploadFile = async (formData, onUploadProgress, cancelToken) => {
    const handleUploadProgress = (progressEvent) => {
        const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onUploadProgress(progressPercent)
    }

    const { data } = await postAuth('/files/upload', formData, {
        onUploadProgress: onUploadProgress ? handleUploadProgress : undefined,
        cancelToken,
    })
    return data.result
}
