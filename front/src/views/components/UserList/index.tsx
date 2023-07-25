import React, { useState, useRef } from 'react'
import clsx from 'clsx'
import './UserList.scss'
import PayComponent from '../PayComponent'
import UserComponent from '../UserComponent'
import { bulkSetter, fuzzyFilter } from '../../../services/functions'
import ScrollBar from 'react-perfect-scrollbar'
import Customer from '../Customer'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { customerState, _customerState, selectedCustomer } from '../../../recoil/atoms/customer';
import { CustomerTypes, IncomeTypes } from '../../../types'

interface propsUserlist {
  selected?: any,
  onSelect?: any,
  openedCustomer?: CustomerTypes,
  setOpenedCustomer?: CustomerTypes | any,
  programm?: any
}

const UserList = (props: propsUserlist) => {

  const [customer, setcustomer] = useRecoilState(customerState)
  const [_customer, _setcustomer] = useRecoilState(_customerState)

  const {
    selected, onSelect, openedCustomer, setOpenedCustomer,
    // customer: { _customers, customers }
  } = props

  const {
    showPay, setShowPay, edited, activity, setActivity,
    search, setSearch, incomer, setIncomer,
    ...State
  } = bulkSetter(...useState({
    search: '', edited: null, activity: false,
    incomer: null, showPay: false
  }))

  const searchRef: any = useRef(null)

  const ref = useRef();

  PayComponent(ref, () => {
    if (showPay) setShowPay(false);
  })

  const showCustomer = useCallback((activity?: boolean, customer?: CustomerTypes) => {
    State.set({
      edited: customer, activity
    })
  }, [])

  useEffect(() => {
    if (openedCustomer) {
      showCustomer(true, openedCustomer)
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
                clearTimeout(searchRef.current)
                searchRef.current = setTimeout(() => {
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
                  //   const cust = (selected ? selected.map(id => customers[id]) : _customers).filter(({inactive}) => !inactive)
                  //   if (search) return fuzzyFilter(cust, search, ({ firstname, lastname }) => `${firstname} ${lastname}`).slice(0, 50)
                  //   else return cust.sort(({ updatedAt: a }, { updatedAt: b }) => a < b ? 1 : -1).slice(0, 50)
                  // })()
                  const cust = (selected ? selected.map((id: string) => _customer[id]) : customer).filter(({ inactive }: any) => !inactive)
                  if (search) return fuzzyFilter(cust, search, ({ firstname, lastname }) => `${firstname} ${lastname}`).slice(0, 50)
                  else return cust.sort(({ updatedAt: a }: any, { updatedAt: b }: any) => a < b ? 1 : -1).slice(0, 50)
                })().map((customer: CustomerTypes) => (
                  <Customer
                    key={customer.id}
                    customer={customer}
                    onSelect={onSelect}
                    setIncomer={(incomer: IncomeTypes | CustomerTypes) => {
                      State.set({
                        edited: incomer,
                        activity: true
                      })
                    }}
                    edit={() => State.set({
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