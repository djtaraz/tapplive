const RatingStar = ({ percent }) => {
    return (
        <div className="rating-star_container mr-1">
            <div className="rating-star">
                <div className="rating-star_overlay"></div>
                <div className="rating-star_fill" style={{ transform: `translateX(-${100 - percent}%)` }}></div>
            </div>
        </div>
    )
}

export default RatingStar
