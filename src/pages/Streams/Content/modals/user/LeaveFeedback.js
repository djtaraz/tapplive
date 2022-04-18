import { memo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { postAuth } from 'requests/axiosConfig'
import { useStream } from 'pages/Streams/StreamContext'
import DoneImg from 'assets/svg/illustrations/okey.svg'
import { useStep } from 'hooks/useStep'
import Star from 'components/Star'
import { useQueryClient } from 'react-query'

const LeaveFeedbackModal = ({ onClose }) => {
    const { t } = useTranslation()

    const { state } = useStream()
    const { stream } = state
    const [starsState, setStarsState] = useState([0, 0, 0, 0, 0])
    const [feedback, setFeedback] = useState('')
    const queryClient = useQueryClient()

    const { step, nextStep } = useStep()

    const handleSendFeedback = () => {
        let ratingNumber = 0
        starsState.map((i) => (ratingNumber += i))

        postAuth(`/streams/${stream._id}/reviews?_fields=user(name,photo),rating,body`, {
            rating: ratingNumber * 10,
            body: feedback,
        }).then(() => {
            queryClient.refetchQueries(['review', stream._id], { active: true })
            nextStep()
        })
    }

    const handleStarClick = (index, type) => {
        let tempArr = [...starsState]

        if (type === 'stroked') {
            setStarsState([
                ...tempArr.slice(0, index).map(() => 1),
                ...tempArr.slice(index, tempArr.length).map(() => 0),
            ])
        } else {
            setStarsState([
                ...tempArr.slice(0, index).map(() => 1),
                ...tempArr.slice(index, tempArr.length).map(() => 0),
            ])
        }
    }

    return (
        <div className="w-full h-full  pb-12 px-14.5">
            {step === 1 && (
                <div className="h-full flex justify-between items-center flex-col">
                    <div className="w-full  flex flex-col items-center">
                        <h1 className="text-center text-xl font-semibold mt-5 mb-4">{t('yourFeedback')}</h1>
                        <div className="flex gap-2 mb-8">
                            {starsState.map((v, index) => {
                                return (
                                    <Star
                                        key={index}
                                        isFilled={Boolean(v)}
                                        className="cursor-pointer"
                                        onClick={() => handleStarClick(index + 1, 'stroked')}
                                    />
                                )
                            })}
                        </div>
                        <textarea
                            maxLength={2000}
                            onChange={({ target }) => setFeedback(target.value)}
                            placeholder={t('writeYourFeedback')}
                            className="w-full customScrollBar resize-none mb-auto rounded-2.5 font-semibold text-s transition-all bg-gray-pale focus:bg-white border border-gray-light py-3.5 px-5 h-40"
                        />
                    </div>
                    <Button
                        isDisabled={!starsState[0] > 0}
                        onClick={handleSendFeedback}
                        text={t('send')}
                        fontWeight="bold"
                        isFull
                    />
                </div>
            )}
            {step === 2 && (
                <div className="h-full w-full flex items-center justify-between flex-col">
                    <div className="flex flex-col items-center">
                        <img alt="" src={DoneImg} />
                        <h1 className="text-center text-xl font-semibold mt-5 mb-4">
                            <Trans i18nKey="thanksForFeedback" />
                        </h1>
                    </div>
                    <Button onClick={onClose} text={t('continue')} fontWeight="bold" isFull />
                </div>
            )}
        </div>
    )
}

export default memo(LeaveFeedbackModal)
