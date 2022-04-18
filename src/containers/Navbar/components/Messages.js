import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {ReactComponent as MessageIcon} from "assets/interface-icons/message-icon.svg";
import NavLink from 'components/NavLink'
import StatusIndicator from 'components/StatusIndicator'

function Messages({ active }) {
    return (
        <StatusIndicator isActive={active}>
            <NavLink to='/chats' activeClasses='text-violet-saturated'>
                <MessageIcon className='stroke-current ' />
            </NavLink>
        </StatusIndicator>
    );
}

Messages.defaultProps = {
    active: false
};
Messages.propTypes = {
    active: PropTypes.bool
};

export default memo(Messages);