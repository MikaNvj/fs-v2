import Fuzzy from 'fuzzy'

export const get = (obj, field = "") => {
  return field.split(".").reduce((obj, key) => (obj ? obj[key] : obj), obj);
}

export const toPhone = (txt = '', space = true) => {
  txt = txt.replace(/ |[^\d]/g, '')
  if(!space) return txt
  else return `${txt.substring(0, 3)} ${txt.substring(3, 5)} ${txt.substring(5, 8)} ${txt.substring(8)}`.trim()
}

export const computeAge = dob => {
  dob = new Date(dob || new Date())
  return new Date().getFullYear() - dob.getFullYear()
}

export const toAmount = (nb, suffix = 'Ar') => {
  const arr = `${nb}`.split('')
  let amount = ''
  while (arr.length > 0) {
    amount = `${arr.splice(-3).join('')} ${amount}`
  }
  return !suffix ? amount.trim() : `${amount.trim()} ${suffix}`
}

export const reduceToId = (itemObjectOrId) => {
  return typeof itemObjectOrId === "object" ? itemObjectOrId.id : itemObjectOrId;
}


const addOrReplaceToObj = (old, toAdd = []) => {
  if (Object.keys(old).length === 0) return toObj(toAdd)
  toAdd.forEach(({ id, __id, ...node }) => {
    const found = old[id] || old[__id]
    old[id] = found ? Object.assign(found, { ...node, id }) : Object.assign(node, { id })

    delete old[__id]
  })
  return { ...old }
}

const toObj = arr => arr.reduce((obj, item) => {
  obj[reduceToId(item)] = item
  return obj
}, {})

export const addOrReplace = (old, toAdd = []) => {
  return Array.isArray(old) ? Object.values(toObj(old), toAdd) : addOrReplaceToObj(old, toAdd)
}

const removeFromToObj = (old, toRemove = []) => {
  return removeFrom(Object.values(old), toRemove).reduce((obj, cur) => {
    obj[cur.id] = cur
    return obj
  }, {})
}

export const removeFrom = (old, toRemove = []) => {
  if (!Array.isArray(old)) return removeFromToObj(old, toRemove)
  toRemove = toRemove.map(reduceToId)
  return old.filter(obj => !toRemove.includes(reduceToId(obj)))
}

export const simulateWait = (data, timeout = 500) => new Promise(res => {
  setTimeout($ => res(data), timeout)
})

export const addZero = (nb, min = 2) => {
  nb = nb + "";
  return nb.padStart(min, "0");
};

export const extractNews = (obj, ref, exclude = []) => {
  if (!obj || !ref) return obj
  obj = { ...obj }
  Object.keys(obj).forEach((key) => {
    const val = /^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}([ T][0-9]{1,2}:[0-9]{1,2}(:[0-9]{1,2}(\.[0-9]{1,3}Z)?)?)?$/.exec(obj[key]) ? new Date(obj[key]) : obj[key]
    if (
      val === ref[key] ||
      ((val instanceof Date || ref[key] instanceof Date) && toSQLDate(obj[key]) === toSQLDate(ref[key]))
    ) delete obj[key]
  })
  return Object.keys(obj).length ? obj : null
}

export const toSimpleDate = (date = new Date()) => {
  date = new Date(date)
  return date.getTime() ? `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}` : undefined
}

export const toSimpleTime = (date = new Date()) => {
  date = new Date(date)
  return date.getTime() ? `${addZero(date.getHours())}:${addZero(date.getMinutes())}` : undefined
}

export const toSQLDate = date => {
  const d = toSimpleDate(date || null)
  return d ? `${d} ${toSimpleTime(date)}` : null
}

export const chunk = (array, chunk$size = 2) => {
  const ret = [];
  for (let i = 0, j = array.length; i < j; i += chunk$size) {
    ret.push(array.slice(i, i + chunk$size));
  }
  return ret;
};

export const fullFormatDate = (date = new Date(), {lang = "fr", baseDate = new Date()}) => {
  if (typeof date == "number" || typeof date == "string") date = new Date(date);
  return areSameDate(date, new Date(baseDate))
    ? getFormatHour(date)
    : formatDate(date) + " à " + getFormatHour(date);
};

