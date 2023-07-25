import clsx from 'clsx';
import React from 'react';
import { createPortal } from 'react-dom';
import usePortal from './usePortals';
import './Modal.scss'
interface propsmodal{
  children?: any,
  parentSelector?: string,
  active: boolean ,
  className?: string,
  close?: () => void,
  optimize?: boolean,
  timeout?: number,
}
const Modal = (props: propsmodal) =>  {
  const tmt = React.useRef< any>(null)
  const {children, parentSelector = '#root', active, className, close, optimize = true, timeout = 300} = props
  const [show, setShow] = React.useState(active)
  React.useEffect(() => {
    if(active) {
      clearTimeout(tmt.current)
      setShow(true)
    }
    else tmt.current = setTimeout(() => setShow(false), timeout)  
  }, [active])
  const target = usePortal({
    parentSelector,
    classNames: clsx('Modal', className),
    active, close: close!
  })
  return createPortal(!show && optimize ? null : children, target)
}

export default Modal