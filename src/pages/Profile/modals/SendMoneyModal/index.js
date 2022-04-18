import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postAuth } from 'requests/axiosConfig'
import { useTranslation } from 'react-i18next'
import { setMe } from 'slices/rootSlice'

import { ReactComponent as DollarIcon } from 'assets/svg/dollar.svg'
import FormikNumberInput from 'components/Formik/FormikNumberInput'
import AvailableAmount from 'components/AvailableAmount'
import FormGroup from 'components/Formik/FormGroup'
import Button from 'components/Button'
import { number, object } from 'yup'
import { Formik } from 'formik'
import Comission from 'components/Commission'
import { useServerSettings } from 'hooks/useServerSettings'
import { formatThousands } from 'utils/numberUtils'

const validationSchema = object().shape({
    amount: number().positive().required(),
})

const SendMoney = ({ userId, handleClose }) => {
    const { t } = useTranslation()
    const { me } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const { transferCommission } = useServerSettings()

    const submitTopup = ({ amount }) => {
        postAuth(`/users/${userId}/wallet`, { amount: amount * 100 }).then(() => {
            dispatch(setMe({ ...me, balances: { ...me.balances, usd: (me?.balances.usd - amount * 100).toFixed(2) } }))
            handleClose()
        })
    }

    return (
        <div className="w-full flex px-14 pb-12">
            <Formik
                validationSchema={validationSchema}
                initialValues={{}}
                onSubmit={submitTopup}
                validateOnMount={true}>
                {({ values, handleSubmit, isValid, isSubmitting }) => {
                    const isAmountExceeded = Number(values.amount) > me?.balances.usd / 100
                    const commissionValue =
                        (values.amount ? Math.ceil(Number(values.amount.replace(/,/, '.')) * 10) / 10 : 0) *
                        (transferCommission / 100 / 100)
                    const commissionFixed = formatThousands(
                        commissionValue.toFixed(Number.isInteger(commissionValue) ? 0 : 2),
                    )
                    return (
                        <form noValidate={true} className="w-full flex flex-col" onSubmit={handleSubmit}>
                            <div className="flex-1">
                                <h1 className="text-center bold text-xl mb-10 font-semibold">{t('sendMoney')}</h1>
                                <FormGroup>
                                    <FormikNumberInput placeholder={t('amount')} name="amount" icon={DollarIcon} />
                                    <div className="mt-3 flex justify-between items-center">
                                        <AvailableAmount
                                            text={t('availableForTransfer')}
                                            isAmountExceeded={isAmountExceeded}
                                            balance={me?.balances.usd}
                                        />

                                        <Comission value={commissionFixed} />
                                    </div>
                                </FormGroup>
                            </div>
                            <div>
                                <Button
                                    text={t('next')}
                                    isFull
                                    isBig
                                    isDisabled={!isValid || isAmountExceeded}
                                    isLoading={isSubmitting}
                                />
                            </div>
                        </form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default memo(SendMoney)
