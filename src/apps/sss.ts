import config from '@/config'

export class test extends plugin<'message'> {
  constructor () {
    super({
      name: '测试',
      dsc: '测试功能',
      priority: 500,
      event: 'message',
      rule: [
        {
          reg: /#测试/i,
          fnc: 'test'
        }
      ]
    })
  }

  async test (e = this.e) {
    e.reply(`你好，我的名字是${config.test.name}, 我今年刚满${config.test.age}岁`)
    return true
  }
}
