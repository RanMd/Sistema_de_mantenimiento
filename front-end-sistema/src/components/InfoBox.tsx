import React from 'react';

interface InfoBoxProps {
    label: string;
    value: number | null;
}

const InfoBox: React.FC<InfoBoxProps> = ({ label, value }) => {
    return (
        <div>
            <p>{label}: {value !== null ? value : 'Cargando...'}</p>
        </div>
    );
};

export default InfoBox;
