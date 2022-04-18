import React from 'react';
import PropTypes from 'prop-types';

import {useTranslation} from "react-i18next";
import Button from "./Button";

function ShowMore({ loading, onClick }) {
    const { t } = useTranslation()

    return (
        <div className='w-full flex justify-center'>
            <Button isLoading={loading} disabled={loading} onClick={onClick} isWide={true} type='secondary' text={t('showMore')} />
        </div>
    );
}

ShowMore.propTypes = {
    loading: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ShowMore;
