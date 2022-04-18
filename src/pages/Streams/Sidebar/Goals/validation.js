import { number, object } from 'yup'

export const validationSchema = object().shape({
    amount: number().positive().required()
})