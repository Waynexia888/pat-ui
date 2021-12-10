import React, { ChangeEvent, FC, useRef, useState } from "react";
import axios from "axios";
import Button from "../Button/Button";
import UploadList  from "./UploadList";
import Icon from '../Icon/Icon';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface UploadFile {
    id: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent?: number;
    originalFile?: File;
    response?: any;
    error?: any;
}

export interface UploadProps {
    action: string;
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
    beforeUpload?: (file: File) => boolean;
    defaultFileList?: UploadFile[];
    onRemove?: (file: UploadFile) => void;
    accept?: string;
    multiple?: boolean;
}

/** 
 * ~~~js
 * import { Upload } from 'pat-ui'
 * ~~~
 */

export const Upload: FC<UploadProps> = (props) => {
    const {
        action,
        onProgress,
        onSuccess,
        onError,
        beforeUpload,
        defaultFileList,
        onRemove,
        accept,
        multiple,
    } = props

    const [ fileList, setFileList ] = useState<UploadFile[]>(defaultFileList || [])

    const updateFileList = (uploadFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.id === uploadFile.id) {
                    return { ...file, ...updateObj }
                } else {
                    return file
                }
            })
        })
    }
    
    const fileInput = useRef<HTMLInputElement>(null)
    
    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.id !== file.id)
        })
        if (onRemove) {
            onRemove(file);
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        uploadFiles(files)
        if (fileInput.current) {
            fileInput.current.value = ""
        }
    }

    const uploadFiles = (files: FileList) => {
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            if (!beforeUpload) {
                post(file)
            } else {
                const result = beforeUpload(file)
                if (result) {
                    post(file)
                }
            }
        })
    }

    const post = (file: File) => {
        let _file: UploadFile = {
            id: Date.now() + file.name + "",
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            originalFile: file
        }
        // setFileList([_file, ...fileList])
        setFileList((prevList) => {
            return [_file, ...prevList]
        })
        const formData = new FormData()
        formData.append(file.name, file)
        axios.post(action, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                // console.log('Uploading Progress: ' + percentage);
                if (percentage < 100) {
                    // console.log(fileList)
                    updateFileList(_file, { percent: percentage, status: 'uploading' })
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(res => {
            console.log(res)
            updateFileList(_file, { status: 'success', response: res.data })
            if (onSuccess) {
                onSuccess(res.data, file)
            }
        }).catch(err => {
            console.log(err)
            updateFileList(_file, { status: 'error', error: err })
            if (onError) {
                onError(err, file)
            }
        })
    }
    // console.log(fileList)

    return (
        <div>
            <Button btnType="primary" onClick={handleClick}>
                <span className="upload-icon">
                    <Icon name="upload" size="mini" color="teal" />
                </span>
                Upload</Button>
            <input 
                className="input"
                style={{display: 'none'}}
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
            />
            <UploadList fileList={fileList} onRemove={handleRemove} />
        </div>
    )
}

export default Upload;
