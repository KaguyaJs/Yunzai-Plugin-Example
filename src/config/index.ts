import { Path, PluginName, PluginPath } from '@/dir'
import type { Config } from '@/types'
import Data from '@/utils/data'
import fs from 'node:fs'
import path from 'node:path'
import chokidar, { FSWatcher } from 'chokidar'
import _ from 'lodash'

class ConfigManager {
  userConfigPath = path.resolve(Path, 'config', PluginName, 'config.json')
  defConfigPath = path.resolve(PluginPath, 'resources', 'config/config.json')
  schemaPath = path.resolve(PluginPath, 'schema', 'config.schema.json')
  schemaRelativePath = path.relative(path.dirname(this.userConfigPath), this.schemaPath)
  config: Config = Data.getJSON(this.defConfigPath)
  #watcher?: FSWatcher

  async init () {
    if (!fs.existsSync(this.userConfigPath)) {
      Data.createDir(this.userConfigPath, undefined, true)
      // fs.copyFileSync(this.defConfigPath, this.userConfigPath)
      await Data.writeJSON(this.userConfigPath, this.config)
    }
    this.config['$schema'] = this.schemaRelativePath
    await this.load()
    this.watch()
    return this
  }

  async load () {
    const userConfig = Data.getJSON<Config>(this.userConfigPath, undefined, false)
    if (!_.isEqual(userConfig, this.config)) {
      this.config = _.merge({}, userConfig, this.config)
      await this.save()
    }
  }

  get test () {
    return this.config.test
  }

  /** 保存配置 */
  async save () {
    return Data.writeJSON(this.userConfigPath, this.config)
  }

  /**
   * 修改配置项
   * @param key 配置路径（支持 lodash 的路径语法）
   * @param value 新值
   */
  async set (key: string, value: any) {
    _.set(this.config, key, value)
    return this.save()
  }

  /**
   * 获取配置项
   * @template T 返回数据类型
   * @param key 配置路径
   * @param defaultValue 可选默认值
   */
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    return _.get(this.config, key, defaultValue)
  }

  watch () {
    if (this.#watcher) return

    this.#watcher = chokidar.watch(this.userConfigPath, {
      persistent: true,
      ignoreInitial: true
    })

    this.#watcher.on('change', async () => {
      // logger.debug(`[${PluginName}] 检测到配置文件变更，重新加载中...`)
      try {
        await this.load()
        logger.debug(`[${PluginName}] 配置已更新`)
      } catch (err) {
        logger.error(`[${PluginName}] 配置重载失败 `, err)
      }
    })
  }

  unwatch () {
    this.#watcher?.close()
    this.#watcher = undefined
  }
}

export default await (new ConfigManager()).init()
