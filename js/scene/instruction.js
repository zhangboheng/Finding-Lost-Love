import {
  createBackButton
} from '../../utils/button';
import {
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    // 底部 banner
    this.bannerAd = '';
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    this.backButton = '';
    this.role = new Image();
    this.role.src = 'image/front1.png';
    this.cycleIcon = new Image();
    this.cycleIcon.src = 'image/cycle.png';
    this.clickIcon = new Image();
    this.clickIcon.src = 'image/click.png';
    /* 图片加载区域结束 */
    /* 常量设置区域开始 */
    this.tabs = ['背景', '角色', '技能', '玩法'];
    this.paragraph = `看到桌上的离婚协议\n刘逸尘的眼眸里满是悔恨\n泪水无声地滑落，落在离婚协议上\n进而渗透到离婚协议下的旧相片\n相片记录着他们二人幸福的时刻\n两人笑得灿烂而天真\n在这一瞬间，离婚协议和那张相片\n仿佛成为了时光的交汇点\n刘逸尘不禁沉浸在过去的美好回忆中\n突然间，一种神秘的力量涌现\n刘逸尘被白光吞没\n当他再次睁开眼睛时\n他竟然身处在一处恐怖洞穴\n一场寻爱的奇妙之旅就此展开～～`;
    // 当前选中的标签索引
    this.selectedIndex = 0;
    /* 常量设置区域结束 */
    this.drawAd();
  }
  // 绘制广告
  drawAd() {
    this.bannerAd = wx.createBannerAd({
      adUnitId: 'adunit-4f0b6ad55f2a8b10',
      style: {
          left: 10,
          top: 0,
          width: this.canvas.width - 20
      }
    });
    this.bannerAd.show()
    this.bannerAd.onResize(res => {
      this.bannerAd.style.top = this.canvas.height - res.height - 10
    })
    // 监听 banner 广告错误事件
    this.bannerAd.onError(err => {
      console.error(err.errMsg)
    });
  }
  // 绘制背景
  drawBackground() {
    // 绘制背景图片
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    // 带有透明度的白色背景
    this.context.fillStyle = '#00000099';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
  // 绘制标签按钮
  drawTabs() {
    // 计算每个标签的宽度，考虑间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    for (let i = 0; i < this.tabs.length; i++) {
      // 计算每个标签的X坐标
      const tabX = 10 + i * (tabWidth + 10);
      const tabY = menuButtonInfo.bottom + 10 * scaleY;
      const tabHeight = 40 * scaleY;
      // 绘制标签背景
      this.context.save();
      this.context.fillStyle = this.selectedIndex === i ? '#fc86bc' : '#fc86bc99';
      this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制标签文本
      this.context.fillStyle = '#000000';
      this.context.font = `bold ${16 * scaleX}px Arial`;
      this.context.textAlign = 'left';
      this.context.textBaseline = 'middle';
      // 计算文本宽度并水平居中
      const textWidth = this.context.measureText(this.tabs[i]).width;
      const textX = tabX + (tabWidth - textWidth) / 2; // 水平居中
      const textY = tabY + tabHeight / 2 + 2 * scaleX;
      this.context.fillText(this.tabs[i], textX, textY);
      this.context.restore();
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    const tabContentY = menuButtonInfo.bottom + 60 * scaleY; // 设置内容区域的Y坐标
    // 计算当前选中标签的位置和宽度
    const tabWidth = this.canvas.width - 20;
    const tabX = 10;
    const fontSize = 16 * scaleX;
    this.context.font = `${fontSize}px Arial`;
    // 绘制选中标签下方的矩形
    this.context.save();
    this.context.fillStyle = '#fc86bc'; // 标签背景颜色
    this.context.strokeStyle = 'black'; // 标签描边颜色
    if (this.selectedIndex === 0) {
      const splitSentence = this.paragraph.split("\n");
      const textHeight = fontSize * 1.2;
      const contentHeight = splitSentence.length * textHeight + 20 * scaleY;
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      const textX = tabX;
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'center';
      for(let i = 0; i < splitSentence.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;  
        this.context.fillText(`${splitSentence[i]}`, textX + tabWidth/2, textY);
      }
      this.context.restore();
    } else if (this.selectedIndex === 1) {
      const iconY = 10 * scaleY;
      const iconHeight = 70 * scaleY;
      const iconWidth = 40 * scaleX;
      const intro = ['姓名：刘逸尘', '年龄：35 岁', '婚龄：7 年', '儿女：1 个']
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      let compareHeight = intro.length * textHeight >= iconHeight ? intro.length * textHeight : iconHeight
      const contentHeight = compareHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制角色图片
      if (this.role.complete) {
        this.context.drawImage(this.role, tabX + 10, tabContentY + iconY, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      for (let i = 0; i < intro.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;  
        this.context.fillText(intro[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    } else if (this.selectedIndex === 2) {
      const iconX = 10 * scaleY;
      const iconHeight = 32 * scaleY;
      const iconWidth = 32 * scaleY;
      const intro = ['名称：瞬移之环', '功效：按下发射键可瞬移至', '圆环所到之处']
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      let compareHeight = intro.length * textHeight >= iconHeight ? intro.length * textHeight : iconHeight
      const contentHeight = compareHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.cycleIcon.complete) {
        this.context.drawImage(this.cycleIcon, tabX + iconX, tabContentY + 10 * scaleY, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      for (let i = 0; i < intro.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;  
        this.context.fillText(intro[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    } else if (this.selectedIndex === 3) {
      const iconX = 10 * scaleY;
      const iconHeight = 32 * scaleY;
      const iconWidth = 32 * scaleY;
      const intro = ['操作：点击操作杆及按钮', '功能：操作主人公的行为和命运']
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      let compareHeight = intro.length * textHeight >= iconHeight ? intro.length * textHeight : iconHeight
      const contentHeight = compareHeight + 20 * scaleY;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.clickIcon.complete) {
        this.context.drawImage(this.clickIcon, tabX + iconX, tabContentY + 10 * scaleY, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      for (let i = 0; i < intro.length; i++) {
        const textY = tabContentY + 10 * scaleY + textHeight * i + fontSize;  
        this.context.fillText(intro[i], tabX + tabWidth - 10 * scaleX, textY);
      }
    }
  }
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制标签按钮
    this.drawTabs();
    // 绘制选中标签的内容
    this.drawTabsContent();
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      return
    }
    // 计算标签的宽度和间距
    const totalSpacing = (this.tabs.length + 1) * 10; // 所有间距的总和，包括两侧边缘
    const tabWidth = (this.canvas.width - totalSpacing) / this.tabs.length;
    const tabY = menuButtonInfo.bottom + 10 * scaleY;
    const tabHeight = 40 * scaleY;
    // 检查是否触摸了标签
    for (let i = 0; i < this.tabs.length; i++) {
      const tabX = 10 + i * (tabWidth + 10);
      // 检查触摸点是否在标签内
      if (touchX >= tabX && touchX <= tabX + tabWidth &&
        touchY >= tabY && touchY <= tabY + tabHeight) {
        // 更新选中的标签索引
        this.selectedIndex = i;
        break;
      }
    }
  }
  // 页面销毁机制
  destroy() {
    this.bannerAd.hide();
    this.bannerAd = '';
    // 清理图像资源
    this.backButton = '';
    this.backgroundImage.src = '';
    this.role.src = '';
    this.cycleIcon.src = '';
    this.clickIcon.src = '';
  }
}