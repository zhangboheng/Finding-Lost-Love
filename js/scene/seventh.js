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
import {
  soundManager,
  backgroundMusic,
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Prison {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/running.mp3');
    backgroundMusic.playBackgroundMusic();
    soundManager.setMusicState(wx.getStorageSync('musicEnabled'));
    /* 加载音乐音效管理器结束 */
    /* 加载广告初始化开始 */
    this.interstitialAd = null;
    if (wx.createInterstitialAd){
      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-54ab1612689b4dc7'
      })
    }
    /* 加载广告初始化结束 */
    /* 图片加载区域开始 */
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'image/runningback.jpg';
    this.backButton = '';
    this.roadImage = new Image();
    this.roadImage.src = 'image/runningyard.jpg';
    this.lifeCount = new Image();
    this.lifeCount.src = 'image/head.png';
    this.trapImages = [
      'image/woodenbox.png',
      'image/cobblestone.png',
      'image/barrier.png',
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.heroImages = [];
    for (let i = 0; i <= 2; i++) { // 假设有 n 帧动画
      const img = new Image();
      img.src = `image/right${i+1}.png`;
      this.heroImages.push(img);
    }
    this.heroJumpUpImage = new Image();
    this.heroJumpUpImage.src = 'image/rightjump1.png';
    this.heroJumpDownImage = new Image();
    this.heroJumpDownImage.src = 'image/rightjump2.png';
    this.heroDeadImage = new Image();
    this.heroDeadImage.src = 'image/rightdown.png';
    this.heroFootprintImage = new Image();
    this.heroFootprintImage.src = 'image/clock.png';
    this.endDoorImage = new Image();
    this.endDoorImage.src = 'image/doorbreak.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域结束 */
    /* 常量设置区域开始 */
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.3;
    // 道路属性
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    // 背景属性
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    // 刘逸尘属性
    this.heroInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 40 * scaleX,
      height: 70 * scaleY,
      gravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    // 陷阱属性
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    this.endDoorStatue = {
      x: 6100 * scaleX,
      y: this.canvas.height - this.groundHeight - 64 * scaleY,
      width: 64 * scaleX,
      height: 64 * scaleY,
      distence: 0,
    }
    // 记录生命数
    this.lastLifeCount = null;
    // 记录倒计时时间
    this.clockDownTime = 90;
    // 只运行一次
    this.runLimit = 1;
    // 初始化分数
    this.score = 0;
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.speedIncreaseMessage = "Speed+1";
    this.messageDisplayTime = 0;
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 终点显现速度
    this.endSpeed = 0;
    // 游戏状态
    this.gameOver = false;
    // 游戏通关状态
    this.isLevelCompleted = false;
    this.context.font = `${20 * scaleX}px Arial`;
    /* 常量设置区域结束 */
  }
  // 绘制背景
  drawBackground() {
    if (this.backgroundImage.complete) {
      this.context.drawImage(this.backgroundImage, this.backgroundInfo.x, 0, this.backgroundImage.width * scaleX, this.canvas.height);
      // 绘制第二张图片以实现循环滚动效果
      if (this.backgroundInfo.x < 0) {
        this.context.drawImage(this.backgroundImage, this.backgroundInfo.x + this.backgroundImage.width * scaleX, 0, this.backgroundImage.width * scaleX, this.canvas.height);
      }
    }
  }
  // 更新背景状态
  updateBackground() {
    if (!this.isLevelCompleted) {
      this.backgroundInfo.x -= this.backgroundInfo.speed;
      if (this.backgroundInfo.x <= -this.backgroundImage.width * scaleX) {
        this.backgroundInfo.x = 0;
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
  // 更新黑色遮罩
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
    this.backButton = createBackButton(this.context, (this.canvas.width - 32) / 2, this.canvas.height * 0.9, 'image/return.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y, 32 * scaleY, 32 * scaleY);
    }
  }
  // 绘制关卡显示
  drawAroundNumber() {
    const number = '07';
    const textWidth = this.context.measureText(number).width;
    const startX = this.canvas.width - textWidth - 10 * scaleX;
    const scoreY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
    // 绘制分数
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(number, startX, scoreY);
    this.context.restore();
  }
  // 绘制倒计时
  startCountdown() {
    const iconSize = 24 * scaleY; // 图标大小
    const iconPadding = 10 * scaleX; // 图标与分数之间的间距
    // 计算分数文本的宽度
    const textWidth = this.context.measureText(this.clockDownTime.toString().padStart(2, '0')).width;
    // 计算总宽度（图标宽度 + 间距 + 文本宽度）
    const totalWidth = iconSize + iconPadding + textWidth;
    // 计算起始 x 坐标，使图标和分数组合居中
    const startX = (this.canvas.width - totalWidth) / 2;
    const iconX = startX;
    const clockDownX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top + 6 * scaleY; // 图标的y坐标
    const clockDownY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
    // 绘制图标
    if (this.heroFootprintImage.complete) {
      this.context.drawImage(this.heroFootprintImage, iconX, iconY, iconSize, iconSize);
    }
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(`${this.clockDownTime.toString().padStart(2, '0')}`, clockDownX, clockDownY);
    this.context.restore();
  }
  // 绘制道路
  drawRoad() {
    if (this.roadImage.complete) {
      this.context.drawImage(this.roadImage, this.road.x, this.road.y);
      if (this.road.x < 0) {
        this.context.drawImage(this.roadImage, this.road.x + this.road.width, this.road.y);
      }
    }
  }
  // 更新道路状态
  updateRoad() {
    this.score += this.road.speed / scaleX;
    this.road.x -= this.road.speed;
    if (this.road.x <= -this.roadImage.width * scaleX) {
      this.road.x = 0;
    }
    // 检查分数是否达到3000分，并且尚未加速
    if (this.score >= 3000 && !this.speedIncreasedStageFirst) {
      this.road.speed += 1 * scaleX; // 增加道路速度
      this.speedIncreasedStageFirst = true; // 标记已经加速
      this.messageDisplayTime = this.messageDuration;
    }
    // 如果消息正在显示，减少显示时间
    if (this.messageDisplayTime > 0) {
      this.messageDisplayTime--;
    }
  }
  // 绘制生命数
  drawLifeCount() {
    // 记录生命总数
    this.lastLifeCount = wx.getStorageSync('lifeCount');
    const iconSize = 32 * scaleY; // 图标大小
    const iconPadding = 10 * scaleX; // 图标与分数之间的间距
    // 计算分数文本的宽度
    const startX = 10;
    const iconX = startX;
    const scoreX = iconX + iconSize + iconPadding;
    const iconY = menuButtonInfo.top + 2 * scaleY; // 图标的y坐标
    const scoreY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
    // 绘制图标
    if (this.lifeCount.complete) {
      this.context.drawImage(this.lifeCount, iconX, iconY, iconSize, iconSize);
    }
    // 绘制分数
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(`X${this.lastLifeCount}`, scoreX, scoreY);
    this.context.restore();
  }
  // 绘制陷阱位置
  drawTraps() {
    this.trapInfo.list.forEach(trap => {
      const trapImg = this.trapImages[trap.imageIndex];
      // 绘制陷阱图片
      if (trapImg.complete) {
        this.context.drawImage(trapImg, trap.x, trap.y - trap.height + 5 * scaleY, trap.width, trap.height);
      }
    });
  }
  // 更新陷阱位置
  updateTraps() {
    if (!this.isLevelCompleted) {
      this.road.x -= this.road.speed;
      if (this.road.x <= -this.road.width) {
        this.road.x = 0;
      }
      this.trapInfo.list.forEach(trap => {
        trap.x -= this.road.speed;
      });
      // 移除已经离开屏幕的陷阱
      this.trapInfo.list = this.trapInfo.list.filter(trap => trap.x + trap.width > 0);
      // 根据道路位置和间隔添加新陷阱
      // 更新计时器
      this.trapInfo.trapTimer++;
      // 当计时器达到间隔时，生成新的陷阱
      if (this.trapInfo.trapTimer >= this.trapInfo.trapInterval && this.score <= 5000) {
        const numberOfTraps = Math.floor(Math.random() * 4) + 1;
        let lastTrapX = this.canvas.width;
        for (let i = 0; i < numberOfTraps; i++) {
          // 为每个陷阱计算随机间隔
          const gap = Math.floor(Math.random() * 90 * scaleX) + 150 * scaleX; // 间隔（50到200像素之间）
          lastTrapX += gap;
          const imageIndex = Math.floor(Math.random() * this.trapImages.length);
          const trapImg = this.trapImages[imageIndex];
          // 添加陷阱
          this.trapInfo.list.push({
            x: lastTrapX,
            y: this.canvas.height - this.groundHeight,
            imageIndex: imageIndex,
            width: 32 * scaleX, // 为陷阱设置宽度
            height: (trapImg.height / 8) * scaleY // 为陷阱设置高度
          });
        }
        // 重置计时器
        this.trapInfo.trapTimer = 0;
      }
    } else {
      this.trapInfo.list = []; // 清空陷阱
    }
  }
  // 绘制刘逸尘
  drawDino() {
    let dinoImg;
    if (this.gameOver) {
      if (this.isLevelCompleted) {
        if (!this.heroInfo.isOnGround) {
          dinoImg = this.isJumpingUp ? this.heroJumpUpImage : this.heroJumpDownImage;
        } else {
          dinoImg = this.heroImages[this.heroInfo.currentDinoFrame];
        }
      } else {
        dinoImg = this.heroDeadImage
      };
    } else {
      if (!this.heroInfo.isOnGround) {
        dinoImg = this.isJumpingUp ? this.heroJumpUpImage : this.heroJumpDownImage;
      } else {
        dinoImg = this.heroImages[this.heroInfo.currentDinoFrame];
      }
    }
    if (dinoImg.complete) {
      if (this.gameOver && !this.isLevelCompleted) {
        this.context.drawImage(dinoImg, this.heroInfo.x, this.heroInfo.y + 20 * scaleY, this.heroInfo.width, this.heroInfo.height)
      } else {
        this.context.drawImage(dinoImg, this.heroInfo.x, this.heroInfo.y - 20 * scaleY, this.heroInfo.width, this.heroInfo.height)
      }
    }
  }
  // 更新小恐龙
  updateDino() {
    this.heroInfo.dinoFrameTimer++;
    if (this.heroInfo.dinoFrameTimer >= this.heroInfo.dinoFrameInterval) {
      this.heroInfo.currentDinoFrame = (this.heroInfo.currentDinoFrame + 1) % this.heroImages.length;
      this.heroInfo.dinoFrameTimer = 0;
    }
    if (this.isLevelCompleted) {
      this.heroInfo.x += 1 * scaleX;
    }
    this.heroInfo.velocityY += this.heroInfo.gravity;
    this.heroInfo.y += this.heroInfo.velocityY;
    // 根据速度判断小恐龙是在跳起还是在下落
    if (this.heroInfo.velocityY < 0) {
      this.isJumpingUp = true;
    } else if (this.heroInfo.velocityY > 0) {
      this.isJumpingUp = false;
    }
    // 检测与道路的碰撞
    if (this.heroInfo.y >= this.road.y - this.heroInfo.height / 2 - 5 * scaleY) {
      this.heroInfo.y = this.road.y - this.heroInfo.height / 2 - 5 * scaleY;
      this.heroInfo.velocityY = 0;
      this.heroInfo.isOnGround = true; // 小恐龙在地面上
      this.heroInfo.canDoubleJump = true; // 重置二段跳标志
    } else {
      this.heroInfo.isOnGround = false; // 小恐龙在空中
    }
    const dinoPolygon = {
      vertices: [{
          x: this.heroInfo.x + this.heroInfo.width * 3 / 4,
          y: this.heroInfo.y
        },
        {
          x: this.heroInfo.x + this.heroInfo.width / 4,
          y: this.heroInfo.y
        },
        {
          x: this.heroInfo.x + this.heroInfo.width / 4,
          y: this.heroInfo.y + this.heroInfo.height * 3 / 4
        },
        {
          x: this.heroInfo.x + this.heroInfo.width * 3 / 4,
          y: this.heroInfo.y + this.heroInfo.height * 3 / 4
        },
      ]
    };
    // 检测与陷阱的碰撞
    this.trapInfo.list.forEach(trap => {
      // 创建陷阱的矩形表示
      const trapPolygon = {
        vertices: [{
            x: trap.x,
            y: this.canvas.height - this.road.height
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.road.height
          },
          {
            x: trap.x + trap.width,
            y: this.canvas.height - this.road.height - trap.height
          },
          {
            x: trap.x,
            y: this.canvas.height - this.road.height - trap.height
          }
        ]
      };
      // 使用SAT检测碰撞
      if (doPolygonsIntersect(dinoPolygon, trapPolygon)) {
        clearInterval(this.clearSetInterval);
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
    if (this.heroInfo.x <= this.endDoorStatue.x + this.endDoorStatue.width * 2 / 3 - this.endDoorStatue.distence && this.heroInfo.x + this.heroInfo.width >= this.endDoorStatue.x + this.endDoorStatue.width / 3 - this.endDoorStatue.distence && this.heroInfo.y <= this.endDoorStatue.y + this.endDoorStatue.height * 2 / 3 && this.heroInfo.y + this.heroInfo.height >= this.endDoorStatue.y + this.endDoorStatue.height / 3) {
      clearInterval(this.clearSetInterval);
      this.gameWin = true;
      soundManager.play('win');
      backgroundMusic.stopBackgroundMusic();
      // 前往下一关卡
      wx.setStorageSync('trailNumber', 7)
      this.game.switchScene(new this.game.playground(this.game));
    } else {
      this.gameWin = false;
    }
  }
  // 绘制终点
  drawEndDoor() {
    if (this.endDoorImage.complete) {
      this.context.drawImage(this.endDoorImage, this.endDoorStatue.x - this.endDoorStatue.distence, this.endDoorStatue.y, this.endDoorStatue.width, this.endDoorStatue.height)
    }
  }
  // 更新终点位置
  updateEndDoor() {
    this.endDoorStatue.distence += this.road.speed;
  }
  // 绘制消息提示
  drawMessageBox() {
    if (this.messageDisplayTime > 0) {
      showBoxMessage(this.context, this.speedIncreaseMessage, this.canvas.width / 2, this.canvas.height / 2, '#fc86bc', 'black', 16 * scaleX);
    }
  }
  // 画面全部绘制
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制返回按钮
    this.drawBack();
    // 绘制分数
    this.startCountdown();
    // 绘制生命数
    this.drawLifeCount();
    // 绘制移动的道路
    this.drawRoad();
    // 绘制移动的陷阱
    this.drawTraps();
    // 绘制终点
    this.drawEndDoor();
    // 绘制刘逸尘
    this.drawDino();
    // 绘制关卡显示
    this.drawAroundNumber();
    // 如果消息需要显示
    this.drawMessageBox();
    // 绘制黑色遮罩
    this.drawBlackScreen();
  }
  // 游戏更新事件
  update() {
    let self = this;
    if (!this.gameOver) {
      // 更新背景变化
      this.updateBackground();
      // 更新道路变化
      this.updateRoad();
      // 更新陷阱变化
      this.updateTraps();
      // 更新小恐龙图片切换
      this.updateDino();
      // 更新终点位置
      this.updateEndDoor();
      // 更新黑色遮罩
      this.updateDrawBlackScreen();
      // 更新倒计时运行
      if (this.runLimit >= 1) {
        this.runLimit--;
        this.clearSetInterval = setInterval(function () {
          self.countdownFunc();
        }, 1000);
      }
    } else {
      if (!this.isLevelCompleted) {
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      }
    }
  }
  // 倒计时运行函数
  countdownFunc() {
    if (this.clockDownTime > 0) {
      this.clockDownTime--;
    } else {
      // 游戏结束
      clearInterval(this.clearSetInterval);
      this.gameOver = true;
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
  }
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    if (touchX >= btn.x && touchX <= btn.x + btn.width &&
      touchY >= btn.y && touchY <= btn.y + btn.height) {
      clearInterval(this.clearSetInterval);
      this.gameOver = true;
      backgroundMusic.stopBackgroundMusic();
      if (this.lastLifeCount == 0) {
        wx.setStorageSync('lifeCount', 2);
        wx.setStorageSync('trailNumber', '')
      }
      btn.onClick();
      return
    }
    if (this.isLevelCompleted) {
      this.heroInfo.canDoubleJump = false;
      this.heroInfo.isOnGround = false;
    } else {
      if (!this.gameOver && this.score <= 6000) {
        // 二极跳识别
        if (this.heroInfo.isOnGround || this.heroInfo.canDoubleJump) {
          this.heroInfo.velocityY = this.heroInfo.jumpHeight;
          if (!this.heroInfo.isOnGround) {
            if (this.heroInfo.canDoubleJump) {
              this.heroInfo.canDoubleJump = false; // 标记二段跳已使用
            }
          }
          soundManager.play('jump');
          this.heroInfo.isOnGround = false; // 小恐龙起跳，不再在地面上
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
        if (this.interstitialAd) {
          this.interstitialAd.show().catch((err) => {
            console.error('插屏广告显示失败', err)
          })
        }
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
    backgroundMusic.playBackgroundMusic();
    this.backButton = '';
    // 道路属性
    this.road = {
      x: 0,
      y: this.canvas.height - this.groundHeight,
      width: this.canvas.width,
      height: this.groundHeight,
      speed: 2 * scaleX
    }
    // 背景属性
    this.backgroundInfo = {
      x: 0,
      speed: this.road.speed
    }
    // 刘逸尘属性
    this.heroInfo = {
      x: 10 * scaleX,
      y: this.canvas.height - this.groundHeight,
      width: 40 * scaleX,
      height: 70 * scaleY,
      gravity: 0.4 * scaleY,
      jumpHeight: -10 * scaleY,
      velocityY: 0,
      isOnGround: true,
      canDoubleJump: true,
      currentDinoFrame: 0,
      dinoFrameInterval: 5,
      dinoFrameTimer: 0,
      groundY: 0, // 视角追踪Y坐标
    }
    // 陷阱属性
    this.trapInfo = {
      list: [],
      trapTimer: 0,
      trapInterval: 200,
    }
    this.endDoorStatue = {
      x: 6100 * scaleX,
      y: this.canvas.height - this.groundHeight - 64 * scaleY,
      width: 64 * scaleX,
      height: 64 * scaleY,
      distence: 0,
    }
    // 记录生命数
    this.lastLifeCount = null;
    // 记录倒计时时间
    this.clockDownTime = 90;
    // 只运行一次
    this.runLimit = 1;
    // 初始化分数
    this.score = 0;
    // 屏幕变黑遮照标志
    this.screenDarkness = 0;
    this.isScreenDark = false;
    this.speedIncreasedStageFirst = false;
    this.messageDisplayTime = 0;
    this.messageDuration = 30;
    // 重新开始按钮
    this.buttonStartInfo = "";
    // 分享好友按钮
    this.buttonShareInfo = "";
    // 终点显现速度
    this.endSpeed = 0;
    this.gameOver = false;
    this.isLevelCompleted = false;
  }
  // 页面销毁机制
  destroy() {
    this.backButton = '';
    this.backgroundImage.src = '';
    this.lifeCount.src = '';
    this.roadImage.src = '';
    this.trapImages.forEach(img => img = null);
    this.heroImages.forEach(img => img = null);
    this.heroJumpUpImage.src = '';
    this.heroJumpDownImage.src = '';
    this.heroDeadImage.src = '';
    this.heroFootprintImage.src = '';
    this.endDoorImage.src = '';
    this.failTipsImage.src = '';
  }
}