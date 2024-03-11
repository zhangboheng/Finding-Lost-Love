import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
import {
  doPolygonsIntersect,
} from '../../utils/algorithm';
import {
  showBoxMessage
} from '../../utils/dialog';
import SoundManager from '../../utils/soundManager';
import BackgroundMusic from '../../utils/backgroundMusic';
const soundManager = new SoundManager();
const backgroundMusic = new BackgroundMusic();
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Seventh {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 加载背景音乐
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/running.mp3');
    backgroundMusic.playBackgroundMusic();
    // 陆地高度
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.2 + 6 - 35;
    // 道路属性
    this.roadX = 0;
    this.roadWidth = this.canvas.width;
    this.roadSpeed = 2; // 道路每帧移动的像素数
    // 获取音效初始状态
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    // 加载背景图片
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/runningback.jpg';
    this.backgroundX = 0;
    this.backgroundSpeed = this.roadSpeed;
    // 加载道路图片
    this.roadImage = new Image();
    this.roadImage.src = 'image/runningyard.jpg';
    this.roadHeight = this.groundHeight; // 道路的高度
    // 加载陷阱图片
    this.trapImages = [
      'image/woodenbox.png',
      'image/woodenstackbox.png',
      'image/prisonbarrier.png',
      'image/barrier.png',
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    // 陷阱
    this.traps = [];
    this.trapInterval = 48; // 陷阱间的最小间隔
    this.nextTrapAt = this.randomInterval(this.trapInterval, this.trapInterval * 2); // 下一个陷阱的初始位置
    this.trapTimer = 0; // 陷阱生成计时器
    this.trapInterval = 200; // 陷阱生成的间隔（以帧计）
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 刘逸尘属性
    this.isOnGround = true; // 添加地面接触标志
    this.circleX = 35; // 刘逸尘的初始横坐标
    this.circleY = this.canvas.height - this.roadHeight - 70; // 刘逸尘的初始纵坐标
    this.circleRadius = 15; // 刘逸尘的半径
    this.gravity = 0.4; // 重力加速度
    this.jumpHeight = -10; // 跳跃的初始速度
    this.velocityY = 0; // 纵向速度
    this.canDoubleJump = true; // 添加二段跳的标志
    this.heroImages = [];
    for (let i = 0; i <= 2; i++) { // 假设有 n 帧动画
      const img = new Image();
      img.src = `image/right${i+1}.png`;
      this.heroImages.push(img);
    }
    this.currentheroFrame = 0;
    this.heroFrameInterval = 5; // 控制帧切换速度
    this.heroFrameTimer = 0;
    this.heroJumpUpImage = new Image();
    this.heroJumpUpImage.src = 'image/rightjump1.png';
    this.heroJumpDownImage = new Image();
    this.heroJumpDownImage.src = 'image/rightjump2.png';
    this.heroDeadImage = new Image();
    this.heroDeadImage.src = 'image/rightdown.png'
    // 加载脚印图片
    this.heroFootprintImage = new Image();
    this.heroFootprintImage.src = 'image/clock.png';
    // 绘制生命数显示
    this.lifeCount = new Image();
    this.lifeCount.src = 'image/head.png';
    // 记录生命总数
    this.lastLifeCount = null;
    // 绘制终点的图片
    this.endDoorImage = new Image();
    this.endDoorImage.src = 'image/doorbreak.png';
    this.endDoorDistence = 0;
    // 初始化分数
    this.score = 0;
    this.speedIncreasedStageFirst = false; // 标志游戏速度是否已经加快
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
    // 消息提示
    this.speedIncreaseMessage = "Speed+1";
    this.messageDisplayTime = 0; // 消息显示的持续时间（以帧计）
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 加载失败图片
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    this.context.font = '20px Arial'; // 确保设置的字体与绘制时相同
    // 游戏状态
    this.gameOver = false;
    // 游戏通关状态
    this.isLevelCompleted = false;
  }
  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundX, 0, this.backgroundImage.width, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundX < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundX + this.backgroundImage.width, 0, this.backgroundImage.width, this.canvas.height);
      }
    }
  }
  // 更新背景状态
  updateBackground() {
    if (!this.isLevelCompleted) {
      this.backgroundX -= this.backgroundSpeed;
      if (this.backgroundX <= -this.backgroundImage.width) {
        this.backgroundX = 0;
      }
    }
  }
  // 绘制黑色遮罩
  drawBlackScreen() {
    if (this.isScreenDark) {
      this.context.fillStyle = `rgba(0, 0, 0, ${this.screenDarkness * 0.8})`;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  updateDrawBlackScreen() {
    if (this.score == 3000) {
      soundManager.play('break');
    }
    if (this.score >= 3000 && this.score < 3300) {
      this.isScreenDark = true;
      this.screenDarkness = Math.min((this.score - 3000) / (3300 - 3000), 1);
    } else if (this.score >= 3350 && this.score < 3650) {
      this.screenDarkness = Math.max(1 - (this.score - 3350) / (3650 - 3350), 0);
    } else if (this.score >= 3650) {
      this.screenDarkness = 0;
    }
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制关卡显示
  drawAroundNumber() {
    const number = '07';
    const textWidth = this.context.measureText(number).width;
    const startX = this.canvas.width - textWidth - 10;
    const scoreY = menuButtonInfo.bottom + 20; // 分数的y坐标
    // 绘制分数
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(number, startX, scoreY);
    this.context.restore();
  }
  // 绘制生命数
  drawLifeCount() {
    // 记录生命总数
    this.lastLifeCount = wx.getStorageSync('lifeCount');
    const iconSize = 32; // 图标大小
    const iconPadding = 10; // 图标与分数之间的间距
    const startX = 10;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.bottom + 2; // 图标的y坐标
    const scoreY = menuButtonInfo.bottom + 20; // 分数的y坐标
    // 绘制图标
    if (this.lifeCount.complete) {
      this.context.drawImage(this.lifeCount, iconX, iconY, iconSize, iconSize);
    }
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(`X${this.lastLifeCount}`, scoreX, scoreY);
    this.context.restore();
  }
  // 绘制分数
  drawScore() {
    const iconSize = 24; // 图标大小
    const iconPadding = 10; // 图标与分数之间的间距
    const textWidth = this.context.measureText(this.score).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top + 6; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20; // 分数的y坐标
    // 绘制图标
    if (this.heroFootprintImage.complete) {
      this.context.drawImage(this.heroFootprintImage, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(this.score, scoreX, scoreY);
  }
  // 绘制道路
  drawRoad() {
    if (this.roadImage.complete) {
      const roadY = this.canvas.height - this.roadHeight - 10;
      this.context.drawImage(this.roadImage, this.roadX, roadY);
      if (this.roadX < 0) {
        this.context.drawImage(this.roadImage, this.roadX + this.roadWidth, roadY);
      }
    }
  }
  // 更新道路状态
  updateRoad() {
      this.score += this.roadSpeed;
      this.roadX -= this.roadSpeed;
      if (this.roadX <= -this.roadImage.width) {
        this.roadX = 0;
      }
      // 检查分数是否达到3000分，并且尚未加速
      if (this.score >= 3000 && !this.speedIncreasedStageFirst) {
        this.roadSpeed += 1; // 增加道路速度
        this.speedIncreasedStageFirst = true; // 标记已经加速
        this.messageDisplayTime = this.messageDuration;
      }
      // 如果消息正在显示，减少显示时间
      if (this.messageDisplayTime > 0) {
        this.messageDisplayTime--;
      }
  }
  randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // 绘制陷阱位置
  drawTraps() {
    const trapBaseY = this.canvas.height - this.roadHeight
    this.traps.forEach(trap => {
      const trapImg = this.trapImages[trap.imageIndex];
      // 绘制陷阱图片
      if (trapImg.complete) {
        this.context.drawImage(trapImg, trap.x, trapBaseY - trap.height, trap.width, trap.height);
      }
    });
  }
  // 更新陷阱位置
  updateTraps() {
    if (!this.isLevelCompleted) {
      this.roadX -= this.roadSpeed;
      if (this.roadX <= -this.roadWidth) {
        this.roadX = 0;
      }
      this.traps.forEach(trap => {
        trap.x -= this.roadSpeed;
      });
      // 移除已经离开屏幕的陷阱
      this.traps = this.traps.filter(trap => trap.x + trap.width > 0);
      // 根据道路位置和间隔添加新陷阱
      // 更新计时器
      this.trapTimer++;
      // 当计时器达到间隔时，生成新的陷阱
      if (this.trapTimer >= this.trapInterval && this.score <= 5000) {
        const numberOfTraps = Math.floor(Math.random() * 6) + 1;
        let lastTrapX = this.canvas.width;
        for (let i = 0; i < numberOfTraps; i++) {
          // 为每个陷阱计算随机间隔
          const gap = Math.floor(Math.random() * 60) + 150; // 间隔（50到200像素之间）
          lastTrapX += gap;
          const imageIndex = Math.floor(Math.random() * this.trapImages.length);
          const trapImg = this.trapImages[imageIndex];
          // 添加陷阱
          this.traps.push({
            x: lastTrapX,
            imageIndex: imageIndex,
            width: trapImg.width, // 为陷阱设置宽度
            height: trapImg.height // 为陷阱设置高度
          });
        }
        // 重置计时器
        this.trapTimer = 0;
      }
    } else {
      this.traps = []; // 清空陷阱
    }
  }
  // 绘制终点
  drawEndDoor() {
    if(this.endDoorImage.complete){
      this.context.drawImage(this.endDoorImage, 6000 - this.endDoorImage.width - this.endDoorDistence, this.canvas.height - this.roadHeight - this.endDoorImage.height, this.endDoorImage.width, this.endDoorImage.height)
    }
  }
  // 更新终点位置
  updateEndDoor() {
    this.endDoorDistence += this.roadSpeed;
  }
  // 绘制刘逸尘
  drawHero() {
    let heroImg;
    if (this.gameOver && !this.isLevelCompleted) {
        heroImg = this.heroDeadImage
    }else{
      if (!this.isOnGround) { 
        heroImg = this.isJumpingUp ? this.heroJumpUpImage : this.heroJumpDownImage;
      } else {
        heroImg = this.heroImages[this.currentheroFrame];
      }
    }
    if (heroImg.complete) {
      this.gameOver ? this.context.drawImage(heroImg, this.circleX - heroImg.width / 2, this.circleY - heroImg.height / 2) : this.context.drawImage(heroImg, this.circleX - heroImg.width / 2, this.circleY - heroImg.height / 2 - 20);
    }
  }
  // 更新刘逸尘
  updateHero() {
    this.heroFrameTimer++;
    if (this.heroFrameTimer >= this.heroFrameInterval) {
      this.currentheroFrame = (this.currentheroFrame + 1) % this.heroImages.length;
      this.heroFrameTimer = 0;
    }
    if (this.isLevelCompleted) {
      this.circleX += 1;
    }
    this.velocityY += this.gravity;
    this.circleY += this.velocityY;
    // 根据速度判断刘逸尘是在跳起还是在下落
    if (this.velocityY < 0) {
      this.isJumpingUp = true;
    } else if (this.velocityY > 0) {
      this.isJumpingUp = false;
    }
    // 检测与道路的碰撞
    if (this.circleY > this.canvas.height - this.roadHeight - this.circleRadius) {
      this.circleY = this.canvas.height - this.roadHeight - this.circleRadius;
      this.velocityY = 0;
      this.isOnGround = true; // 刘逸尘在地面上
      this.canDoubleJump = true; // 重置二段跳标志
    } else {
      this.isOnGround = false; // 刘逸尘在空中
    }
    const heroPolygon = {
      vertices: [{
          x: this.circleX + 10,
          y: this.circleY
        },
        {
          x: this.circleX - 10,
          y: this.circleY + 10
        },
        {
          x: this.circleX - 10,
          y: this.circleY
        },
        {
          x: this.circleX + 10,
          y: this.circleY + 10
        },
      ]
    };
    // 检测与陷阱的碰撞
    this.traps.forEach(trap => {
      // 创建陷阱的矩形表示
      const trapPolygon = {
        vertices: [{
            x: trap.x,
            y: this.canvas.height - this.roadHeight
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.roadHeight
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.roadHeight - trap.height
          },
          {
            x: trap.x,
            y: this.canvas.height - this.roadHeight - trap.height
          }
        ]
      };
      // 使用SAT检测碰撞
      if (doPolygonsIntersect(heroPolygon, trapPolygon)) {
        this.gameOver = true;
        backgroundMusic.stopBackgroundMusic();
        soundManager.play('crack');
        soundManager.play('lose', 200);
        this.lastLifeCount--
        if (this.lastLifeCount < 0) {
          this.lastLifeCount = 0;
        }
        wx.setStorageSync('lifeCount', this.lastLifeCount)
        if (this.lastLifeCount != 0) {
          this.resetGame();
        }
      }
    });
    // 判断是否与终点碰撞
    if (this.score >= 5900){
      this.gameOver = true;
      this.isLevelCompleted = true;
      backgroundMusic.stopBackgroundMusic();
      soundManager.play('win');
      // 前往下一关卡
      wx.setStorageSync('trailNumber', 7)
      this.game.switchScene(new this.game.begin(this.game));
    }
  }
  // 绘制消息提示
  drawMessageBox() {
    if (this.messageDisplayTime > 0) {
      showBoxMessage(this.context, this.speedIncreaseMessage, this.canvas.width / 2, this.canvas.height / 2);
    }
  }
  // 画面全部绘制
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制生命数
    this.drawLifeCount();
    // 绘制关卡显示
    this.drawAroundNumber();
    // 绘制分数
    this.drawScore();
    // 绘制移动的道路
    this.drawRoad();
    // 绘制移动的陷阱
    this.drawTraps();
    // 绘制终点
    this.drawEndDoor()
    // 绘制刘逸尘
    this.drawHero();
    // 如果消息需要显示
    this.drawMessageBox();
    // 绘制黑色遮罩
    this.drawBlackScreen();
  }
  // 游戏更新事件
  update() {
    if (!this.gameOver) {
      // 更新背景变化
      this.updateBackground();
      // 更新道路变化
      this.updateRoad();
      // 更新陷阱变化
      this.updateTraps();
      // 更新终点位置
      this.updateEndDoor();
      // 更新刘逸尘图片切换
      this.updateHero();
      // 更新黑色遮罩
      this.updateDrawBlackScreen();
    } else {
      if (!this.isLevelCompleted) {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width) / 2, (this.canvas.height - this.failTipsImage.height) / 2 - this.failTipsImage.height / 2);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110);
      }
    }
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      btn.onClick();
      this.gameOver = false;
      // 游戏结束时
      backgroundMusic.stopBackgroundMusic();
      return
    }
    if (this.isLevelCompleted) {
      this.canDoubleJump = false;
      this.isOnGround = false;
    } else {
      if (!this.gameOver) {
        // 二极跳识别
        if ((this.isOnGround || this.canDoubleJump) && this.score <= 5888) {
          this.velocityY = this.jumpHeight;
          if (!this.isOnGround) {
            if (this.canDoubleJump) {
              this.canDoubleJump = false; // 标记二段跳已使用
            }
          }
          soundManager.play('jump');
          this.isOnGround = false; // 刘逸尘起跳，不再在地面上
        }
      }
    }
    if (this.gameOver || this.isLevelCompleted) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        backgroundMusic.stopBackgroundMusic();
        wx.setStorageSync('lifeCount', 2);
        wx.setStorageSync('trailNumber', '');
        this.game.switchScene(new this.game.begin(this.game));
      }
      if (touchX >= this.buttonShareInfo.x && touchX <= this.buttonShareInfo.x + this.buttonShareInfo.width &&
        touchY >= this.buttonShareInfo.y && touchY <= this.buttonShareInfo.y + this.buttonShareInfo.height) {
          wx.shareAppMessage({
            title: '一起寻回我们曾经的美好！',
            imageUrl: 'image/thumbnail.jpg' // 分享图片的路径
        });
      }
    }
  }
  // 游戏重制
  resetGame() {
    // 游戏开始时
    backgroundMusic.playBackgroundMusic()
    this.backgroundX = 0;
    // 重置道路和陷阱位置
    this.roadX = 0;
    this.traps = [];
    // 重置刘逸尘位置和状态
    this.circleX = 35;
    this.circleY = this.canvas.height - this.roadHeight - 70;
    this.velocityY = 0;
    this.gravity = 0.4;
    this.isOnGround = true;
    // 屏幕变黑遮罩
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.gameOver = false;
    // 记录终点回走距离
    this.endDoorDistence = 0;
    // 重置分数
    this.score = 0;
    this.roadSpeed = 2;
    this.messageDisplayTime = 0;
    this.speedIncreasedStageFirst = false;
    this.isLevelCompleted = false;
    // 记录生命总数
    this.lastLifeCount = null;
    // 重置定时
    this.trapTimer = 0;
  }
  // 页面销毁机制
  destroy() {
    // 清理资源，如图片
    this.backButton.image.src = '';
    this.backgroundImage.src = '';
    this.trapImages.forEach(img => img = null);
    this.heroImages.forEach(img => img = null);
    this.roadImage.src = '';
    this.lifeCount.src = '';
    this.heroJumpUpImage.src = '';
    this.heroJumpDownImage.src = '';
    this.heroDeadImage.src = '';
    this.heroFootprintImage.src = '';
    this.endDoorImage.src = '';
    this.failTipsImage.src = '';
  }
}