import { useRef, useEffect } from 'react';


function usePortal({parentSelector, active, classNames, close}: any) {
  const elemRef: any = useRef(null)
  const createElem = () => {
    if(!elemRef.current) {
      elemRef.current = document.createElement('div')
      if(close) {
        const back = document.createElement('div')
        back.classList.add("am-close")
        back.addEventListener('click', close, false)
        elemRef.current.appendChild(back)
      }
    }
    classNames = Array.isArray(classNames) ? classNames : classNames.split(' ')
    if(active) classNames.push('active')
    if(elemRef.current.classList.toString() !== classNames.join(' ')){
      elemRef.current.className = ""
      elemRef.current.classList.add(...classNames)
    }
    return elemRef.current
  }
  useEffect(() => {
    const parent = document.querySelector(parentSelector)
    createElem()
    parent.appendChild(elemRef.current);
    return function removeElement() {
      elemRef.current && elemRef.current.remove()
    }
  }, [parentSelector])

  return createElem()
}

export default usePortal;