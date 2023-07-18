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
import { useRecoilState } from 'recoil'
import { customerState } from '../../../recoil/atoms/customer';

const UserList = (props) => {
  const [_customer, _setcustomer] = useRecoilState(customerState)
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
  useEffect(() => {
    console.log(_customer)
  }, [_customer]) 
  const searchRef = useRef(null)

  const ref = useRef();

  PayComponent(ref, () => {
    if (showPay) setShowPay(false);
  })

  const showCustomer = useCallback((customer, activity) => {
    State.set({
      edited: customer, activity
    })
  })

  useEffect(_ => {
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
                clearTimeout(searchRef.current)
                searchRef.current = setTimeout(_ => {
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
                const cust = (selected ? selected.map(id => _customer[id]) : _customer).filter(({inactive}) => !inactive)
                  if (search) return fuzzyFilter(cust, search, ({ firstname, lastname }) => `${firstname} ${lastname}`).slice(0, 50)
                  else return cust.sort(({ updatedAt: a }, { updatedAt: b }) => a < b ? 1 : -1).slice(0, 50)
                })().map(customer => (
                  <Customer
                    key={customer.id}
                    customer={customer}
                    onSelect={onSelect}
                    setIncomer={incomer => {
                      State.set({
                        edited: incomer,
                        activity: true
                      })
                    }}
                    edit={_ => State.set({
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