import React, {useState, useRef} from 'react'
// import { connect } from '../../../redux/store'
import bridge from '../../../services/bridge'
import Modal from '../../portals/Modal'
import  './PrintList.scss'
import {formatDate} from '../../../services/functions/index'
import { useRecoilState } from 'recoil'
import { customerState } from '../../../recoil/atoms/customer'

function PrintList(props) {
  const [_customerrecoil,_setcustomerrecoil] = useRecoilState(customerState)
  const {
    active, selected, close,
    formation, program,
    //customer: {customers}
  } = props
  const ref = useRef(null)

  return (
    <Modal className='PrintListParent' active={active} parentSelector="#root" >
      <div className='PrintList' ref={ref}>
        <div className="to-print">
          <div className="tp-header">
            <div className='title'>Liste de présence</div>
            <div className='subtitle'>{formation.name} - {formatDate(program.date, {precise: true})}</div>
            <div className="print-button" onClick={async _ => {
              await bridge('print', {opts: {
                printBackground: true,
                color: false,
                marginsType: 1,
                margins: {
                  marginType : 'printableArea'
                }
              }})
            }}>Imprimer</div>
            <div className="close-button" onClick={close}>Fermer</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénoms</th>
                <th className='phone-th'>Téléphone</th>
                <th className='cl'/><th className='cl'/><th className='cl'/>
                <th className='cl'/><th className='cl'/><th className='cl'/>
                <th className='cl'/>
              </tr>
            </thead>
            <tbody>
              {
                selected.map((id, i) => {
                  // const customer = customers[id]
                  const customer = _customerrecoil[id]
                  return (
                    <tr key={i}>
                      <td>{customer.lastname}</td>
                      <td>{customer.firstname}</td>
                      <td>{customer.phone}</td>
                      <td/><td/><td/><td/><td/><td/><td/>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

// export default connect(PrintList, ['customer'])
export default PrintList;