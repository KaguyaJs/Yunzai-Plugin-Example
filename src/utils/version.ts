import Data from './data'

const yunzaiPackage = await Data.readJSON('package', 'yunzai')
const pluginPackage = await Data.readJSON('package', 'plugin')

const yunzaiVer = yunzaiPackage.version as string
const pluginVer = pluginPackage.version as string

let yunzaiName: string = 'Yunzai'
let isTRSS: boolean = false
let isMiao: boolean = false

if (Array.isArray(Bot.uin)) {
  yunzaiName = 'TRSS-Yunzai'
  isTRSS = true
} else if (yunzaiPackage.name === '"miao-yunzai"') {
  yunzaiName = 'Miao-Yunzai'
  isMiao = true
} else {
  throw new Error(`不支持的Yunzai版本: ${yunzaiName}`)
}

export default {
  yunzaiName,
  yunzaiVer,
  pluginVer,
  ver: {
    isMiao,
    isTRSS
  }
}
