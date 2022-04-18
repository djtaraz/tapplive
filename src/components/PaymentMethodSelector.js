import { useTranslation } from 'react-i18next'
import Button from './Button'

const PaymentMethodSelector = ({ onSelect, isWithdraw = true }) => {
    const { t } = useTranslation()

    return (
        <section className="px-14 flex flex-col h-full pb-12.5 w-460p">
            <h3 className="text-center text-xl mb-10">
                {isWithdraw ? t('payment.chooseWithdrawMethod') : t('payment.chooseTopupMethod')}
            </h3>
            <Button
                text={t('payment.paycash')}
                onClick={() => onSelect('paycash')}
                isFull
                isBig
                className="h-15 mb-5"
            />
            <Button
                text={t('payment.creditCard')}
                onClick={() => onSelect('creditCard')}
                isFull
                isBig
                className="h-15"
            />
        </section>
    )
}

export default PaymentMethodSelector
