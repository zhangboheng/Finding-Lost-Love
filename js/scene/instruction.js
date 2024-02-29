import {
  createBackButton
} from '../../utils/button';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Settings {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 初始化触摸位置和滚动偏移量
    this.touchStartY = 0;
    this.scrollOffsetY = 0;
    // 添加触摸事件监听器
    wx.onTouchStart(this.handleTouchStart.bind(this));
    wx.onTouchMove(this.handleTouchMove.bind(this));
    wx.onTouchEnd(this.handleTouchEnd.bind(this));
    // 创建BackgroundMusic实例
    this.backgroundMusic = new BackgroundMusic();
    // 创建SoundManager实例
    this.soundManager = new SoundManager();
    // 绘制背景
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/thumbnail.jpg';
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 定义标签和对应的内容
    this.tabs = ['背景', '角色', '道具', '玩法'];
    this.paragraph = `看到桌上的离婚协议\n刘逸尘的眼眸里满是悔恨\n泪水无声地滑落，落在离婚协议上\n不经意间\n泪水滴落到离婚协议下的旧相片\n相片记录着刘逸尘和徐静宁幸福的时刻\n相片中，两人笑得灿烂而天真\n泪水在照片上留下了晶莹的痕迹\n仿佛是在唤起那段美好的回忆\n在这一瞬间，离婚协议和那张相片\n仿佛成为了时光的交汇点\n刘逸尘不禁沉浸在过去的美好回忆中\n突然间，一种神秘的力量涌现\n刘逸尘被白光吞没\n当他再次睁开眼睛时\n他竟然坐在一张长椅上\n面前，站着一位神秘的白发老人\n老人手持一枚闪烁着微弱光芒的项链\n老人将奖项交到刘逸尘手中\n并告诉他“如果不放弃，还来得及”\n转瞬之间，神秘老人就消失不见\n审视这个项链\n光彩流动，颇为不凡\n而刘逸尘还不知道\n一场寻爱的奇妙之旅就此展开～～`
    // 当前选中的标签索引
    this.selectedIndex = 0;
    // 角色中的图片
    this.role = new Image();
    this.role.src = 'image/front1.png';
    // 道具中的图片
    this.necklace = new Image();
    this.necklace.src = 'image/necklace.png';
    // 玩法中的图片
    this.clickIcon = new Image();
    this.clickIcon.src = 'image/click.png';
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
      const tabHeight = 40;
      const tabY = menuButtonInfo.top + tabHeight;
      // 绘制标签背景
      this.context.fillStyle = this.selectedIndex === i ? '#fc86bc' : '#fc86bc99';
      this.context.fillRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制内容边框
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 3;
      this.context.strokeRect(tabX, tabY, tabWidth, tabHeight);
      // 绘制标签文本
      this.context.fillStyle = '#000000';
      this.context.font = '16px Arial';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillText(this.tabs[i], tabX + tabWidth / 2, tabY + tabHeight / 2 + 2);
    }
  }
  // 绘制选中的标签
  drawTabsContent() {
    const tabContentY = menuButtonInfo.top + 90; // 设置内容区域的Y坐标
    // 计算当前选中标签的位置和宽度
    const tabWidth = this.canvas.width - 20;
    const tabX = 10;
    // 绘制选中标签下方的矩形
    this.context.fillStyle = '#fc86bc'; // 标签背景颜色
    this.context.strokeStyle = 'black'; // 标签描边颜色
    if (this.selectedIndex === 0) {
      const splitSentence = this.paragraph.split("\n");
      const contentHeight = (splitSentence.length * 20 + 16 + tabContentY + tabX >= this.canvas.height - 50 - tabContentY - tabX ? this.canvas.height - 50 - tabContentY : splitSentence.length * 20 + 16);
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 设置剪切区域，确保文本只在矩形内显示
      this.context.save();
      this.context.beginPath();
      this.context.rect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.clip();
      // 绘制音效左侧文字
      const textX = tabX;
      const textY = tabContentY + 20;
      this.context.fillStyle = '#000000';
      this.context.font = `16px Arial`;
      this.context.textAlign = 'center';
      for(let i = 0; i < splitSentence.length; i++) {
        this.context.fillText(`${splitSentence[i]}`, textX + tabWidth/2, textY + i * 20 + this.scrollOffsetY);
      }
      // 恢复原始绘图状态，移除剪切区域
      this.context.restore();
    } else if (this.selectedIndex === 1) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconY = 10;
      const iconHeight = 70;
      const iconWidth = 40;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 32;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制角色图片
      if (this.role.complete) {
        this.context.drawImage(this.role, tabX + 10, tabContentY + iconY + 5, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['姓名：刘逸尘', '年龄：35 岁', '婚龄：7 年', '儿女：1 个']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    } else if (this.selectedIndex === 2) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconX = 10;
      const iconHeight = 32;
      const iconWidth = 32;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 30;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.necklace.complete) {
        this.context.drawImage(this.necklace, tabX + iconX, tabContentY + this.necklace.height / 2, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['名称：时空项链', '功效：关键之匙，开启某些地方']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    } else if (this.selectedIndex === 3) {
      const fontSize = 16;
      this.context.font = `${fontSize}px Arial`;
      const iconX = 10;
      const iconHeight = 32;
      const iconWidth = 32;
      // 计算文本高度和总内容高度
      const textHeight = fontSize * 1.2;
      const contentHeight = iconHeight + 30;
      // 绘制矩形
      this.context.fillStyle = '#fc86bc';
      this.context.strokeStyle = 'black';
      this.context.fillRect(tabX, tabContentY, tabWidth, contentHeight);
      this.context.strokeRect(tabX, tabContentY, tabWidth, contentHeight);
      // 绘制道具图片
      if (this.clickIcon.complete) {
        this.context.drawImage(this.clickIcon, tabX + iconX, tabContentY + this.clickIcon.height / 2, iconWidth, iconHeight);
      }
      // 右侧文本
      this.context.fillStyle = '#000000';
      this.context.textAlign = 'right';
      const textY = tabContentY + 15 + textHeight * 0 + fontSize / 2;
      const intro = ['操作：点击屏幕及选项', '功能：操作主人公的行为和命运']
      for(let i = 0; i < intro.length; i++) {
        this.context.fillText(intro[i], tabX + tabWidth - 10, textY + i * 20);
      }
    }
  }
  draw() {
    // 清除整个画布
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    const tabHeight = 50;
    const tabY = menuButtonInfo.top + tabHeight;
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
  // 记录触摸开始的位置
  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }
  // 计算触摸移动的距离并更新滚动偏移量
  handleTouchMove(e) {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - this.touchStartY;
    if (deltaY < 0) {
      this.scrollOffsetY += deltaY;
      this.touchStartY = touchY;
    }
  }
  // 触摸结束，可以在这里添加额外的逻辑
  handleTouchEnd(e) {
    this.scrollOffsetY = 0;
  }
  // 页面销毁机制
  destroy() {
    // 移除触摸事件监听器
    wx.offTouchStart(this.handleTouchStart.bind(this));
    wx.offTouchMove(this.handleTouchMove.bind(this));
    wx.offTouchEnd(this.handleTouchEnd.bind(this));
    // 重置状态
    this.scrollOffsetY = 0;
    this.selectedTabIndex = 0;
    // 清理图像资源
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
  }
  // 管理音效状态
  toggleMusic() {
    const currentMusicState = this.soundManager.getMusicState();
    this.soundManager.setMusicState(!currentMusicState);
  }
  // 管理背景音乐状态
  toggleBackgroundMusic() {
    const currentMusicState = this.backgroundMusic.getBackgroundMusicState();
    this.backgroundMusic.setBackgroundMusicState(!currentMusicState);
  }
}