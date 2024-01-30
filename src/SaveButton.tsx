import React from 'react';

const SaveButton: React.FC = () => {
    const saveToFile = () => {
        const data = Object.entries(localStorage).reduce((data: {[key: string]: string}, [key, value]) => {
            data[key] = value;
            return data;
        }, {});

        const file = new Blob([JSON.stringify(data, null, 2)], {type: 'text/plain'});
        const url = URL.createObjectURL(file);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'localStorage.txt';
        link.click();
    };

    return <button onClick={saveToFile}>Save to File</button>;
};

export default SaveButton;
