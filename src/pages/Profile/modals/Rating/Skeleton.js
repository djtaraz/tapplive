export const ReviewSkeleton = () => {
    return (
        <div className="flex items-end mb-10">
            <div className="mr-2.5 w-10 h-10 bg-gray-standard rounded-full"></div>
            <div className="p-5 bg-gray-pale flex w-64 flex-col rounded-t-5 rounded-br-5 rounded-bl-2.5">
                <div className="w-48 h-2 bg-gray-standard rounded-full"></div>
                <div className="w-32 mt-1 h-2 bg-gray-standard rounded-full"></div>
                <div className="w-20 mt-1 h-2 bg-gray-standard rounded-full"></div>

                <div className="flex mt-3 items-center">
                    <div className="w-2 h-2 bg-gray-standard rounded-full"></div>
                    <span className="text-ms font-semibold ml-1.5 bg-gray-standard w-2 h-2 rounded-full"></span>

                    <span className="ml-2.5 w-10 h-2 bg-gray-standard rounded-full"></span>
                </div>
            </div>
        </div>
    )
}
export const UserDataSkeleton = () => {
    return (
        <div className="flex items-center pb-10 px-7.5">
            <div className="bg-gray-light relative w-20 h-20 rounded-5">
                <div className="absolute -bottom-1.5 -right-1.5 bg-gray-standard w-10 h-10 rounded-full"></div>
            </div>

            <div className="flex flex-col ml-6">
                <div className="w-20 h-2 bg-gray-standard rounded-full mb-2.5"></div>
                <div className="w-10 h-1 bg-gray-standard rounded-full"></div>
            </div>
        </div>
    )
}
export const TLeveItemSkeleton = () => {
    return (
        <div className="flex flex-col mb-10">
            <div className="flex items-center">
                <div className="w-5 h-5 rounded-2 bg-gray-standard"></div>

                <span className="ml-3 h-2 w-7 rounded-full bg-gray-standard"></span>

                <span className="h-2 w-5 rounded-full bg-gray-standard ml-1"></span>
            </div>

            <div className="flex mt-3 items-center">
                <div className="w-full bg-gray-pale rounded-full flex-1 h-3 overflow-hidden">
                    <div className="bg-gray-standard h-3 w-full rounded-full"></div>
                </div>

                <div className="w-20 h-2 bg-gray-standard rounded-full ml-3 justify-end"></div>
            </div>
        </div>
    )
}
