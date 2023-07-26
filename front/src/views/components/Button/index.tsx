import clsx from 'clsx'
import React, {useState, MouseEventHandler, MouseEvent} from 'react'
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
  onClick?: (e?: MouseEvent<HTMLButtonElement>) => void,
  style?: any,
  rest?: any,
}
const Button = (props: propsButton) => {
  const {
    text, children, autowait, outlined, className, inactive,
    rounded, color, lower, waiting, full, onClick, style, ...rest
  } = props
  const [wait, setWait] = useState(false)

  return (
    <button onClick={async (e) => {
      autowait && setWait(true)
      try{ onClick && await onClick(e) }
      catch(err){ console.error(err) }
      autowait && setWait(false)
    }}
    style={{...style, "--color": color}}
    {...rest}
    className={clsx(
      'Button', rounded && 'rounded', inactive && 'inactive',
      outlined && 'outlined', (waiting || wait) && 'waiting',
      full && 'full', lower && 'lower', className
    )}>
      {text}{children}
    </button>
  )
}

export default Button;