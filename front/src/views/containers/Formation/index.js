import React, { useState, useMemo } from "react";
import clsx from "clsx";
import "./Formation.scss";
import Editor, { Validator } from "../../components/Editor";
import  levenshtein  from 'fast-levenshtein'
import {
  bulkSetter,
  formatDate,
  fuzzyFilter,
  get,
  toAmount,
} from "../../../services/functions";
import Store, { connect } from "../../../redux/store";
import HeaderProgramm from "../../components/HeaderProgramm";
import ScrollBar from "react-perfect-scrollbar";
import ModalConfirm from "../../components/ModalConfirm";
import ModalWarning from "../../components/ModalWarning";
import UserList from "../../components/UserList";
import { FORMATION } from "../../../services/constants/index";
import PrintList from "../../components/PrintList";
import Diploma from "../../components/Diploma";
import { useRecoilState } from "recoil";
import { formationState } from "../../../recoil/atoms/formation";
import { programState } from "../../../recoil/atoms/program";
import {v4} from 'uuid'

const states = {
  edited: null,
  newProgram: false,
  showList: false,
  activeFormation: null,
  activeProgram: null,
  draggedTo: 0,
  searchFormation: "",
  modalConfirm: 0,
  modalWarning: 0,
  showDiploma: false,
  openedCustomer: null,
};

