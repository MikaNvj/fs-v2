import { useRef, useEffect } from 'react';
interface propsuserportal{
  parentSelector: string,
  active: boolean,
  classNames: string | string[],
  close: () => void,
}

const usePortal = (Props: propsuserportal ) => {
  let {parentSelector, active, classNames, close} = Props
  const elemRef = useRef< HTMLDivElement| null>(null)
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
  useEffect(()=> {
    const parent = document.querySelector(parentSelector)
    createElem()
    parent && parent.appendChild(elemRef.current as HTMLDivElement);
    return function removeElement() {
      elemRef.current && elemRef.current.remove()
    }
  }, [parentSelector])

  return createElem()
}

export default usePortal;