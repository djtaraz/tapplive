const { Fragment, memo } = require('react')

const TagsList = ({ tags }) => {
    return (
        <Fragment>
            {tags.map((tag, index) => (
                <span className="text-xs px-2 py-1 mr-1 mb-1 bg-gray-pale rounded-1 md:max-w-370p truncate" key={index}>
                    {tag.name}
                </span>
            ))}
        </Fragment>
    )
}

export default memo(TagsList)
