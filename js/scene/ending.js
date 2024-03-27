import {
  createBackButton
} from '../../utils/button';
import { soundManager, backgroundMusic, systemInfo, menuButtonInfo } from '../../utils/global';
export default class Ending {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
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
      {type: 'text', content: 'END'},
      {type: 'text', content: '刘逸尘\n刚才真是吓死个人\n累死了……'},
      {type: 'text', content: 'Bingo!\n恭喜你通过最终试炼'},
      {type: 'text', content: '爱神\n按照约定你和静宁的感情\n重新复合'},
      {type: 'text', content: '刘逸尘\n不……不敢相信\n太好了'},
      {type: 'text', content: '爱神\n不要高兴太早哦\n虽然，你们复合了'},
      {type: 'text', content: '爱神\n你们的感情可能仍会破裂'},
      {type: 'text', content: '刘逸尘\n不！我以后会十分珍惜的'},
      {type: 'text', content: '爱神鬼魅一笑'},
      {type: 'img', content: 'image/playground01.jpg'},
      {type: 'text', content: '爱神\n年轻～～～\n我翻看了你们的感情记录'},
      {type: 'text', content: '爱神\n你们二人缺乏良好的沟通和理解\n性格也是差异很大'},
      {type: 'text', content: '爱神\n争吵、疏离、冷漠、怀疑\n逐渐累积'},
      {type: 'text', content: '爱神\n不善于经营的感情\n随着时间的流逝\n终于破裂'},
      {type: 'text', content: '……'},
      {type: 'text', content: '刘逸尘低下头，沉默无语'},
      {type: 'text', content: '爱神\n不过，既然复合了\n就好好珍惜这一次吧'},
      {type: 'text', content: '爱神\n我送你回去'},
      {type: 'text', content: '刘逸尘\n等等\n我真的很珍视我和静宁的感情\n我不想重蹈覆辙'},
      {type: 'text', content: '刘逸尘\n求你帮帮我'},
      {type: 'text', content: '爱神\n……'},
      {type: 'text', content: '刘逸尘用水汪汪的眼睛盯着爱神\n无比期待等着爱神答复'},
      {type: 'text', content: '爱神\n好吧，既然你我有缘\n我送你一些建议'},
      {type: 'text', content: '爱神突然改变了行装'},
      {type: 'img', content: 'image/playground02.jpg'},
      {type: 'text', content: '刘逸尘一时目瞪口呆'},
      {type: 'text', content: '爱神\n感情要长久\n共同努力互相许\n沟通好是关键处\n亲密关系细细护\n共同目标心相连\n解决冲突别耍贫\n相互支持理解真\n培养共同兴趣心\n时间空间要平衡\n定期反思有益处\n维护感情稳定船\nSkr~~'},
      {type: 'text', content: '刘逸尘再一次目瞪口呆'},
      {type: 'text', content: '爱神\n是时候送你回去了\n再见'},
      {type: 'text', content: '刘逸尘再一次被白光包裹'},
      {type: 'text', content: '当睁开眼睛时\n看到了年轻的徐静宁'},
      {type: 'img', content: 'image/end01.jpg'},
      {type: 'text', content: '环顾四周\n竟然是\n和徐静宁第一次约会的游乐园'},
      {type: 'text', content: '徐静宁\n傻子，在看什么呢'},
      {type: 'text', content: '刘逸尘一时语塞，不知所言'},
    ];
    this.displayTimePerStage = 3000; // 每个场景切换
    this.currentTextIndex = 0;
    this.text = '';
    this.backgroundImage = new Image();
    this.backgroundImage.src = '';
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
        this.game.switchScene(new this.game.startup(this.game));
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
    // 是否跳过
    if (
      touchX >= this.canvas.width / 2 - 50 && touchX <= this.canvas.width / 2 + 50 &&
      touchY >= this.canvas.height * 0.9 - 20 && touchY <= this.canvas.height * 0.9 + 20
    ) {
      clearInterval(this.timerId);
      backgroundMusic.stopBackgroundMusic();
      this.game.switchScene(new this.game.startup(this.game));
    }
  }
  // 页面销毁机制
  destroy() {
    // 清理图像资源
    clearInterval(this.timerId);
    // 清理加载图片
    this.textContent = [];
    this.backgroundImage.src = '';
  }
}