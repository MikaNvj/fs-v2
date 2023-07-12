import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import './UserList.scss'
import { connect } from '../../../redux/store'
import PayComponent from '../PayComponent'
import UserComponent from '../UserComponent'
import { bulkSetter, fuzzyFilter } from '../../../services/functions'
import ScrollBar from 'react-perfect-scrollbar'
import Customer from '../Customer'
import { useCallback } from 'react'
import { useEffect } from 'react'

const UserList = (props: any) => {

  const {
    selected, onSelect, openedCustomer, setOpenedCustomer,
    customer: { _customers, customers }
  } = props

  const {
    showPay, setShowPay, edited, activity, setActivity,
    search, setSearch, incomer, setIncomer,
    ...State
  } = bulkSetter(...useState({
    search: '', edited: null, activity: false,
    incomer: null, showPay: false
  }))

  const searchRef = useRef< any>(null)

  const ref = useRef();

  PayComponent(ref, () => {
    if (showPay) setShowPay(false);
  })

  const showCustomer = useCallback((customer: boolean, activity?: any) => {
    State.set({
      edited: customer, activity
    })
  },[]) 

  useEffect(() => {
    if(openedCustomer){
      showCustomer(openedCustomer, true)
      setOpenedCustomer(null)
    } 
  }, [openedCustomer]) 

  return (
    <React.Fragment>
      <UserComponent
        close={() => showCustomer(false)}
        edited={edited}
        activity={activity}
        setActivity={setActivity}
      />
      <div className={clsx('UserList')}>
        <div className="list-header">
          <div onClick={_ => State.set({
            edited: {},
            activity: false
          })} className='new-user-btn' />
          <div className="search">
            <input type="text"
              onChange={(e) => {
                clearTimeout((searchRef.current) as any)
                searchRef.current = setTimeout(()=> {
                  setSearch(e.target.value)
                }, 600)
              }}
              autoFocus
              placeholder="Rechercher..."
            />
          </div>
        </div>
        <div className="list-user">
          <ScrollBar className="users-scrollbar">
            <div className="users">
              {
                (_ => {
                  const cust = (selected ? selected.map((id: any) => customers[id]) : _customers).filter(({inactive}: any) => !inactive)
                  if (search) return fuzzyFilter(cust, search, ({ firstname, lastname }) => `${firstname} ${lastname}`).slice(0, 50)
                  else return cust.sort(({ updatedAt: a  }: any, { updatedAt: b }: any) => a < b ? 1 : -1).slice(0, 50)
                })().map((customer: any) => (
                  <Customer
                    key={customer.id}
                    onSelect={onSelect}
                    customer={customer}
                    setIncomer={(incomer: any) => {
                      State.set({
                        edited: incomer,
                        activity: true
                      })
                    }}
                    edit={()=> State.set({
                      edited: customer,
                      activity: false
                    })}
                  />
                ))
              }
            </div>
          </ScrollBar>
        </div >
      </div>
    </React.Fragment>
  )
}
// export default connect(UserList, ["customer"])
export default UserList