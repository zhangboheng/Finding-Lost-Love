import {
  createBackButton
} from '../../utils/button';
import { soundManager, backgroundMusic, menuButtonInfo, scaleX, scaleY } from '../../utils/global';
export default class Playground {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/phone.mp3');
    backgroundMusic.playBackgroundMusic();
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    /* 加载音乐音效管理器结束 */
    /* 常量设置区域开始 */
    this.textContent = [
      {type:'text', content: '……'},
      {type: 'text', content: '刘逸尘\n呼～～呼～～\n太累了'},
      {type: 'text', content: '刘逸尘\n太诡异了，脚是自己动起来的'},
      {type: 'text', content: '刘逸尘\n这个地方看着有些眼熟'},
      {type: 'text', content: "'Bingo!'\n恭喜你又一次通过试炼"},
      {type: 'img', content: 'image/playground01.jpg'},
      {type: 'text', content: '刘逸尘\n爱神？快放我出去\n还有，静宁在哪里'},
      {type: 'text', content: '爱神\n先别急，试炼还没结束\n放心，你的爱人很安全'},
      {type: 'text', content: '爱神\n这地方有印象吧'},
      {type: 'text', content: '爱神\n虽然已经荒废\n这里是你和静宁表白的地方'},
      {type: 'text', content: '爱神\n怀念吧？接下来还有哦\n嘿嘿嘿～～～'},
      {type: 'text', content: '刘逸尘感到一阵寒意'},
      {type: 'text', content: '刘逸尘\n你……你……你又要做什么……'},
      {type: 'text', content: '爱神\n开启你的甜蜜之旅\n先说明……'},
      {type: 'text', content: '爱神\n如果无法完成\n你们的感情就彻底拜拜～～'},
      {type: 'text', content: '刘逸尘再一次被白光包裹'},
    ];
    this.displayTimePerStage = 3000; // 每个场景切换
    this.currentTextIndex = 0;
    this.text = '';
    this.context.font = `${20 * scaleX}px Arial`;
    this.timerId = setInterval(() => {
      this.changeText();
    }, this.displayTimePerStage);
    /* 常量设置区域结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = '';
    this.backButton = '';
    /* 图片加载区域结束 */
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
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制不同场景下的文字或者图片
  drawCenterStage() {
    const lines = this.text.split('\n');
    const lineHeight = 25 * scaleY;  // 替换成实际行高
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
        this.game.switchScene(new this.game.eighth(this.game));
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
      if (this.lastLifeCount == 0){
        wx.setStorageSync('lifeCount', 2);
        wx.setStorageSync('trailNumber', '')
      }
      backgroundMusic.stopBackgroundMusic();
      this.gameOver = true;
      btn.onClick();
      return
    }
    // 点击跳过按钮
    if (
      touchX >= this.canvas.width / 2 - 50 * scaleX && touchX <= this.canvas.width / 2 + 50 * scaleX &&
      touchY >= this.canvas.height * 0.9 - 20 * scaleY && touchY <= this.canvas.height * 0.9 + 20 * scaleY
    ) {
      clearInterval(this.timerId);
      backgroundMusic.stopBackgroundMusic();
      this.game.switchScene(new this.game.playground(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    clearInterval(this.timerId);
    // 清理加载图片
    this.textContent = [];
    this.backgroundImage.src = '';
    this.backButton = '';
  }
}