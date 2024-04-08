import {
  drawRoundedRect
} from '../../utils/button';
import { scaleX, scaleY } from '../../utils/global';
export default class Startup {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    /* 图片加载区域结束 */
    /* 按钮设置开始 */
    // 设置开始按钮的基础设置
    this.buttonWidth = 180 * scaleX;
    this.buttonHeight = 50 * scaleY;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = this.canvas.height - 240 * scaleY;
    // 设置玩法说明按钮的基础设置
    this.secondButtonWidth = this.buttonWidth;
    this.secondButtonHeight = this.buttonHeight;
    this.secondButtonX = this.buttonX;
    this.secondButtonY = this.buttonY + this.buttonHeight + 10 * scaleY;
    // 设置游戏设置按钮的基础设置
    this.thirdButtonWidth = this.buttonWidth;
    this.thirdButtonHeight = this.buttonHeight;
    this.thirdButtonX = this.buttonX;
    this.thirdButtonY = this.buttonY + this.buttonHeight + this.secondButtonHeight + 20 * scaleY;
    /* 按钮设置结束 */
  }
  // 绘制背景图
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 绘制按钮
  drawStartBtn() {
    this.context.save();
    // 开始按钮
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#fc86bc99', 'black', 3);
    drawRoundedRect(this.context, this.secondButtonX, this.secondButtonY, this.secondButtonWidth, this.secondButtonHeight, 10, '#fc86bc99', 'black', 3);
    drawRoundedRect(this.context, this.thirdButtonX, this.thirdButtonY, this.thirdButtonWidth, this.thirdButtonHeight, 10, '#fc86bc99', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    // 将文本的y坐标设置为按钮的垂直中心
    this.context.fillText('寻回吾爱', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2 + 2 * scaleY);
    this.context.fillText('玩法说明', this.secondButtonX + this.secondButtonWidth / 2, this.secondButtonY + this.secondButtonHeight / 2 + 2 * scaleY);
    this.context.fillText('游戏设置', this.thirdButtonX + this.thirdButtonWidth / 2, this.thirdButtonY + this.thirdButtonHeight / 2 + 2 * scaleY);
    this.context.restore();
  }
  // 绘制健康游戏公告
  drawPublish() {
    this.context.save();
    this.context.fillStyle = '#fff';
    this.context.font = `${10 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    const text = '《健康游戏忠告》\n抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。';
    // 将文本按\n分割成多行
    const lines = text.split('\n');
    // 计算文本开始绘制的Y坐标
    const lineHeight = 14 * scaleY; // 行高，根据需要调整
    const startY = this.canvas.height - 50 * scaleY
    // 绘制每一行文本
    lines.forEach((line, index) => {
      const x = this.canvas.width / 2;
      const y = startY + lineHeight * index;
      this.context.fillText(line, x, y);
    });
    this.context.restore();
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制按钮
    this.drawStartBtn();
    // 绘制健康游戏公告
    this.drawPublish();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    if (touch.clientX >= this.buttonX && touch.clientX <= this.buttonX + this.buttonWidth &&
      touch.clientY >= this.buttonY && touch.clientY <= this.buttonY + this.buttonHeight) {
      const getTrailGame = wx.getStorageSync('trailNumber')
      if(getTrailGame == 1){
        this.game.switchScene(new this.game.second(this.game));
      }else if(getTrailGame == 2){
        this.game.switchScene(new this.game.third(this.game));
      }else if(getTrailGame == 3){
        this.game.switchScene(new this.game.fourth(this.game));
      }else if(getTrailGame == 4){
        this.game.switchScene(new this.game.fifth(this.game));
      }else if(getTrailGame == 5){
        this.game.switchScene(new this.game.sixth(this.game));
      }else if(getTrailGame == 6){
        this.game.switchScene(new this.game.phone(this.game));
      }else if(getTrailGame == 7){
        this.game.switchScene(new this.game.playground(this.game));
      }else if(getTrailGame == 8){
        this.game.switchScene(new this.game.ninth(this.game));
      }else if(getTrailGame == 9){
        this.game.switchScene(new this.game.tenth(this.game));
      }else if(getTrailGame == 10){
        this.game.switchScene(new this.game.eleventh(this.game));
      }else if(getTrailGame == 11){
        this.game.switchScene(new this.game.twelfth(this.game));
      }else{
        this.game.switchScene(new this.game.begin(this.game));
      }
    }
    // 检测是否点击了第二个按钮
    if (touch.clientX >= this.secondButtonX && touch.clientX <= this.secondButtonX + this.secondButtonWidth &&
      touch.clientY >= this.secondButtonY && touch.clientY <= this.secondButtonY + this.secondButtonHeight) {
      this.game.switchScene(new this.game.instruction(this.game));
    }
    // 检测是否点击了第三个按钮
    if (touch.clientX >= this.thirdButtonX && touch.clientX <= this.thirdButtonX + this.thirdButtonWidth &&
      touch.clientY >= this.thirdButtonY && touch.clientY <= this.thirdButtonY + this.thirdButtonHeight) {
      this.game.switchScene(new this.game.settings(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    this.backgroundImage.src = '';
  }
}