export const areSameDate = (d1 = new Date(), d2 = new Date()) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const toBareStringDate = d => {
  return `${d.getFullYear()}${addZero(d.getMonth())}${addZero(d.getDate())}${addZero(d.getHours())}${addZero()}`
};

export const getFormatHour = (date = new Date(), lang = "fr") => {
  if (typeof date === 'string') date = new Date(date)
  return addZero(date.getHours()) + "h " + addZero(date.getMinutes());
};

export const formatDate = (date = new Date(), { preciseYear = false, precise = false, lang = "fr", du = false } = {}) => {
  if (typeof date === 'string') date = new Date(date)
  const today = new Date();
  const { year, month, day, yesterday, tomorrow } = {
    year: today.getFullYear() === date.getFullYear() && !preciseYear,
    month: today.getMonth() === date.getMonth(),
    day: today.getDate() === date.getDate(),
    yesterday: today.getDate() - 1 === date.getDate(),
    tomorrow: today.getDate() + 1 === date.getDate(),
  };
  if (year && month && day && !precise) return (du ? "d'" : '') + "Aujourd'hui";
  else if (year && month && yesterday && !precise) return (du ? "d'" : '') + "Hier";
  else if (year && month && tomorrow && !precise) return (du ? "de " : '') + "Demain";
  else return (du ? "du " : '') + basicFormatDate(date, lang, preciseYear);
}

export const basicFormatDate = (date = new Date(), lang = "fr", preciseYear = false) => {
  if (typeof date == "string") {
    date = date.split("-").map((c) => parseInt(c));
    date = new Date(date[0], date[1] - 1, date[2]);
  }
  var days = {
    fr: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
  };
  var format = {
    fr: ({ dayName, day, monthName, year }) =>
      `${dayName}, ${day} ${monthName} ${(!preciseYear && new Date().getFullYear()) == year ? "" : year
      }`,
  };

  return format[lang]({
    day: addZero(date.getDate()),
    month: addZero(date.getMonth()),
    year: date.getFullYear(),
    dayName: days[lang][date.getDay()],
    monthName: basicFormatDate.monthNames[lang][date.getMonth()],
  });
};

export const toCamelCase = str => {
  let val = ''
  for (let i = 0; i < str.length; i++) {
    val += (i === 0 || [' ', "'"].includes(str[i - 1])) ? str[i].toUpperCase() : str[i]
  }
  return val
}

basicFormatDate.monthNames = {
  fr: [
    "Janvier", "Février", "Mars", "Avril", "Mai",
    "Juin", "Juillet", "Août", "Septembre", "Octobre",
    "Novembre", "Décembre",
  ],
  frc: [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
    "Jui", "Aoû", "Sep", "Oct", "Nov", "Déc"
  ],
};

export const waitForProms = async (...promises) => await Promise.all(promises)

export const onlyValues = (obj, except = []) => {
  except = [...except, 'get', 'input']
  return Object.keys(obj).reduce((o, key) => {
    !(
      (typeof obj[key] === 'function' && key.startsWith('set')) ||
      except.includes(key)
    ) && Object.assign(o, { [key]: obj[key] })
    return o
  }, {})
}

export const bulkSetter = (state, setState) => {
  if (!setState.$) {
    setState.$ = (param, value) => {
      if (typeof param === 'string') state[param] = value
      else if (typeof param === 'object') Object.assign(state, param)
      setState({ ...state })
    }
  }
  if (setState.STATE !== state)
    Object.assign(state, {
      ...bulkSetter.createSetters(state, setState.$),
      set: setState.$,
      get: except => onlyValues(state, except),
      input: name => ({
        value: state[name], onChange: val => {
          const inpValue = get(val, 'target.value')
          val = inpValue === undefined ? val : inpValue
          setState.$(name, val)
        }
      })
    })
  return state
}
bulkSetter.createSetters = (states, setGlobal) => {
  return Object.keys(states).reduce((po, key) => {
    if (key.startsWith('set')) return po
    const set = 'set' + (str => str[0].toUpperCase() + str.substr(1))(key)
    po[set] = val => setGlobal(key, val)
    return po
  }, {})
}

