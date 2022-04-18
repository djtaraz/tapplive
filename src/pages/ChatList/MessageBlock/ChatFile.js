import React, { memo, useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { nanoid } from 'nanoid'

import { ReactComponent as PlayIcon } from 'assets/svg/play.svg'
import FileLoader from '../FileLoader'
import { sendMsg } from 'requests/message-requests'
import { alterMessage } from 'slices/chatSlice'
import { uploadFile } from 'requests/file-requests'
import { chatMsgProps } from 'common/propTypes'
import { cropImage } from 'utils/cropImage'
import { setError } from 'slices/rootSlice'

const ChatFile = ({ msg }) => {
    const dispatch = useDispatch()
    const [isUploadInProgress, setIsUploadInProgress] = useState(false)
    const [fileProgress, setFileProgress] = useState(0)
    let cancellationSource = useRef()
    const videoRef = useRef()
    const { t } = useTranslation()

    const [file] = msg.files || []

    useEffect(() => {
        if (file && (msg.isPending || msg.isRetry) && !msg.isError) {
            async function getFirstFrameBlob(videoElement) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const canvas = document.createElement('canvas')
                        canvas.width = videoElement.videoWidth
                        canvas.height = videoElement.videoHeight
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight)
                        canvas.toBlob(resolve, 'image/png', 1)
                    }, 300)
                })
            }

            async function sendFileMessage(file) {
                setIsUploadInProgress(false)
                return sendMsg(msg.chatId, {
                    body: '',
                    fileIds: [file._id],
                })
            }

            function alterPendingMessage(message) {
                const { files, ...messageRest } = message
                const [newFile] = files
                dispatch(
                    alterMessage({
                        id: msg._id,
                        message: { ...messageRest, files: [{ ...newFile, ...file }] },
                    }),
                )
            }

            async function handleVideoUpload(videoElement) {
                cancellationSource.current = axios.CancelToken.source()
                setIsUploadInProgress(true)
                const fileBlob = await (await fetch(file.objectUrl)).blob()
                const firstFrame = await getFirstFrameBlob(videoElement)

                const formData = new FormData()
                formData.append('file', fileBlob)
                formData.append('preview', firstFrame)

                const newFile = await uploadFile(
                    formData,
                    (progress) => setFileProgress(progress),
                    cancellationSource.current.token,
                )
                const newMessage = await sendFileMessage(newFile)
                alterPendingMessage(newMessage)
            }

            async function handleImageUpload() {
                cancellationSource.current = axios.CancelToken.source()
                setIsUploadInProgress(true)
                const fileBlob = await (await fetch(file.objectUrl)).blob()
                const formData = new FormData()
                formData.append('file', fileBlob)

                const newFile = await uploadFile(
                    formData,
                    (progress) => setFileProgress(progress),
                    cancellationSource.current.token,
                )
                const newMessage = await sendFileMessage(newFile)
                alterPendingMessage(newMessage)
            }

            function handleError(error) {
                if (error?.response && error?.response.status === 413) {
                    dispatch(setError({ message: t('imageUploadLimitMsg'), error, id: nanoid() }))
                } else if (
                    error &&
                    error?.response &&
                    error.response.data.error &&
                    error.response.data.error.id === 400.117
                ) {
                    dispatch(setError({ message: t('userHasBlockYou'), error, id: nanoid() }))
                }
                if (axios.isCancel(error)) {
                    dispatch(
                        alterMessage({
                            id: msg._id,
                            message: { ...msg, isCancelled: true, isRetry: false, isPending: false },
                        }),
                    )
                } else {
                    dispatch(
                        alterMessage({
                            id: msg._id,
                            message: { ...msg, isError: true, isRetry: false, isPending: false },
                        }),
                    )
                }
                setIsUploadInProgress(false)
                setFileProgress(0)
            }

            async function upload() {
                if (file.type === 'video') {
                    if (msg.isRetry) {
                        try {
                            await handleVideoUpload(videoRef.current)
                        } catch (error) {
                            handleError(error)
                        }
                    } else {
                        videoRef.current.addEventListener('loadeddata', async (event) => {
                            try {
                                await handleVideoUpload(event.target)
                            } catch (error) {
                                handleError(error)
                            }
                        })
                    }
                } else {
                    try {
                        await handleImageUpload()
                    } catch (error) {
                        handleError(error)
                    }
                }
            }

            upload()
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [msg.isPending, msg.isRetry, msg.isError, file])

    const cancelFileUpload = () => {
        cancellationSource.current.cancel()
    }

    return (
        <FileLoader
            progress={fileProgress}
            isVisible={!msg.isCancelled && !msg.isError && isUploadInProgress && fileProgress !== 100}
            onCancel={cancelFileUpload}>
            {file.type === 'image' ? (
                <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block sq-100 rounded-2.5 overflow-hidden bg-gray-pale">
                    <img
                        className="h-full w-full object-cover"
                        src={file.isBlob ? file.objectUrl : cropImage(file.url, 200)}
                        alt=""
                    />
                </a>
            ) : (
                <a
                    className="sq-100 rounded-2.5 block relative overflow-hidden bg-gray-pale"
                    href={file.url}
                    target="_blank"
                    rel="noreferrer">
                    <video
                        poster={file.preview ? cropImage(file.preview.url, 200) : ''}
                        type="video/mp4"
                        src={file.isBlob ? file.objectUrl : file.url}
                        ref={videoRef}
                        preload="none"
                        className="w-full h-full object-cover"></video>
                    {!msg.isPending && !msg.isError && !msg.isCancelled && (
                        <div className="absolute-center flex items-center justify-center w-8.5 h-8.5">
                            <div className="absolute -z-1 inset-0 opacity-50 bg-black-background rounded-full"></div>
                            <PlayIcon className="w-4 h-4" />
                        </div>
                    )}
                </a>
            )}
        </FileLoader>
    )
}

ChatFile.propTypes = {
    msg: chatMsgProps.isRequired,
}

export default memo(ChatFile)
