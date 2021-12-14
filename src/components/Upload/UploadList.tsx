import React, { FC } from 'react';
import { UploadFile } from './Upload';
import Icon from '../Icon/Icon';

export const defaultFileList: UploadFile[] = [
    {id: "123456", size: 100, name: 'ice.png', status: 'uploading', percent: 30},
    {id: "123666", size: 20, name: 'light.pdf', status: 'success', percent: 30},
    {id: "123888", size: 2024, name: 'sun.docx', status: 'error', percent: 30}
]

interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
}

export const UploadList: FC<UploadListProps> = (props) => {
    const { fileList, onRemove } = props;
    return (
        <ul className="upload-list">
            {fileList.map(item => {
                return (
                    <li className="upload-list-item" key={item.id}>
                        <div className="container">
                            <span className={`file-name file-name-${item.status}`}>
                                <Icon name="file-alt" size="mini" color="teal" />
                                {item.name}
                            </span>
                            <span className="file-status">
                                {(item.status === 'uploading' || item.status === 'ready') 
                                && <Icon name="spinner" size="mini" color="blue" loading />
                                }
                                {(item.status === 'success') 
                                && <Icon name="check" size="mini" color="teal" />
                                }
                                {(item.status === 'error') 
                                && <Icon name="times" size="mini" color="red" />
                                }
                            </span>
                        </div>
                        <div className="delete-icon">
                            <span onClick={() => { onRemove(item) }} className="file-delete">
                                <Icon name="trash" size="mini" color="black" />
                        </span>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default UploadList;

