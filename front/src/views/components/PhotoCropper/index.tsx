import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './PhotoCropper.scss'
import Modal from '../../portals/Modal'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

let lastUrl = ""

const PhotoCropper = (props: any) => {
  const { url, close, onChange } = props

  const [cropper, setCropper] = useState< any>()
  const [src, setSrc] = useState('')
  useEffect(() => {
    const nurl = url instanceof File ? URL.createObjectURL(url) : url
    setSrc(nurl)
    return ()=> URL.revokeObjectURL(nurl)
  }, [url])

  return (
    <Modal active={!!url} className='PhotoCropperParent' parentSelector='.App>.AppBody'>
      <div className={clsx('PhotoCropper')}>
        <div
          className="preview"
          onClick={_ => {
            cropper.getCroppedCanvas().toBlob((blob: any) => {
              const file = new File([blob], "image.jpg")
              const url = URL.createObjectURL(file)
              onChange({ file, url })
              close()
              lastUrl && URL.revokeObjectURL(lastUrl)
              lastUrl = url
            }, 'image/jpeg', 1)
          }}
        />
        <div className="the-cropper-parent">
          <div onClick={close} className="close-cropper"/>
          <Cropper
            className='the-cropper'
            zoomTo={.5}
            initialAspectRatio={1}
            preview=".PhotoCropper .preview"
            src={src || undefined}
            viewMode={1}
            aspectRatio={.9}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => { setCropper(instance) }}
          // guides={true}
          />
        </div>
      </div>
    </Modal>
  )
}
export default PhotoCropper