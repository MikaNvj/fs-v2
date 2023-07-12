import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './views/containers/Login'
import Connexion from './views/containers/Connexion'
import Formation from './views/containers/Formation'
import Certificat from './views/containers/Certificat'
import AutrePayement from './views/containers/AutrePayement'
import Input from './views/components/Input'
import PaidConnexion from './views/components/PaidConnexion'
import UserComponent from './views/components/UserComponent'


function Router(props) {
  const {
    connected
  } = props
  return (
    <Switch>
      {!connected && <Route component={Login} />}
      {
        [...protectedRoutes, ...routes].map(({ path, component, exact }, key) => {
          if (typeof component === 'string') {
            return <Route {...{ exact, key, path }} render={({ history }) => {
              history.replace(component)
            }} />
          }
          return <Route {...{ key, component, path, exact }} />
        })
      }
    </Switch>
  )
}

export default Router

const protectedRoutes = [
  // ['/', Home, true],
  // ['/', Login, true],
  // ['/myroute/:params', Component],
].map(([path, component, exact]) => ({ path, component, exact, isProtected: true }))

const V = _ => {
  const [state, setstate] = React.useState()
  return <div>
    <Input type='datetime' value={state} onChange={setstate}/>
    <div>{JSON.stringify(state)}</div>
  </div>
}

const routes = [
  ['/oui', UserComponent],
  ['/test', PaidConnexion],
  ['/certificat', Certificat],
  ['/formations', Formation],
  ['/payments', AutrePayement],
  ['/', Connexion],
].map(([path, component, exact]) => ({ path, component, exact }))
