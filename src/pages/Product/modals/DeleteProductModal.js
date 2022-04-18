import { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Button from 'components/Button'
import { ReactComponent as Illustration } from 'assets/svg/illustrations/question.svg'

const DeleteProductModal = ({ onSubmit, onClose }) => {
    const { t } = useTranslation()

    return (
        <div className="items-center flex flex-col">
            <Illustration />
            <h1 className="text-xl font-semibold">{t('deleteProduct')}?</h1>
            <p className="text-center text-s mt-4">
                <Trans i18nKey="deleteProductTip" />
            </p>

            <div className="w-full self-end mt-24 pb-14.5 flex justify-center">
                <Button text={t('back')} onClick={onClose} fontWeight="bold" />
                <div className="ml-5">
                    <Button text={t('delete')} onClick={onSubmit} fontWeight="bold" type="secondary" />
                </div>
            </div>
        </div>
    )
}

export default memo(DeleteProductModal)
