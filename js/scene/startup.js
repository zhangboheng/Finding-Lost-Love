import {
  drawRoundedRect,
  drawImageBtn
} from '../../utils/button';
import { menuButtonInfo, scaleX, scaleY } from '../../utils/global';
export default class Startup {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    this.customAd = '';
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    this.planningImage = new Image();
    this.planningImage.src = 'image/rakhi.png';
    this.settingsImage = new Image();
    this.settingsImage.src = 'image/click.png';
    /* 图片加载区域结束 */
    /* 按钮设置开始 */
    // 设置开始按钮的基础设置
    this.buttonWidth = 180 * scaleX;
    this.buttonHeight = 50 * scaleY;
    this.buttonX = (this.canvas.width - this.buttonWidth) / 2;
    this.buttonY = this.canvas.height - 120 * scaleY;
    /* 按钮设置结束 */
    this.insBtn = '';
    this.settingsBtn = '';
    this.drawAd();
  }
  // 绘制广告
  drawAd() {
    this.customAd = wx.createCustomAd({
      adUnitId: 'adunit-491a55ec61e4c122',
      style: {
          left: menuButtonInfo.right - 60,
          top: menuButtonInfo.bottom + 10,
          width: 60
      }
    });
    this.customAd.show();
    this.customAd.onError(err => {
      console.error(err.errMsg)
    });
  }
  // 绘制背景图
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 绘制玩法说明
  drawInstruction() {
    this.insBtn = drawImageBtn(this.context, this.planningImage, 10, menuButtonInfo.top, scaleX, scaleY, '说明');
  }
  // 游戏设置说明
  drawSettings() {
    this.settingsBtn = drawImageBtn(this.context, this.settingsImage, 10, menuButtonInfo.top + 42 * scaleY + 10 * scaleX, scaleX, scaleY, '设置');
  }
  // 绘制按钮
  drawStartBtn() {
    this.context.save();
    // 开始按钮
    drawRoundedRect(this.context, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight, 10, '#fc86bc99', 'black', 3);
    // 按钮文字
    this.context.fillStyle = 'black';
    this.context.font = `bold ${16 * scaleX}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    // 将文本的y坐标设置为按钮的垂直中心
    this.context.fillText('寻回吾爱', this.buttonX + this.buttonWidth / 2, this.buttonY + this.buttonHeight / 2 + 2 * scaleY);
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
    // 绘制玩法说明
    this.drawInstruction();
    // 游戏设置说明
    this.drawSettings();
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
    // 判断是否点击了玩法说明
    if (touch.clientX >= this.insBtn.x && touch.clientX <= this.insBtn.x + this.insBtn.width && touch.clientY >= this.insBtn.y && touch.clientY <= this.insBtn.y + this.insBtn.height && !this.showDialogOrNot) {
      this.game.switchScene(new this.game.instruction(this.game));
    }
    // 判断是否点击了设置玩法说明
    if (touch.clientX >= this.settingsBtn.x && touch.clientX <= this.settingsBtn.x + this.settingsBtn.width && touch.clientY >= this.settingsBtn.y && touch.clientY <= this.settingsBtn.y + this.settingsBtn.height && !this.showDialogOrNot){
      this.game.switchScene(new this.game.settings(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    this.customAd.destroy();
    this.customAd = '';
    this.backgroundImage.src = '';
    this.insBtn = '';
    this.settingsBtn = '';
  }
}