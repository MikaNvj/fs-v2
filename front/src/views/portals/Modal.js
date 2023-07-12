import clsx from 'clsx';
import React from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortals';
import './Modal.scss'

const Modal = (props) =>  {
  const tmt = React.useRef(null)
  const {children, parentSelector = '#root', active, className, close, optimize = true, timeout = 300} = props
  const [show, setShow] = React.useState(active)
  React.useEffect(() => {
    if(active) {
      clearTimeout(tmt.current)
      setShow(true)
    }
    else tmt.current = setTimeout(_ => setShow(false), timeout)  
  }, [active])
  const target = usePortal({
    parentSelector,
    classNames: clsx('Modal', className),
    active, close
  })
  return createPortal(!show && optimize ? null : children, target)
}

export default Modal