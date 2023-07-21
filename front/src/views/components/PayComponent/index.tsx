import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import './PayComponent.scss'

const PayComponent = (ref: any, handler: (e: Event) => void) => {

  useEffect(
    () => {
      const listener = (event: Event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    [ref, handler]
  );

}
export default PayComponent