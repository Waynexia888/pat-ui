import React from 'react';
import { render, fireEvent, RenderResult, wait } from '@testing-library/react';
import Upload, { UploadProps } from './Upload';
import Button, { IButtonProps } from '../Button/Button'
import axios from 'axios';
import Icon from '../Icon/Icon';


jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>


// describe('test Upload compomemt', () => {
//     it('should render the correct primary button', () => {
//         const btnProps = {
//             onClick: jest.fn(),
//         };

//         const wrapper = render(<Button {...btnProps} >Hello</Button>)
//         const element = wrapper.getByText('Hello')
//         expect(element).toBeInTheDocument()
//         expect(element.tagName).toEqual('BUTTON')
//         // expect(element).toHaveClass('primary')
//         fireEvent.click(element)
//         expect(btnProps.onClick).toHaveBeenCalled()
//     })
// })

let wrapper: RenderResult, fileInput: HTMLInputElement, upload: HTMLElement;
const testFile = new File(['test'], 'test.jpeg', {type: 'image/jpeg'})

describe('test upload component', () => {
    const uploadProps: UploadProps = {
        action: "test.com",
        onSuccess: jest.fn(),
    }

    beforeEach(() => {
        wrapper = render(<Upload {...uploadProps}>Upload</Upload>)
        fileInput = wrapper.container.querySelector('.input') as HTMLInputElement
        upload = wrapper.queryByText('Upload') as HTMLElement
    })
    it('upload process should works well', async () => {
        const { queryByText } = wrapper
        mockedAxios.post.mockResolvedValue({'data': 'success'})
        expect(upload).toBeInTheDocument()
        expect(fileInput).not.toBeVisible()
        fireEvent.change(fileInput, { target: { files: [testFile]}})
        await wait(() => {
            expect(queryByText('test.jpeg')).toBeInTheDocument()
        })
        expect(uploadProps.onSuccess).toHaveBeenCalledWith('success', testFile)
        
    })
})
