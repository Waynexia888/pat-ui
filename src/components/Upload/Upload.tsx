import React, { ChangeEvent, FC, useRef } from "react";
import axios from "axios";
import Button from "../Button/Button";

export interface UploadProps {
    action: string;
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
    beforeUpload?: (file: File) => boolean;
}

export const Upload: FC<UploadProps> = (props) => {
    const {
        action,
        onProgress,
        onSuccess,
        onError,
        beforeUpload,
    } = props

    const fileInput = useRef<HTMLInputElement>(null)
    
    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
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
        const formData = new FormData()
        formData.append(file.name, file)
        axios.post(action, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e) => {
                let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(response => {
            console.log(response)
            if (onSuccess) {
                onSuccess(response.data, file)
            }
        }).catch(err => {
            console.log(err)
            if (onError) {
                onError(err, file)
            }
        })
    }

    return (
        <div>
            <Button btnType="primary" onClick={handleClick}>Upload File</Button>
            <input 
                className="input"
                style={{display: 'none'}}
                type="file"
                ref={fileInput}
                onChange={handleFileChange}
            />
        </div>
    )
}

export default Upload;
