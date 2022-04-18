import React from 'react';
import {childrenProp} from "../../common/propTypes";

function Container({ children }) {
    return <div className="m-auto px-5 h-full" style={{ maxWidth: '200rem' }}>{children}</div>
}

Container.propTypes = {
    children: childrenProp.isRequired
};

export default Container;
