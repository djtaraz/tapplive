import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as NotEnoughMoney } from 'assets/svg/illustrations/not-enough-money.svg'
import Button from 'components/Button'
import Topup from 'modals/Topup'
import { useStep } from 'hooks/useStep'

const NotEnoughMoneyModal = ({ onClose }) => {
    const { t } = useTranslation()
    const { step, nextStep } = useStep()
    return step === 1 ? (
        <div className="w-full flex items-center flex-col  px-14">
            <NotEnoughMoney className="mt-3.5" />
            <h1 className="text-center text-xl mt-1.25 font-semibold">{t('notEnoughMoney')}</h1>

            <div className="w-full mt-100p">
                <Button onClick={nextStep} text={t('topupBalance')} fontWeight="bold" isFull />
            </div>
        </div>
    ) : (
        <Topup onClose={onClose} />
    )
}

export default memo(NotEnoughMoneyModal)
