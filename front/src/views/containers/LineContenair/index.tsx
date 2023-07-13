import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './LineContenair.scss'
import Connexion from '../Connexion/index';

const LineContenair = () => {
  return (

    <div className={clsx('LineContenair')}>
      <div className="real-content swiper-container">
        <div className="swiper-wrapper">
          <div className="connexions swiper-slide">
            <div className="options">
              <div className="one">
                <button className="new-activity-button">Photocopie, Impression, ...</button>
                <button>Inscription, Certificat</button>
                <button>Tableau de bord</button>
              </div>
              <div className="two">
                <button className="new-connexion-button">Nouvelle connexion</button>
              </div>
            </div>

            <div className="connexions-container-parent">
              <div className="activities">
                <div tabIndex={1} className="activities-content"></div>
              </div>
              <div className="connexions-container-container swiper-container">
                <div className="swiper-wrapper">

                  <div className="connexions-container swiper-slide">
                    <Connexion />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
export default LineContenair