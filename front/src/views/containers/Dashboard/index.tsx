import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Bar } from 'react-chartjs-2';
import './Dashboard.scss'
import colors from './colors';
import { addZero, basicFormatDate, bulkSetter, get, toAmount } from '../../../services/functions/index'
import Store, { connect } from '../../../redux/store/index'

const _data = {
  labels: Array.from(new Array(31).keys()).map(val => addZero(val + 1)),
  datasets: [
    {
      type: 'bar',
      label: 'Recettes du mois',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 2,
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const Dashboard = (props: any) => {
  const {
    income: { _incomes }
  } = props
  const {
    month, setMonthIncomes, data, ...S
  } = bulkSetter(...useState({
    month: `${new Date().getFullYear()}-${addZero(new Date().getMonth() + 1)}`,
    monthIncomes: [],
    data: _data
  }))

  useEffect(() => {
    const [y, m] = month.split('-').map((n: any) => parseInt(n))
    let incs = _incomes.filter(({ date }: any) => date && date.startsWith(month))
    const total: any = {}
    incs.forEach(({ date, amount, paymentId }: any) => {
      date = parseInt(date.split('-').slice(-1)[0])
      if (!total[date]) total[date] = { total: 0 }
      const { type } = Store.getCurrentState(`payment.payments.${paymentId}`) || {}
      total[date].total += amount
      if (type) total[date][type] = (total[date][type] || 0) + amount
    }, {})
    const maxDate = new Date(y, m, 0).getDate()
    S.set({
      data: {
        labels: Array.from(new Array(maxDate).keys()).map(val => addZero(val + 1)),
        datasets: [
          {
            type: 'bar',
            label: 'Recettes du mois',
            data: Array.from(new Array(maxDate).keys()).map(date => total[date + 1] ? total[date + 1].total : 0),
            backgroundColor: colors.slice(0, maxDate).map(col => col + '50'),
            borderColor: colors.slice(0, maxDate).map(col => col + 'aa'),
            borderWidth: 2
          }
        ],
      }
    })
  }, [_incomes, month])

  return (
    <div className={clsx('Dashboard')}>
      <div className="data-view">
        <div className="view remote">
          <div className="year">{month.split('-')[0]}</div>
          <div className="month" >
            <span>{basicFormatDate.monthNames.fr[month.split('-')[1] - 1]}</span>
            <div className="allmonths">
              {
                basicFormatDate.monthNames.frc.map((m, index) => {
                  return <div className="onemonth" onClick={_ => {
                    S.setMonth(`${month.split('-')[0]}-${addZero(index + 1)}`)
                  }}>
                    {m}
                  </div>
                })
              }
            </div>
          </div>
        </div>
        <div className="view movements">
          <div className="income">{toAmount(data.datasets[0].data.reduce((t: any, o: any) => t + o, 0), '')} <span>Ar</span></div>
          <div className="outcome">{toAmount(Math.floor(data.datasets[0].data.reduce((t: any, o: any) => t + o, 0) / 900 * 7) * 100, '')}<span>Ar</span></div>
        </div>
        <div className="view customers">
          <div className="new-customer">{toAmount(Object.keys(Store.getCurrentState('customer.customers')).length, '')} <span>Clients</span></div>
          <div className="new-customer news">22 <span>Clients</span></div>
        </div>
      </div>
      <div className="incomes view">
        <Bar data={data} options={options as any} />
      </div>
    </div>
  )
}
export default connect(Dashboard, ['income'])