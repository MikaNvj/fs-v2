const LocalData = new Proxy(window.localStorage,{
  get: function(target, prop){
    try{
      return JSON.parse(target[prop])
    }catch(e){}
  },
  set: function(target, prop, value){
    return Reflect.set(target, prop, JSON.stringify(value));
  }
})

window.LocalData = LocalData

export default LocalData