const Formation = (props) => {
  const [_formationrecoil, _setformationrecoil] =
    useRecoilState(formationState);
  const [_programrecoil, _setprogramrecoil] = useRecoilState(programState);
  const [_fomrationstate, setformationstate] = useState()
  const {
    saveFormation,
    saveProgram,
    savePayment,
    formation: { _formations, formations },
    program: { _programs },
    payment: { _payments },
  } = props;

  // States
  const {
    edited,
    setEdited,
    searchFormation,
    input: __input,
    newProgram,
    setNewProgram,
    modalConfirm,
    setModalConfirm,
    showList,
    showDiploma,
    setShowDiploma,
    modalWarning,
    setModalWarning,
    setShowList,
    openedCustomer,
    setOpenedCustomer,
    activeFormation,
    setActiveFormation,
    activeProgram,
    setActiveProgram,
  } = bulkSetter(...useState({ ...states }));

  // // Memos
  // const allPrograms = useMemo(_ => {
  //   return
  // }, [_programs])

  const allFormations = useMemo(
    (_) => {
      const allPrograms = _programs.sort((a, b) =>
        new Date(a.date) < new Date(b.date) ? 1 : -1
      );
      return _formations
        .map((formation) => {
          const programs = allPrograms.filter(
            ({ formationId: fid }) => fid === formation.id
          );
          const filter = programs.length
            ? programs[0].date
            : formation.createdAt;
          return {
            ...formation,
            programs,
            filter,
          };
        })
        .sort(({ filter: fa }, { filter: fb }) => (fa > fb ? -1 : 1));
    },
    [_formations, _programs]
  );
  // const allFormations = useMemo(_ => {
  //   const allPrograms = _programrecoil.sort((a, b) => new Date(a.date) < new Date(b.date) ? 1 : -1)
  //   return _formationrecoil.map(formation => {
  //     const programs = allPrograms.filter(({formationId: fid}) => fid === formation.id)
  //     const filter = programs.length ? programs[0].date : formation.createdAt
  //     return {
  //       ...formation,
  //       programs, filter
  //     }
  //   }).sort(({filter: fa}, {filter: fb}) => fa > fb ? -1 : 1)
  // }, [_formationrecoil, _programrecoil])

  const customers = useMemo(() => {
    if (!activeProgram) return null;
    return _payments
      .filter(
        ({ type, targetId }) =>
          type === FORMATION && targetId === activeProgram.id
      )
      .map(({ customerId }) => customerId);
  }, [get(activeProgram, "id"), _payments]);

  //search
  function tabsearch(array, recherche, properties) {
    var resultat = array.filter(function (objet) {
      var rechercheRegex = new RegExp(`.*${recherche.split('').join('.*')}.*`, 'i');
      const values = properties.map(prop => (objet[prop]));
      
      return values.some(value => rechercheRegex.test(value));
    });
  
    resultat.sort(function (a, b) {
      var aIndex = getIndexOfMatchingSubstring(a,recherche);
      var bIndex = getIndexOfMatchingSubstring(b,recherche);
      if (aIndex === -1) return 1; 
      if (bIndex === -1) return -1; 
  
      return aIndex - bIndex; 
    });

    return resultat;
  }
  function getIndexOfMatchingSubstring(objet, query){
    var value = Object.values(objet).join(" ").toLowerCase();
    var index = value.indexOf(query.toLowerCase());
  
    return index;
  }
  function onchange(event){
    const val = event.target.value;
    setformationstate(tabsearch(_formationrecoil, val, ['name']))
    // console.log(levenshtein.get(val,tabsearch(_formationrecoil, val, ['name'])))
  }

  return (
    <div className={clsx("Formation")}>
      <div className="formations-container">
        <div className="formations-container-header">
          <div
            className="add-formation-button"
            onClick={(_) => setEdited({})}
          />
          <div className="text-header">{"Formations"}</div>
        </div>
        <div className="formation-search">
          {/* <input {...__input("searchFormation")} type="text" /> */}
          <input type="text" onChange={onchange} />
        </div>
        <div className="formations">
          <ScrollBar className="formations-content">
            {_formationrecoil.map((e) => (
              <div key={e.id} className={clsx("formation", get(activeFormation, 'id') === e.id && "active")}>
              <div className={"formation-name"} onClick={_ => {
                      
              }}>
                <div onClick={_ => setEdited(e)} className="menu" />
                <div
                  className='name'
                  onClick={_ => setActiveFormation(get(activeFormation, 'id') === e.id ? null : e)}
                >{e.name}</div>
                <div
                  onClick={_ => setNewProgram({ formationId: e.id, certprice: 5000, date: new Date(), place: 0 })}
                  className="menu add"
                />
                
              </div>
              <div
                      className={clsx("programs", get(activeFormation, 'id') === e.id && "active")}
                    >
                      <ScrollBar>
                        {
                          e.id === get(activeFormation, 'id') && _programrecoil.map((program) => {
                            if(program.formationId === e.id){
                              const { date, price, detail, id } = program
                              return (
                                <div
                                  key={program.id}
                                  data-position={id}
                                  onDragOver={e => e.preventDefault()}
                                  onDrop={e => {
                                    const customer = JSON.parse(e.dataTransfer.getData("Text"))
                                    const np = {
                                      customerId: customer.id, targetId: id, type: FORMATION,
                                      userId: Store.getCurrentState('auth.user.id'),
                                      amount: program.price,
                                      rest: program.price
                                    }
                                    const op = _payments.find((({ customerId, targetId, type }) => {
                                      return customerId === customer.id && targetId === id && type === FORMATION
                                    }))
                                    setModalConfirm(
                                      op ?
                                        {
                                          title: `Déjà inscrit${customer.sex === 'F' ? 'e' : ''}  `,
                                          text: `${customer.firstname} est déjà inscrit${customer.sex === 'F' ? 'e' : ''} à la formation "${e.name}" du ${formatDate(date)}`,
                                          error: true
                                        } :
                                        {
                                          handler: _ => {
                                            savePayment(np)
                                            setActiveProgram(program)
                                            setOpenedCustomer(Store.getCurrentState('customer.customers.' + customer.id))
                                          },
                                          title: 'Inscription',
                                          text: `Inscrire ${customer.firstname} à la formation "${e.name}" du ${formatDate(date)}`
                                        }
                                    )
                                  }}
                                  className={clsx("program", activeProgram?.id === program.id && 'active')}
                                >
                                  <div
                                    className="program-edit"
                                    onClick={_ => setNewProgram(program)}
                                  />
                                  <div
                                    className='program-detail'
                                    onClick={_ => setActiveProgram({ ...program, formation: activeFormation })}
                                  >
                                    <span className="date">{formatDate(new Date(date))}</span>
                                    <div className="down-one">
                                      <span className="detail">{detail}</span>
                                      <span className="price">{toAmount(price)}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
  
                            })
                        }
                      </ScrollBar>
                    </div>
              </div>
              
              // <div
              //   className="name">
              //   {e.name}
              // </div>
            ))}
          </ScrollBar>
          {/* <ScrollBar className='formations-content'>
            {
              fuzzyFilter(allFormations, searchFormation, ({ name }) => name || '')
              .map(({id, filter, programs: myprograms}) => {
                const formation = formations[id]
                const { name } = formation
                return (
                  <div key={id} className={clsx("formation", get(activeFormation, 'id') === id && "active")}>
                    <div className={"formation-name"} onClick={_ => {
                      
                    }}>
                      <div onClick={_ => setEdited(formation)} className="menu" />
                      <div
                        className='name'
                        onClick={_ => setActiveFormation(get(activeFormation, 'id') === id ? null : formation)}
                      >{name}</div>
                      <div
                        onClick={_ => setNewProgram({ formationId: id, certprice: 5000, date: new Date(), place: 0 })}
                        className="menu add"
                      />
                      
                    </div>
                    <div
                      className={clsx("programs", get(activeFormation, 'id') === id && "active")}
                    >
                      <ScrollBar>
                        {
                          id === get(activeFormation, 'id') && myprograms.map((program) => {
                              const { date, price, detail, id } = program
                              return (
                                <div
                                  key={program.id}
                                  data-position={id}
                                  onDragOver={e => e.preventDefault()}
                                  onDrop={e => {
                                    const customer = JSON.parse(e.dataTransfer.getData("Text"))
                                    const np = {
                                      customerId: customer.id, targetId: id, type: FORMATION,
                                      userId: Store.getCurrentState('auth.user.id'),
                                      amount: program.price,
                                      rest: program.price
                                    }
                                    const op = _payments.find((({ customerId, targetId, type }) => {
                                      return customerId === customer.id && targetId === id && type === FORMATION
                                    }))
                                    setModalConfirm(
                                      op ?
                                        {
                                          title: `Déjà inscrit${customer.sex === 'F' ? 'e' : ''}  `,
                                          text: `${customer.firstname} est déjà inscrit${customer.sex === 'F' ? 'e' : ''} à la formation "${name}" du ${formatDate(date)}`,
                                          error: true
                                        } :
                                        {
                                          handler: _ => {
                                            savePayment(np)
                                            setActiveProgram(program)
                                            setOpenedCustomer(Store.getCurrentState('customer.customers.' + customer.id))
                                          },
                                          title: 'Inscription',
                                          text: `Inscrire ${customer.firstname} à la formation "${name}" du ${formatDate(date)}`
                                        }
                                    )
                                  }}
                                  className={clsx("program", activeProgram?.id === program.id && 'active')}
                                >
                                  <div
                                    className="program-edit"
                                    onClick={_ => setNewProgram(program)}
                                  />
                                  <div
                                    className='program-detail'
                                    onClick={_ => setActiveProgram({ ...program, formation: activeFormation })}
                                  >
                                    <span className="date">{formatDate(new Date(date))}</span>
                                    <div className="down-one">
                                      <span className="detail">{detail}</span>
                                      <span className="price">{toAmount(price)}</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                        }
                      </ScrollBar>
                    </div>
                  </div>
                )
              })
            }
          </ScrollBar> */}
        </div>
      </div>
      <div className="right-container">
        <HeaderProgramm
          close={(_) => setActiveProgram(null)}
          curProgram={activeProgram}
          showList={setShowList}
          showDiploma={setShowDiploma}
        />
        <UserList
          setOpenedCustomer={setOpenedCustomer}
          openedCustomer={openedCustomer}
          programm={activeProgram && activeProgram.programmId}
          selected={customers}
        />
      </div>
      <Editor
        close={() => setEdited(null)}
        active={!!edited}
        value={edited}
        title={(edited?.id ? "Modifier" : "Nouvelle") + " Formation"}
        fields={[
          {
            label: "Appelation",
            name: "name",
            validator: Validator().required(),
          },
          // { label: "Id", name: "id" },
          { label: "Appelation Complète", name: "fullname" },
        ]}
        // save={saveFormation}
        save={async ({...data }) => {
          // edited = data
          function modif(user){
            const f =[..._formationrecoil.map(u => ({...u}))];
            f.forEach((u,i) => {
              if(u.id === data.id){
                f[i] = {...user}
              }
            })
            return f
          }
         edited?.id ? _setformationrecoil(modif(data))  : await _setformationrecoil([..._formationrecoil,{...data,id: v4()}]);
          
        }}
        position="left"
      />
      <Editor
        close={() => setNewProgram(null)}
        active={!!newProgram}
        title={
          (newProgram?.id ? "Modifier" : "Nouvelle") + " Date de Formation"
        }
        value={newProgram || {}}
        fields={[
          {
            label: "Frais de formation",
            type: "number",
            name: "price",
            suffix: "Ar",
            validator: Validator().required(),
          },
          {
            label: "Date de debut",
            type: "date",
            maxOption: 4,
            name: "date",
            validator: Validator().required(),
          },
          { label: "Déscriptif", name: "detail" },
          { label: "Frais de Certificat", name: "certprice" },
          { label: "Nombre de place", type: "number", name: "place" },
        ]}
        save={async ({ formation, ...data }) => {
          function modif(user){
            const f =[..._programrecoil.map(u => ({...u}))];
            f.forEach((u,i) => {
              if(u.id === data.id){
                f[i] = {...user}
              }
            })
            return f
          }
          newProgram.id ? _setprogramrecoil(modif(data)) : await _setprogramrecoil([..._programrecoil,{...data,id: v4()}]);
          
          setActiveFormation(formations[data.formationId]);
        }}
        position="left"
      />
      <ModalConfirm
        active={!!modalConfirm}
        close={() => setModalConfirm(null)}
        {...(modalConfirm || {})}
      />
      <ModalWarning
        active={modalWarning}
        close={() => setModalWarning(false)}
      />
      <Editor
        title="Nouveau client"
        fields={[
          {
            label: "firstname",
            name: "firstname",
            type: "text",
            validator: Validator().required,
          },
          {
            label: "secondname",
            name: "secondname",
            type: "text",
            validator: Validator().required,
          },
          {
            label: "birthday",
            name: "birthday",
            type: "date",
            validator: Validator().required,
          },
          {
            label: "email",
            name: "email",
            type: "text",
            validator: Validator().required,
          },
          {
            label: "facebook",
            name: "facebook",
            type: "text",
            validator: Validator().required,
          },
          {
            label: "adress",
            name: "adress",
            type: "text",
            validator: Validator().required,
          },
          {
            lable: "phone",
            name: "phone",
            type: "text",
            validator: Validator().required,
          },
        ]}
      />
      {showList && (
        <PrintList
          selected={customers}
          active={true}
          formation={activeFormation}
          program={activeProgram}
          close={(_) => setShowList(false)}
        />
      )}
      {showDiploma && (
        <Diploma
          active={true}
          actFormation={activeFormation}
          actProgram={activeProgram}
          close={(_) => setShowDiploma(false)}
        />
      )}
    </div>
  );
};
export default connect(Formation, ["formation", "program", "payment"]);
