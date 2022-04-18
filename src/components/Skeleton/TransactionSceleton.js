import BarSceleton from './BarSkeleton'

const TransactionSceleton = () => {
    return (
        <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-standard rounded-full overflow-hidden"></div>

            <div className="flex flex-col ml-3 flex-1">
                <BarSceleton height="15px" />

                <span className="mt-1">
                    <BarSceleton height="10px" bg="bg-gray-standard" width="130px" />
                </span>
            </div>

            <BarSceleton height="10px" bg="bg-gray-standard" width="80px" />
        </div>
    )
}

export default TransactionSceleton
