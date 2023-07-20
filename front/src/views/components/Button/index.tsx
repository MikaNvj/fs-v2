import clsx from 'clsx'
import React, {useState} from 'react'
import  './Button.scss'

const Button = (props: any) => {
  const {
    text, children, autowait, outlined, className, inactive,
    rounded, color, lower, waiting, full, onClick, style, ...rest
  } = props
  const [wait, setWait] = useState(false)

  return (
    <button onClick={async (e: any) => {
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