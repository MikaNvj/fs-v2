import React, { useEffect, useState } from "react";
import clsx from "clsx";
import './modele.scss';

const parameter = require('./parameter.json')

const zoomIt = (type) => {
  let element = document.querySelector("#name")
  let fontSize = parseFloat(window.getComputedStyle(element, null).getPropertyValue("font-size"))

  if (type === "plus") {
    element.style.fontSize = (fontSize + 3) + "px";
  } else {
    element.style.fontSize = (fontSize - 3) + "px";
  }

}



const Modele = (props) => {
  const [loaded, setLoaded] = useState(false)
  const [newModele, setNewModele] = useState(false)



  const addNewLogo = (event) => {
    event.preventDefault()
    const divLeft = document.getElementById("left")

    if (divLeft.children.length < 3) {
      const newLogo = document.createElement("div")

      newLogo.classList.add("logo")
      newLogo.setAttribute("draggable", "true")
      newLogo.setAttribute("id", divLeft.children.length + 1)
      newLogo.addEventListener('dragstart', onDragStart)
      newLogo.addEventListener('dragover', onDragOver)
      newLogo.addEventListener('onDrop', onDrop)
      divLeft.appendChild(newLogo)
    } else {
      alert("Efa feno ny place")
    }

  }




  const saveModele = (event) => {
    // LocalData.qq = 2
    const divImage = document.getElementById("left")
    const positionImage = divImage.getBoundingClientRect()
    // localStorage.setItem(divImage.id + '-X', positionImage.left)
    // localStorage.setItem(divImage.id + '-Y', positionImage.top)
    
    
  }

  const onDragStart = (event) => {
    event.dataTransfer.effecAllowed = "move"
    event.dataTransfer.setData('Text', "" + event.currentTarget.innerHTML + "," + event.currentTarget.id)
  }

  const onDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const onDrop = (event) => {
    const [elementSrc, idElementSrc] = event.dataTransfer.getData("Text").split(',')
    const nodeA = document.getElementById(idElementSrc)
    const nodeB = event.currentTarget
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    // Move `nodeA` to before the `nodeB`
    nodeB.parentNode.insertBefore(nodeA, nodeB);

    // Move `nodeB` to before the sibling of `nodeA`
    parentA.insertBefore(nodeB, siblingA);

    // document.getElementById(elementSrcId).innerHTML = elementSrc
    // event.currentTarget.innerHTML = event.dataTransfer.getData("text/html")
  }

  return (
    <div>
      <button onClick={(event) => addNewLogo(event)}>Add new Logo</button>
      <button onClick={(event) => saveModele(event)}>Save modele</button>
      <div class={clsx(props.open ? "certificat" : "hidden")} id={props.open ? props.id : ""}>
        <div class="header">
          <div class="left" id="left">
            <div class="logo"
              id="1"
              draggable="true"
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              A
            </div>
            <div class="logo"
              id="2"
              draggable="true"
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            >
              B
            </div>
          </div>
          <div class="center">
            <p>Centre de formation et developpement informatique</p>
          </div>
          <div class="right">
            <p>logo</p>
          </div>
        </div>

        {/* <!-- Ici c'est la contenue --> */}
        <div class="content">
          <div class="left">
            <p>Le présent document atteste que</p>
            <h3 id="name" ontouchstart="ts(event)" ontouchmove="tm(event)"
            ><b> TOLONJANAHARY Nandrasanaela Daniel Aimé</b>
              <span class="zoom-plus" onClick={_ => zoomIt('plus')}>+</span>
              <span class="zoom-moins" onClick={_ => zoomIt('moins')}>-</span>
            </h3>
            <p id="date"><b>Née le </b> 02 Septembre 1998 A Manambondro Vangaindrano </p>
            <p>a terminé avec succesb</p>
            <p id="formation">la formation en <b id="formation-content">Data science</b></p>
          </div>
          <div class="right">

          </div>
        </div>
      </div>
    </div>
  )
}
export default Modele