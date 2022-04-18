import { useState } from 'react'

export const useStep = (initialStep = 1) => {
    const [step, setStep] = useState(initialStep)

    const nextStep = () => setStep(prevStep => prevStep + 1)

    const prevStep = () => setStep(prevStep => {
        if(prevStep > 1) {
            return prevStep - 1
        }

        return prevStep
    })

    return {
        step,
        nextStep,
        prevStep
    }
}