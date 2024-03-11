import {
  createBackButton
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
const soundManager = new SoundManager();
const backgroundMusic = new BackgroundMusic();
export default class Phone {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 加载背景音乐
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/phone.mp3');
    backgroundMusic.playBackgroundMusic();
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      if (this.lastLifeCount == 0){
        wx.setStorageSync('lifeCount', 2);
        wx.setStorageSync('trailNumber', '')
      }
      this.gameOver = true;
      this.game.switchScene(new this.game.startup(this.game));
    });
    this.textContent = [
      {type:'text', content: '……'},
      {type: 'text', content: '静宁的手机，怎么在这里'},
      {type: 'img', content: 'image/phone01.jpg'},
      {type: 'text', content: '屏幕内容竟然自动变化起来'},
      {type: 'text', content: '嗯？\n画面中是我和静宁'},
      {type: 'text', content: '03月12日\n我们第一次在鬼屋约会的场景'},
      {type: 'img', content: 'image/phone02.jpg'},
      {type: 'text', content: '怪不得刚刚经历的有些眼熟'},
      {type: 'text', content: '那时候她真可爱\n在里面吓得大叫\n往我怀里钻'},
      {type: 'text', content: '嘻嘻，感觉真幸福～～'},
      {type: 'text', content: '啊～～\n你是什么东西'},
      {type: 'text', content: '一个带翅膀\n悬在空中的红色怪物出现了'},
      {type: 'img', content: 'image/phone03.jpg'},
      {type: 'text', content: '怪物\n不要惊慌，人类，我是爱神\n见习时长两年半的爱神'},
      {type: 'text', content: '刘逸尘\n你不要过来啊\n我会男子防身术'},
      {type: 'text', content: '爱神\n不要误会，人类，我来恭喜你'},
      {type: 'img', content: 'image/phone04.jpg'},
      {type: 'text', content: '刘逸尘\n恭喜我什么'},
      {type: 'text', content: '爱神\n你已经通过了刚刚的试炼\n并且……'},
      {type: 'text', content: '爱神\n你是恰好第520亿对\n即将分手的情侣之一\n所以……'},
      {type: 'text', content: '爱神\n赐予你挽回你们之间感情的机会'},
      {type: 'text', content: '爱神\n翻阅感情史\n发现是你追求她的\n你的追求过程看得我都脸红了'},
      {type: 'text', content: '爱神\n接下来试炼\n帮你找回那时的激情'},
      {type: 'text', content: '刘逸尘\n我是谁\n我在哪里\n我在干嘛'},
      {type: 'text', content: '爱神\n去追！不要停\n想想当时你是怎么追求的'},
      {type: 'text', content: '一时间，刘逸尘被白光环绕'},
      {type: 'text', content: '爱神\n二极跳能力给你，善加利用'},
    ];
    this.displayTimePerStage = 3000; // 每个场景切换
    this.currentTextIndex = 0;
    this.text = '';
    this.backgroundImage = new Image();
    this.backgroundImage.src = '';
    // 添加触摸事件监听
    wx.onTouchStart(this.touchStartHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
    this.context.font = '20px Arial';
    // 添加定时器，每隔 displayTimePerImage 毫秒切换一次图片
    this.timerId = setInterval(() => {
      this.changeText();
    }, this.displayTimePerStage);
  }
  // 绘制背景
  drawBackground() {
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // 绘制场景底图
  drawBackgroundImage() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制不同场景下的文字或者图片
  drawCenterStage() {
    const lines = this.text.split('\n');
    const lineHeight = 25;  // 替换成实际行高
    const totalHeight = lines.length * lineHeight;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2 - totalHeight / 2;
    this.context.save();
    this.context.fillStyle = '#ffffff';
    this.context.textAlign = 'center';
    this.context.textAlign = 'center';
    lines.forEach((line, index) => {
      const y = centerY + lineHeight * index;
      this.context.fillText(line, centerX, y);
    });
    this.context.restore();
  }
  // 绘制跳过文字，点击可跳过场动画
  drawSkipStage() {
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'center';
    this.context.textAlign = 'center';
    this.context.fillText('跳过 >>', this.canvas.width / 2, this.canvas.height * 0.9);
    this.context.restore();
  }
  // 绘制内容更改
  changeText() {
    this.currentTextIndex = (this.currentTextIndex + 1) % this.textContent.length;
    if (this.textContent[this.currentTextIndex].type == 'text'){
      this.text = this.textContent[this.currentTextIndex].content;
      this.backgroundImage.src = '';
    }else if(this.textContent[this.currentTextIndex].type == 'img'){
      this.backgroundImage.src = this.textContent[this.currentTextIndex].content;
      this.text = '';
    }
    if (this.currentTextIndex == 0) {
      clearInterval(this.timerId);
      setTimeout(() => {
        this.game.switchScene(new this.game.seventh(this.game));
      }, 2000);
    }
  }
  // 绘制行为
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制场景底图
    this.drawBackgroundImage();
    // 绘制返回按钮
    this.drawBack();
    // 绘制不同场景下的文字或者图片
    this.drawCenterStage();
    // 绘制跳过文字，点击可跳过场动画
    this.drawSkipStage();
  }
  update() {
  }
  // 通用返回按钮作用区
  touchHandler(e){
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      clearInterval(this.timerId);
      backgroundMusic.stopBackgroundMusic();
      btn.onClick();
      return
    }
  }
  touchStartHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;  // 判断是否点击在继续按钮区域
    if (
      touchX >= this.canvas.width / 2 - 50 && touchX <= this.canvas.width / 2 + 50 &&
      touchY >= this.canvas.height * 0.9 - 20 && touchY <= this.canvas.height * 0.9 + 20
    ) {
      clearInterval(this.timerId);
      backgroundMusic.stopBackgroundMusic();
      this.game.switchScene(new this.game.seventh(this.game));
    }
  }
  touchEndHandler(e) {
  }
  // 页面销毁机制
  destroy() {
    backgroundMusic.stopBackgroundMusic();
    // 清理图像资源
    clearInterval(this.timerId);
    // 移除触摸事件监听器
    wx.offTouchStart(this.touchStartHandler.bind(this));
    wx.offTouchEnd(this.touchEndHandler.bind(this));
    // 清理加载图片
    this.textContent = [];
    this.backgroundImage.src = '';
  }
}