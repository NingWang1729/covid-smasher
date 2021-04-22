import * as locations_module from './base_classes/locations.js'
const { WORLD_MAP } = locations_module

// Creates deep copy of map grid
export function deepCopy(arr) {
  return arr.map(elem => {
    if (Array.isArray(elem)) return deepCopy(elem)
    else if (typeof elem === 'object') return deepCopyObject(elem)
    else return elem
  })
}

// Helper function to recursively deep copy values to an object
export function deepCopyObject(orig) {
  const clone = {}
  for (let [key, val] of Object.entries(orig)) {
    if (Array.isArray(val)) orig[key] = deepCopy(val)
    else if (typeof val === 'object') orig[key] = deepCopyObject(val)
    else orig[key] = val
  }

  return clone
}

export function getRandomSpawnPoint() {
  // Used for NPCs
  // Numbers are inclusive, [min, max]
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function moveableSpaces(grid) {
    const rowColArr = []
    for (const [x, row] of grid.entries()) {
      for (const [y, item] of row.entries()) {
        if (item === 2) rowColArr.push([x, y])
      }
    }
    return rowColArr
  }

  const randNum = getRandomNumber(0, moveableSpaces(WORLD_MAP).length - 1)
  const rows = moveableSpaces(WORLD_MAP)[randNum][0]
  const cols = moveableSpaces(WORLD_MAP)[randNum][1]

  return [rows, cols]
}
