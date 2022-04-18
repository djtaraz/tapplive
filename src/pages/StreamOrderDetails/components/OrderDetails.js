import React, { memo, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import HashTag from 'components/HashTag'
import { formatCost } from 'utils/numberUtils'
import Avatar from 'components/Avatar'
import NavLink from 'components/NavLink'
import FormatAmount from 'components/FormatAmount'
import Button from 'components/Button'
import { useOccurranceDate } from 'hooks/useOccurranceDate'
import { StreamOrderDetailsContext } from '../index'
import { deleteAuth, postAuth } from 'requests/axiosConfig'
import { dateFromString } from 'utils/dateUtils'

const OrderDetails = () => {
    const { streamOrder, amIAuthor } = useContext(StreamOrderDetailsContext)
    const [subscribed, setSubscribed] = useState(streamOrder.user.inMySubscriptions)
    const [subscriberCount, setSubscriberCount] = useState(streamOrder.user.subscriberCount ?? 0)
    const [isSubscribing, setIsSubscribing] = useState(false)
    const formatDate = useOccurranceDate()
    const { t } = useTranslation()

    const handleSubscribe = async () => {
        setIsSubscribing(true)
        if (!subscribed) {
            await postAuth(`/users/${streamOrder.user._id}/subscriptions`, {})
            setSubscriberCount((sc) => sc + 1)
        } else {
            await deleteAuth(`/users/${streamOrder.user._id}/subscriptions`)
            setSubscriberCount((sc) => sc - 1)
        }

        setSubscribed((sub) => !sub)
        setIsSubscribing(false)
    }

    const labelCn = 'flex-2 text-s flex items-center'
    const valueCn = 'flex-3 font-bold'

    return (
        <div className="rounded-2.5 border border-gray-light">
            <div className="relative overflow-hidden px-7.5 py-6 rounded-t-2.5">
                <div className="text-xl font-semibold">{streamOrder.name}</div>
                <div className="flex flex-wrap -ml-1 mt-3">
                    {streamOrder.tags?.map((tag) => (
                        <div key={tag._id} className="ml-1">
                            <HashTag key={tag._id} text={tag.name} />
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 -z-1">
                    <img className="w-full h-full object-cover" src={streamOrder.cover?.url} alt="" />
                </div>
            </div>
            <div className="px-7.5 py-6">
                {streamOrder.description && (
                    <div className="mb-10">
                        <div className="text-m font-bold mb-3">{t('description')}</div>
                        <div className="text-s">{streamOrder.description}</div>
                    </div>
                )}
                <div>
                    <div className="flex mt-6.5 first:mt-0">
                        <div className={labelCn}>{t('streamOrderForm.conditionsFulfillment')}:</div>
                        <div className={valueCn}>
                            {streamOrder.lockedFields?.length > 0 ? t('required') : t('notRequired')}
                        </div>
                    </div>
                    <div className="flex mt-6.5 first:mt-0">
                        <div className={labelCn}>{t('date')}:</div>
                        <div className={valueCn}>{formatDate(dateFromString(streamOrder.startDate))}</div>
                    </div>
                    <div className="flex mt-6.5 first:mt-0">
                        <div className={labelCn}>{t('price')}:</div>
                        <div className={valueCn}>${formatCost(streamOrder.price.value)}</div>
                    </div>
                    {streamOrder.location?.name && (
                        <div className="flex mt-6.5 first:mt-0">
                            <div className={labelCn}>{t('location')}:</div>
                            <div className={valueCn}>{streamOrder.location.name}</div>
                        </div>
                    )}
                    <div className="flex mt-6.5 first:mt-0">
                        <div className={labelCn}>{t('type')}:</div>
                        <div className={valueCn}>
                            {streamOrder.isPrivate
                                ? t('streamOrderDetails.privateBroadcast')
                                : t('streamOrderDetails.publicBroadcast')}
                        </div>
                    </div>
                </div>
                {!amIAuthor && (
                    <div className="flex items-center justify-between mt-10">
                        <div className="flex">
                            <Avatar
                                photoUrl={streamOrder.user.photo?.url}
                                crop="40x40"
                                to={`/user/${streamOrder.user._id}`}
                            />
                            <div className="ml-3.5">
                                <NavLink className="font-bold" to={`/user/${streamOrder.user._id}`}>
                                    {streamOrder.user.name}
                                </NavLink>
                                <div className="text-s">
                                    <span className="mr-1">{t('subscribers')}</span>
                                    <FormatAmount amount={subscriberCount} />
                                </div>
                            </div>
                        </div>
                        <Button
                            isDisabled={isSubscribing}
                            onClick={handleSubscribe}
                            text={subscribed ? t('cancel_track') : t('track')}
                            type={subscribed ? 'secondary' : 'primary'}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(OrderDetails)
