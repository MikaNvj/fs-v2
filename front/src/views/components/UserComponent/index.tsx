import React, { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import './UserComponent.scss'
import Input from '../Input'
import { bulkSetter, get, toCamelCase } from '../../../services/functions'
// import { connect } from '../../../redux/store'
import Button from '../Button'
import bridge, { attach, detach } from '../../../services/bridge/index'
// import qs from 'query-string'
import QRCode from 'react-qr-code'
import axios from 'axios'
import { baseUrl, Server } from '../../../services/api'
import PhotoCropper from '../PhotoCropper'
import CustomerActivity from '../CustomerActivity'
import {toPhone} from '../../../services/functions/index'
import Modal from '../../portals/Modal'

import { customerState } from '../../../recoil/atoms/customer'
import { payementState } from '../../../recoil/atoms/payement'
import {useRecoilState} from 'recoil'
import { triggerEvent } from '../../../services/iDB/Recoil'
import { saveCustomer } from '../../../recoil/controllers'

export const Validator = Input.validator

const states = {
  sex: 'M', firstname: '', lastname: '',
  adress: '', email: '', birthdate: '', toCrop: '',
  birthplace: '', phone: '', facebook: null,
  photo: '', potentialPhotos: [], server: null
}

const getPhotoFile = async (url: any) => {
  if (url && !url.startsWith(Server.imageUrl())) {
    const response = await fetch(url)
    return {
      data: await response.blob(),
      name: url.split('/').slice(-1)[0].split('?')[0]
    }
  }
}

let UserComponent = (props: any) => {

  const [_customers, _setCustomers] = useRecoilState(customerState)
  const [payments, _setPayment] = useRecoilState(payementState)

  const {
    // saveCustomer, 
    close, edited,
    setActivity, activity
  } = props

  const State = bulkSetter(...useState({ ...states }))

  const quit = useMemo(() => async () => {
    detach('update:images')
    close()
    State.set({
      ...states,
      server: await bridge(`fileServer:stop`)
    })
  }, [close])

  const onPaste = useMemo(()=> (e: any)=> {
    if (e.clipboardData) {
      const { items } = e.clipboardData  || e.originalEvent.clipboardData
      for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") === 0) {
				  const file = items[i].getAsFile()
          State.setToCrop(file)
				}
			}
    }
  }, [])

  // Effects
  useEffect(() => {
    if(edited) document.addEventListener('paste', onPaste, false)
    else document.removeEventListener('paste', onPaste)

    if (edited && edited.id) {
      State.set({
        ...edited,
        photo: edited.photo ? `${Server.imageUrl(edited.photo)}` : null,
        facebook: JSON.parse(edited.facebook)
      })
    }
    else State.set({ id: undefined, ...states })
  }, [edited])
  useEffect(() => {
    if (get(State, 'facebook.id')) State.set({
      firstname: State.firstname || get(State, 'facebook.firstname') || '',
      lastname: State.lastname || get(State, 'facebook.lastname') || '',
    })
  }, [State.facebook])

  useEffect(()=> {
    bridge(`fileServer:${State.server ? 'stop' : 'start'}`).then(server => {
      if (server) {
        axios.get(`http://localhost:${server.port}`).then(({ data: potentialPhotos }) => {
          State.set({ server, potentialPhotos })
          attach('update:images', async (e: any, potentialPhotos: any) => {
            State.set({ potentialPhotos })
          })
        })
      }
    })
  })

  const debt = useMemo(() => {
    return !!payments.find(({ customerId, rest }) => customerId === edited.id && rest)
  }, [edited.id, payments])

  return (
    <div className={clsx('UserComponent on-center', edited && 'active')}>
      <PhotoCropper
        url={State.toCrop}
        close={()=> State.setToCrop(false)}
        onChange={({ url }: any) => {
          State.setPhoto(url)
        }}
      />
      <div className="e-content">
        <div className="e-left">
          {
            !edited.id ? <div className="e-title">
              Nouvel Utilisateur
            </div> : <div onClick={_ => {
              setActivity && setActivity(!activity)
            }} className={clsx('e-payements', debt && 'error')}>Payements</div>
          }
          <div
            className={clsx("e-avatar", State.sex)}
            style={State.photo ? { backgroundImage: `url(${State.photo})` } : {}}
            onDoubleClick={_ => State.photo && State.setToCrop(State.photo)}
          />
          <div className="potential-photos">
            {
              State.facebook && <div
                className="p-photo"
                style={{ backgroundImage: `url(${get(State, 'facebook.pdp')})` }}
                onClick={_ => State.setToCrop(get(State, 'facebook.pdp'))}
              />
            }
            {
              State.server && State.potentialPhotos.slice(0, State.facebook ? 7 : 8).map((name: any)=> {
                const url = `http://localhost:${State.server.port}/image/${name}`
                return <div
                  key={name}
                  className="p-photo"
                  onClick={_ => State.setToCrop(url)}
                  style={{ backgroundImage: `url(${url})` }}
                />
              })
            }
          </div>
          <div className="server">
            {
              State.server && <QRCode bgColor='transparent' fgColor='#497CB1' size={150} value={JSON.stringify(State.server)} />
            }
          </div>
        </div>
        <div className="e-right">
          <div onClick={quit} className="e-close" />
          <div className="right-view">
            <div className="view-top">
              <div className="sex-row">
                <div className="e-genre">
                  <svg version="1.1" viewBox="0 -5 550 290" className={State.sex}>
                    <g className='male sex' onClick={_ => State.setSex('M')} onDoubleClick={_ => State.sex === 'M' && State.setSex('F')}>
                      <path d="m442.33 82.426c22.73 0 41.214-18.486 41.214-41.213s-18.484-41.213-41.214-41.213c-22.724 0-41.213 18.486-41.213 41.213s18.489 41.213 41.213 41.213z" />
                      <path d="m540.61 213.9c0.252-0.808 0.31-1.68 0.141-2.561l-20.514-108.83c-1.648-10.184-10.305-17.567-20.583-17.567h-114.64c-10.283 0-18.936 7.391-20.552 17.431l-20.545 108.97c-0.165 0.881-0.111 1.753 0.139 2.561-0.159 0.998-0.234 1.953-0.234 2.914 0 11.522 9.375 20.897 20.903 20.897 10.073 0 18.698-7.201 20.539-17.238l12.946-80.925-0.167 258.24c0 11.528 9.37 20.893 20.897 20.893s20.902-9.375 20.902-20.893v-127.82h4.986v127.82c0 11.528 9.377 20.893 20.91 20.893 11.521 0 20.893-9.375 20.893-20.897l-0.169-258.24 12.967 81.045c1.82 9.917 10.452 17.118 20.525 17.118 11.522 0 20.897-9.375 20.897-20.897-3e-3 -0.961-0.078-1.927-0.24-2.914z" />
                    </g>
                    <g className='female sex' onClick={_ => State.setSex('F')} onDoubleClick={_ => State.sex === 'F' && State.setSex('M')}>
                      <path d="m108.35 82.426c22.727 0 41.213-18.486 41.213-41.213s-18.486-41.213-41.213-41.213c-22.728 0-41.208 18.486-41.208 41.213s18.486 41.213 41.208 41.213z" />
                      <path d="m175.44 102.17c-1.777-10.003-10.353-17.226-20.518-17.226h-93.132c-10.171 0-18.746 7.223-20.525 17.226l-31.213 108.68c-0.301 1.039-0.275 2.099 0.026 3.06-0.157 1.002-0.236 1.952-0.236 2.908 0 11.522 9.0177 11.754 9.0177 11.754s15.044-0.34408 16.771-9.8311l35.527-100.46s-2.3674 11.293-0.2061 18.263c2.0095 6.4805 8.7022 19.144 9.1039 29.393 0.33275 8.4906-5.6131 24.866-5.6131 24.866l-35.967 89.792c-2.3479 13.649-13.708 27.113-13.708 27.113l39.3-0.11428v90.195c0 11.528 9.375 20.893 20.9 20.893 11.522 0 20.898-9.375 20.898-20.893v-90.195h4.995v90.195c0 11.528 9.373 20.893 20.898 20.893s20.901-9.375 20.901-20.893v-90.195l39.191 0.57141s-11.211-21.258-14.29-29.181l-31.59-84.685s-6.1428-19.682-5.759-29.741c0.38385-10.058 7.5638-19.888 8.1286-30.344 0.2724-5.0426-2.3208-14.971-2.3208-14.971l34.061 100.89c7.541 18.997 26.44 6.5425 26.795-3.3219-6.9957-37.397-20.684-77.207-31.436-114.65z" />
                    </g>
                  </svg>
                </div>
                <div className='facebook-parent'>

                  {
                    !!get(State, 'facebook.id') && <div className="messenger" onClick={async _ => {
                      // bridge('external', {link: `https://web.facebook.com/profile.php?id=${get(State, 'facebook.id')}`})}
                      get(State, 'facebook.id')
                      bridge('fbSearch', {id: get(State, 'facebook.id')})
                    }}
                    title={`${State.facebook.firstname} ${State.facebook.lastname}`}
                    />
                  }

                  <div className="facebook" onClick={async _ => {
                    let name = ''
                    if(State.facebook) name = `${State.facebook.firstname} ${State.facebook.lastname}`.trim()
                    else name = `${State.firstname} ${State.lastname}`.trim()
                    const data = await bridge('fbSearch', {name})
                    if(data?.id) State.setFacebook({ firstname: '', lastname: data.name, pdp: data.image, id: data.id })
                  }} />
                </div>
              </div>
              <div className="top-input">
                <Input
                  value={State.lastname}
                  onChange={(val: any) => State.setLastname(val && val.toUpperCase())}
                  type="text"
                  required
                  label="Nom"
                />
              </div>
              <div className="top-input">
                <Input
                  value={State.firstname}
                  onChange={(val: any) => State.setFirstname(toCamelCase(val))}
                  type="text"
                  label="Prenoms" />
              </div>
              <div className="top-input">
                <Input
                  value={toPhone(State.phone)}
                  onChange={(val: any) => State.setPhone(toPhone(val, false))}
                  type="text"
                  label="Téléphone" />
              </div>
              <Input
                className='date-birth'
                value={State.birthdate || new Date(1996)}
                onChange={State.setBirthdate}
                type="date"
                label="Date de naissance"
              />
              <div className="top-input" >
                <Input
                  value={State.birthplace}
                  onChange={State.setBirthplace}
                  label="Lieu de naissance" />
              </div>
              <div className="top-input">
                <Input
                  value={State.adress}
                  onChange={State.setAdress}
                  required
                  label="Résidence" />
              </div>
              <div className="top-input">
                <Input
                  value={State.email}
                  onChange={State.setEmail}
                  label="Email"
                />
              </div>
            </div>
            <div className="view-bottom">
              <Button autowait rounded onClick={async () => {
                await saveCustomer({
                  ...State.get(['server', 'potentialPhotos']),
                  facebook: JSON.stringify(State.facebook),
                  photo: await getPhotoFile(State.photo)
                })
                // _setCustomers(
                //   [..._customers, {
                //     ...State.get(['server', 'potentialPhotos']),
                //    facebook: JSON.stringify(State.facebook),
                //    photo: await getPhotoFile(State.photo)
                //  }]
                // )

                // triggerEvent('aaa')


                quit()
              }} className="button-save">Sauvegarder</Button>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

// UserComponent = connect(UserComponent, ["customer", "payment"])

const Splitter = (props: any) => {
  return (
    <Modal active={!!props.edited} parentSelector='.App > .AppBody'>
      {props.activity ? <CustomerActivity {...props} incomer={props.edited}/> : <UserComponent {...props}/>}
    </Modal>
  )
}

export default Splitter
