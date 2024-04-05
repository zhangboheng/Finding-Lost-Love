import Startup from './scene/startup.js';
import Instruction from './scene/instruction.js';
import Settings from './scene/settings.js';
import Begin from './scene/begin.js';
import Second from './scene/second.js';
import Third from './scene/third.js';
import Fourth from './scene/fourth.js';
import Fifth from './scene/fifth.js';
import Sixth from './scene/sixth.js';
import Phone from './scene/phone.js';
import Seventh from './scene/seventh.js';
import Playground from './scene/playground.js';
import Eighth from './scene/eighth.js';
import Ninth from './scene/ninth.js';
import Tenth from './scene/tenth.js';
import Eleventh from './scene/eleventh.js';
import Twelfth from './scene/twelfth.js';
import Ending from './scene/ending.js';
import { systemInfo } from '../utils/global';
export default class Game {
  constructor() {
    this.initSettings();
    this.canvas = wx.createCanvas();
    this.context = canvas.getContext('2d');
    this.canvas.width = systemInfo.screenWidth;
    this.canvas.height = systemInfo.screenHeight;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    this.startup = Startup;
    this.settings = Settings;
    this.instruction = Instruction;
    this.begin = Begin;
    this.second = Second;
    this.third = Third;
    this.fourth = Fourth;
    this.fifth = Fifth;
    this.sixth = Sixth;
    this.phone = Phone;
    this.seventh = Seventh;
    this.playground = Playground;
    this.eighth = Eighth;
    this.ninth = Ninth;
    this.tenth = Tenth;
    this.eleventh = Eleventh;
    this.twelfth = Twelfth;
    this.ending = Ending;
    this.currentScene = new this.sixth(this);
    this.instanceList = [Begin, Second, Third, Fourth, Fifth, Sixth, Phone, Seventh, Playground, Eighth, Ninth, Tenth, Eleventh, Twelfth, Ending];
    canvas.addEventListener('touchstart', (e) => {
      this.currentScene.touchHandler(e);
    });
    // ios端音频不能在静音下播放处理
    wx.setInnerAudioOption({
      obeyMuteSwitch: false,
      success: function (res) {
        console.log("开启静音模式下播放音乐的功能");
      },
      fail: function (err) {
        console.log("静音设置失败");
      },
    });
    // 启用分享菜单
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeLine']
    });
    // 设置默认分享信息
    wx.onShareAppMessage(() => {
      return {
        title: '一起寻回我们曾经的美好！',
        imageUrl: 'image/thumbnail.jpg' // 分享图片的路径
      };
    });
    this.boundLoop = this.loop.bind(this);
    this.loop();
  }
  // 初始化信息
  initSettings() {
    let getMusicState = wx.getStorageSync('musicEnabled');
    let getBackgroundMusic = wx.getStorageSync('backgroundMusicEnabled');
    let getLifeCount = wx.getStorageSync('lifeCount');
    if (getMusicState == ''){
      wx.setStorageSync('musicEnabled', true)
    }
    if (getBackgroundMusic == ''){
      wx.setStorageSync('backgroundMusicEnabled', true)  
    }
    if (getLifeCount == ''){
      wx.setStorageSync('lifeCount', 2)
    }
  }
  loop() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentScene.draw();
    this.instanceList.forEach(item=>this.currentScene instanceof item ? this.currentScene.update(): '')
    requestAnimationFrame(this.boundLoop);
  }
  // 切换页面方法
  switchScene(newScene) {
    // 页面销毁后需要将就页面的资源和监听器进行清理
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }
    this.currentScene = newScene;
  }
}