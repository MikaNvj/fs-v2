import clsx from 'clsx'
import React, {useState} from 'react'
import  './Button.scss'

interface propsButton{
  text?: string,
  children?: string,
  autowait?: boolean,
  outlined?: boolean,
  className?: string,
  inactive?: boolean,
  rounded?: boolean,
  color?: string,
  lower?: boolean,
  waiting?: boolean,
  full?: boolean,
  onClick?: (e?: Event) => void,
  style?: any,
  rest?: any,
}
const Button = (props: propsButton) => {
  // const {
  //   text, children, autowait, outlined, className, inactive,
  //   rounded, color, lower, waiting, full, onClick, style, ...rest
  // } = props
  const [wait, setWait] = useState(false)

  return (
    <button onClick={async (e: MouseEvent) => {
      props.autowait && setWait(true)
      try{ props.onClick && await props.onClick(e) }
      catch(err){ console.error(err) }
      props.autowait && setWait(false)
    }}
    style={{...props.style, "--color": props.color}}
    {...props.rest}
    className={clsx(
      'Button', props.rounded && 'rounded', props.inactive && 'inactive',
      props.outlined && 'outlined', (props.waiting || wait) && 'waiting',
      props.full && 'full', props.lower && 'lower', props.className
    )}>
      {props.text}{props.children}
    </button>
  )
}

export default Button;