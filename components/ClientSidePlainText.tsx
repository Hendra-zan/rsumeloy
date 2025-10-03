"use client";

import React, { useState, useEffect } from 'react';
import { getPlainText, truncateText } from '../lib/utils';

interface ClientSidePlainTextProps {
    html: string;
    maxLength: number;
}

const ClientSidePlainText: React.FC<ClientSidePlainTextProps> = ({ html, maxLength }) => {
    const [plainText, setPlainText] = useState('');

    useEffect(() => {
        setPlainText(truncateText(getPlainText(html), maxLength));
    }, [html, maxLength]);

    return <>{plainText}</>;
};

export default ClientSidePlainText;