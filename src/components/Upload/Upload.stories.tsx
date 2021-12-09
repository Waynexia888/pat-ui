import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Upload } from './Upload';

const checkFileSize = (file: File) => {
    if (Math.round(file.size / 1024) > 100) {
        alert('File too Large, Please upload a file less than 100KB')
        return false;
    }
    return true;
}

const SimpleUpload = () => {
    return (
        <Upload 
            action="https://jsonplaceholder.typicode.com/posts" 
            onProgress={action('progress')}
            onSuccess={action('successful uploaded')}
            onError={action('error message')}
        />
    )
}

const CheckUploadSize = () => {
    return (
        <Upload 
            action="https://jsonplaceholder.typicode.com/posts" 
            onProgress={action('progress')}
            onSuccess={action('successful uploaded')}
            onError={action('error message')}
            beforeUpload={checkFileSize}
        />
    )
}

storiesOf('Upload', module)
    .add('Default Upload', SimpleUpload)
    .add('Check Upload Size', CheckUploadSize)
