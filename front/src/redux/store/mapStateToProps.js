const addArrays = state => {
  Object.keys(state).map(key => {
    Object.keys(state[key]).forEach(hkey => {
      if(!!state[key][hkey] && typeof state[key][hkey] === 'object'){
        if(!hkey.startsWith('_')) state[key]['_'+hkey] = Object.values(state[key][hkey])
      }
    })
  })
  return state
}

const mapStateToProps = states => {
  return (state) => {
    if(states.includes('*')) return state
    else return states.reduce((obj, key) => ({...obj, [key]: state[key]}), {})
  }
}

export default mapStateToProps;
