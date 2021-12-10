import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Upload } from './Upload';
import Icon from '../Icon/Icon';
import { UploadIcon } from '../Icon/Icon.stories';
import { defaultFileList } from './UploadList'

const checkFileSize = (file: File) => {
    if (Math.round(file.size / 1024) > 100) {
        alert('File size is too Large, Please upload a file below 100KB')
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
            // accept=".pdf"
            // multiple={true}
            // defaultFileList={defaultFileList}
            // beforeUpload={checkFileSize}
        >
        </Upload>
    )
}

const UploadWithLists = () => {
    return (
        <Upload 
            action="https://jsonplaceholder.typicode.com/posts" 
            onProgress={action('progress')}
            onSuccess={action('successful uploaded')}
            onError={action('error message')}
            defaultFileList={defaultFileList}
        >
        </Upload>
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

const RestrictFileTypes = () => {
    return (
        <Upload 
            action="https://jsonplaceholder.typicode.com/posts" 
            onProgress={action('progress')}
            onSuccess={action('successful uploaded')}
            onError={action('error message')}
            defaultFileList={defaultFileList}
            accept=".jpg, .jpeg, .png, .doc, .docx"
        >
        </Upload>
    )
}

const UploadMultipleFiles = () => {
    return (
        <Upload 
            action="https://jsonplaceholder.typicode.com/posts" 
            onProgress={action('progress')}
            onSuccess={action('successful uploaded')}
            onError={action('error message')}
            defaultFileList={defaultFileList}
            multiple={true}
        >
        </Upload>
    )
}

storiesOf('Upload', module)
    .add('Default Upload', SimpleUpload)
    .add('Check Upload Size', CheckUploadSize,
    {info: {text: 'Please upload a file that less than 100KB.'}})
    .add('Upload with Lists', UploadWithLists)
    .add('Restrict File Type', RestrictFileTypes, 
    {info: {text: 'Allows you to define which file types are available to upload. Here we have jpg, jpeg, doc and docx available to be selected.'}})
    .add('Upload Multiple Files', UploadMultipleFiles,
    {info: {text: 'Allows you to select multiple files at once.'}})