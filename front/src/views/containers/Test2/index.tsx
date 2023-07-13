import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './Test2.scss'
import Input from '../../components/Input'
import Button from '../../components/Button'
import bridge from '../../../services/bridge/index'
// import qs from 'query-string'
const Test2 = () => {

  return (
    <div className={clsx('Test2')}>
      <Input/>
      <Button onClick={async () => {
        // console.vlog(qs.parse(await bridge('fbSearch')))
      }} text='ihi'/>
    </div>
  )
}
export default Test2