export const fuzzyFilter = (array, search = '', extractor = _ => _) => {
  if (!search) return array
  var options = { extract: extractor }
  const res = Fuzzy.filter(search, array, options)
  return res.map(one => one.original || one)
}

const setDoubles = (double) => {
  if (parseInt(double) < 10) return '0' + double
  return double + ''
}

export const formatHourMinite = (date = new Date()) => {
  if (date) {
    return `${setDoubles(date.getHours())}:${setDoubles(date.getMinutes())}`
  }
}



export const changeDate = (value) => {
  if (value) {
    const [hours, minute] = value.split(':')
    if (hours && minute && hours.length == 2 && minute.length === 2) {
      const date = new Date()
      date.setHours(parseInt(hours))
      date.setMinutes(parseInt(minute))
      return date
    }
  }
}

export const convertMinsToHrsMins = (mins) => {
  let h = Math.floor(mins / 60);
  let m = Math.round(mins % 60);
  return { heure: h, minute: m };
}



export const convertMinsToSecond = (mins) => {
  return mins * 60 * 1000;
}

export function setDouble(value) {
  if (value < 10) return '0' + value
  return '' + value
}

export function formateDate(date = new Date()) {
  date = new Date(date)
  const day = setDouble(date.getDate())
  const month = setDouble(date.getMonth() + 1)
  const years = date.getFullYear()

  const hour = setDouble(date.getHours())
  const minute = setDouble(date.getMinutes())
  const second = setDouble(date.getSeconds())
  return `${day}/${month}/${years} ${hour}:${minute}:${second}`
}

// algorithme
// verifier si le debut est dans le jour ou nuit. si jour et nombre de munite est superieur 8. le montant est 4000
// verifier si le date fin est inferieur a la heur de fin de cycle
// si oui on fait just le calcul est multiplier le 15 et on return le value
// si non on calcule la difference entre la date de debut et date fin par la date de fin de cycle
// on change le date de debut par la date de fin de cycle
// si la fin de cycle suivant est inferieur a la date fin. on repaite cette action en haut
// si non on calcul le difference entre le nouveau date debut est le date fin

const Pr = { minute: 20, midday: 4000, day: 5000, night: 6000, min: 300 }
export const determinerPrix = (start = new Date(), end = new Date(), prices = []) => {
  if (end < start) {
    let temp = end
    end = start
    start = temp
  }
  let duration = {
    m: (end - start) / (1000 * 60),
    h: (end - start) / (1000 * 60 * 60)
  }
  if (duration.h <= 4) {
    let price = Math.floor(duration.m) * Pr.minute
    if (price > Pr.midday) prices.push({
      "Démi-journée": Pr.midday
    })
    else prices.push({
      "Calculée": price
    })
  }
  else if (duration.h <= 12) {
    const night = start.getDate() !== end.getDate()
    const exact = night ? Pr.night : Pr.day
    let price = Math.floor(duration.m) * Pr.minute
    if(price < exact) prices.push({
      "Calculée": price
    })
    else prices.push({
      [night ? "Nuitée" : "Journée"]: exact
    })
  }
  else {
    let newEnd = new Date(start)
    if (start.getHours() < 6) {
      newEnd.setHours(6, 0)
      determinerPrix(start, newEnd, prices)
    }
    else if (start.getHours() < 18) {
      newEnd.setHours(18, 0)
      determinerPrix(start, newEnd, prices)
    }
    else {
      newEnd.setDate(newEnd.getDate() + 1)
      newEnd.setHours(6, 0)
      determinerPrix(start, newEnd, prices)
    }

    while (end - newEnd >= 12 * 60 * 60 * 1000) {
      const fstart = new Date(newEnd)
      newEnd.setHours(newEnd.getHours() + 12)
      determinerPrix(fstart, newEnd, prices)
      if(prices.length >= 30) break;
    }
    if(!prices.length >= 30) determinerPrix(newEnd, end, prices)
  }
  //Final total
  let fTotal = Math.round(prices.reduce((total, price) => {
    return total + Object.values(price)[0]
  }, 0) / 100) * 100

  return fTotal > Pr.min ? fTotal : Pr.min
}
window.prix = determinerPrix