import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import OkeyFace from 'assets/svg/illustrations/okey.svg'
import { formatCost } from 'utils/numberUtils'
import { useStream } from '../../../StreamContext'
import Button from 'components/Button'
import { useStep } from 'hooks/useStep'
import { useModal } from 'components/Modal'
import { postAuth } from 'requests/axiosConfig'
import Star from '../../../../../components/Star'
import { useDispatch } from 'react-redux'
import { setError } from 'slices/rootSlice'
import { toHHMMSS } from 'utils/numberUtils'
import { useQueryClient } from 'react-query'
import { dateFromString } from 'utils/dateUtils'

const starCount = 5

const StreamEndedModal = () => {
    const dispatch = useDispatch()
    const { setOnCloseAction, closeModal } = useModal()
    const messageRef = useRef()
    const { state } = useStream()
    const { stream } = state
    const { t } = useTranslation()
    const [stars, setStars] = useState(() => Array(starCount).fill(0))
    const { step, nextStep } = useStep()
    const [feedback, setFeedback] = useState()
    const queryClient = useQueryClient()

    const handleLeaveFeedback = useCallback(() => {
        const ratingNumber = stars.reduce((a, b) => a + b)
        return postAuth(`/streams/${stream._id}/reviews?_fields=user(name,photo),rating,body`, {
            rating: ratingNumber * 10,
            body: feedback,
        })
            .then(() => {
                queryClient.refetchQueries(['review', stream._id], { active: true })
            })
            .catch((error) => {
                dispatch(setError({ error }))
            })
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [stars, feedback, stream._id])

    useEffect(() => {
        if (step === 1) {
            setOnCloseAction(() => handleLeaveFeedback)
        } else {
            setOnCloseAction(undefined)
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [step, handleLeaveFeedback])

    const leaveTextFeedback = useCallback(async () => {
        await handleLeaveFeedback()
        nextStep()
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [handleLeaveFeedback])

    const handleStarClick = (startIndex) => {
        setStars(
            Array(starCount)
                .fill(0)
                .map((_, i) => (i <= startIndex ? 1 : 0)),
        )
        handleLeaveFeedback()
    }
    const handleInput = useCallback(
        (event) => {
            setFeedback(event.target.innerText)
        },
        [setFeedback],
    )
    const handleEnterPress = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                event.preventDefault()

                if (feedback) {
                    leaveTextFeedback()
                }
            }
        },
        [feedback, leaveTextFeedback],
    )
    return (
        <div className="pb-12 w-full h-full">
            {step === 1 && (
                <div className="text-center h-full flex flex-col px-13.5">
                    <h1 className="text-xl font-semibold">{t('closedStream')}</h1>
                    <div className="text-ms mt-3">{t('streamDetails.rateStream')}</div>
                    <div className="flex justify-center gap-2 mt-7.5">
                        {stars.map((v, index) => {
                            return (
                                <Star
                                    key={index}
                                    isFilled={Boolean(v)}
                                    className="cursor-pointer w-10 h-10"
                                    onClick={() => handleStarClick(index)}
                                />
                            )
                        })}
                    </div>
                    <div className="rounded-2.5 mt-10 border border-gray-light w-full py-4.5 px-7.5 flex flex-col">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-semibold">{t('earned')}</span>
                            <span className="text-lg font-bold">${formatCost(stream.totalEarned)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3.5">
                            <span className="text-base font-semibold">{t('duration')}</span>
                            <span className="text-lg font-bold">
                                {toHHMMSS(
                                    (dateFromString(stream.endDate).getTime() -
                                        dateFromString(stream.startDate).getTime()) /
                                        1000,
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <Button isFull={true} text={t('giveFeedback')} onClick={nextStep} />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col h-full items-center px-13.5">
                    <h1 className="text-xl font-semibold">{t('yourFeedback')}</h1>
                    <div className="grid grid-flow-col gap-2 mt-3">
                        {stars.map((v, index) => {
                            return <Star key={index} isFilled={Boolean(v)} className="w-6.5 h-6.5" />
                        })}
                    </div>
                    <div
                        onKeyPress={handleEnterPress}
                        onInput={handleInput}
                        ref={messageRef}
                        className="text-area overflow-auto h-160p w-full bg-gray-pale customScrollBar text-s bg-white rounded-2.5 break-word px-5 py-3.5 cursor-text mt-8"
                        contentEditable={true}
                        aria-multiline={true}
                        suppressContentEditableWarning={true}
                        data-placeholder={t('enterMessage')}
                    />

                    <div className="mt-auto w-full">
                        <Button isDisabled={!feedback} text={t('send')} isFull={true} onClick={leaveTextFeedback} />
                    </div>
                </div>
            )}
            {step === 3 && (
                <div className="flex flex-col items-center px-13.5 h-full">
                    <img src={OkeyFace} alt="" />
                    <h1 className="text-center text-xl font-semibold mt-6">
                        <Trans i18nKey="thanksForFeedback" />
                    </h1>
                    <div className="w-full mt-auto">
                        <Button text={t('continue')} isFull={true} onClick={closeModal} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(StreamEndedModal)
