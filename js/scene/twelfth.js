import {
  createBackButton,
  drawIconButton
} from '../../utils/button';
import {
  soundManager,
  backgroundMusic,
  menuButtonInfo,
  scaleX,
  scaleY
} from '../../utils/global';
export default class Twelfth {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    /* 加载音乐音效管理器开始 */
    backgroundMusic.setBackgroundMusicState(wx.getStorageSync('backgroundMusicEnabled'));
    backgroundMusic.setBackgroundMusicSource('audio/cinemaback.mp3');
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
    /* 常量设置区域开始 */
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    this.groundHeightChange = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    this.character = {
      width: 20 * scaleX,
      height: 35 * scaleY,
      x: 35 * scaleX,
      y: this.groundHeight,
      speed: 1 * scaleX, // 人物每次移动的距离
      leftFrames: [], // 存储向左帧图片的数组
      rightFrames: [], // 存储向右帧图片的数组
      leftJumpFrames: [], // 存储向左弹跳图片的数组
      rightJumpFrames: [], // 存储向右弹跳图片的数组
      leftShotFrames: [], // 存储向左发射图片的数组
      rightShotFrames: [], // 存储向右发射图片的数据
      leftDown: [], // 存储向左死掉的图片数组
      rightDown: [], // 存储向右死掉的图片数组
      currentLeftFrameIndex: 0,
      currentRightFrameIndex: 0,
      currentLeftShotIndex: 0,
      currentRightShotIndex: 0,
      theLastAction: '', // 按钮停下后最后一个动作
      jumping: false,
      jumpStartY: 0,
      jumpStartTime: 0,
      jumpHeight: 35 * scaleY, // 跳跃高度
      gravity: 0.3, // 重力
      jumpSpeed: -10 * scaleY, // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
      isFall: false, // 是否处于掉落状态
      moveX: 0,
    };
    this.cycleInfo = {
      cycleX: 0,
      cycleAddHeight: 0,
      cycleAddDistence: 0,
      speed: 2 * scaleX,
      angle: 0,
      direction: ''
    }
    this.endDoorStatue = {
      x: 0,
      y: 0,
      width: 64 * scaleY,
      height: 64 * scaleY,
      endDoorShow: false,
      velocityY: 0,
      gravity: 0.3,
    }
    this.transportInfo = {
      x: this.canvas.width - 64 * scaleY,
      y: this.groundHeight + 10 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: true
    }
    this.transportSecondInfo = {
      x: -20 * scaleX,
      y: menuButtonInfo.bottom + 60 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: false,
      direction: 1
    }
    this.cycleWaveInfo = {
      x: this.canvas.width - 32 * scaleY,
      y: this.groundHeight - 50 * scaleY,
      width: 16 * scaleY,
      height: 16 * scaleY,
      show: false,
      circleAngle: 0
    }
    this.gearInfo = {
      x: (this.canvas.width - 32 * scaleX) * 2,
      y: this.groundHeight,
      width: 32 * scaleY,
      height: 32 * scaleY,
      statue: 'left',
      sound: false
    }
    this.gearSecondInfo = {
      x: -32 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.06 - 105 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      velocityY: 0,
      direction: 1,
      gearStatue: 'left',
      gearSound: false,
      melt: false,
    }
    this.fireInfo = {
      x: this.canvas.width / 2 + 40 * scaleX,
      y: this.groundHeight - 75 * scaleY,
      width: 125 * scaleY,
      height: 125 * scaleY,
      framePath: [],
      show: true,
      currentIndex: 0
    }
    this.airplaneInfo = {
      x: this.canvas.width * 3 / 2 - 100 * scaleX,
      y: this.groundHeight - 24 * scaleY,
      width: 54 * scaleX,
      height: 34 * scaleY,
      airplaneRotation: 0,
      velocityY: 0,
      launch: false,
      launchOff: 1,
      show: true
    }
    this.ropeInfo = {
      startX: 0,
      startY: this.groundHeight - this.canvas.height * 0.06 - 50 * scaleY,
      endX: this.canvas.width,
      endY: this.groundHeight - this.canvas.height * 0.06 - 50 * scaleY,
      controlX: this.canvas.width / 2,
      controlY: this.groundHeight - this.canvas.height * 0.06 - 30 * scaleY,
      color: '#333',
      width: 5,
      break: false,
    }
    this.unicycleInfo = {
      x: -32 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.06 - 73 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      velocityY: 0,
      direction: 1 // 1 为向右，-1 为向左
    }
    this.bossInfo = {
      x: this.canvas.width * 2,
      y: menuButtonInfo.bottom + 60 * scaleY,
      initialY: menuButtonInfo.bottom + 60 * scaleY,
      width: 128 * scaleY,
      height: 128 * scaleY,
      wingFrame: [],
      bodyFrame: [],
      shotFrame: [],
      currentIndex: 0,
      currentBodyIndex: 0,
      currentShotIndex: 0,
      shotCount: 0,
      floatDirection: 1, // 初始向上浮动，-1 为向下浮动
      isShot: false,
      bossFollowRange: 20,
      maxHealth: 100, // 最大血量
      currentHealth: 100, // 当前血量
      isDead: false, // 是否已死亡
    }
    this.lightShotInfo = {
      x: this.canvas.width * 2,
      y: this.groundHeight,
      width: 128 * scaleY,
      height: 128 * scaleY,
      angle: 0,
      show: false,
    }
    this.lastLifeCount = null;
    this.clockDownTime = 90;
    this.runLimit = 1;
    this.particles = [];
    this.particlesShow = false;
    this.pressingDirection = null;
    this.gameOver = false;
    this.gameWin = false;
    this.buttonStartInfo = "";
    this.buttonShareInfo = "";
    this.context.font = `${20 * scaleX}px Arial`;
    this.clearSetInterval = '';
    /* 常量设置区域结束 */
    /* 图片加载区域开始 */
    this.gameBackground = new Image();
    this.gameBackground.src = 'image/amusementleft.jpg';
    this.backButton = '';
    this.gameBackgroundRight = new Image();
    this.gameBackgroundRight.src = 'image/amusementright.jpg';
    this.yardImage = new Image();
    this.yardImage.src = 'image/restaurantyard.jpg';
    const framePathsRight = ['image/right1.png', 'image/right1.png', 'image/right2.png', 'image/right2.png', 'image/right3.png', 'image/right3.png'];
    for (const path of framePathsRight) {
      const frame = new Image();
      frame.src = path;
      this.character.rightFrames.push(frame);
    }
    const framePathsLeft = ['image/left1.png', 'image/left1.png', 'image/left2.png', 'image/left2.png', 'image/left3.png', 'image/left3.png'];
    for (const path of framePathsLeft) {
      const frame = new Image();
      frame.src = path;
      this.character.leftFrames.push(frame);
    }
    const framePathsRightJump = ['image/rightjump1.png', 'image/rightjump2.png'];
    for (const path of framePathsRightJump) {
      const frame = new Image();
      frame.src = path;
      this.character.rightJumpFrames.push(frame);
    }
    const framePathsLeftJump = ['image/leftjump1.png', 'image/leftjump2.png'];
    for (const path of framePathsLeftJump) {
      const frame = new Image();
      frame.src = path;
      this.character.leftJumpFrames.push(frame);
    }
    const framePathsRightShot = ['image/shot1.png', 'image/shot2.png'];
    for (const path of framePathsRightShot) {
      const frame = new Image();
      frame.src = path;
      this.character.rightShotFrames.push(frame);
    }
    const framePathsLeftShot = ['image/shot3.png', 'image/shot4.png'];
    for (const path of framePathsLeftShot) {
      const frame = new Image();
      frame.src = path;
      this.character.leftShotFrames.push(frame);
    }
    const framePathsRightDead = ['image/rightdown.png'];
    for (const path of framePathsRightDead) {
      const frame = new Image();
      frame.src = path;
      this.character.rightDown.push(frame);
    }
    const framePathsLeftDead = ['image/leftdown.png'];
    for (const path of framePathsLeftDead) {
      const frame = new Image();
      frame.src = path;
      this.character.leftDown.push(frame);
    }
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png';
    this.endDoorImage = new Image();
    this.endDoorImage.src = 'image/doorover.png';
    this.transport = new Image();
    this.transport.src = 'image/transport.png';
    this.leftGear = new Image();
    this.leftGear.src = 'image/joystickleft.png';
    this.rightGear = new Image();
    this.rightGear.src = 'image/joystickright.png';
    this.iceGear = new Image();
    this.iceGear.src = 'image/icegear.png';
    this.baseImage = new Image();
    this.baseImage.src = 'image/base.png';
    this.airplane = new Image();
    this.airplane.src = 'image/rocket.png';
    const framePathsFire = ['image/fire01.png', 'image/fire01.png', 'image/fire01.png', 'image/fire01.png', 'image/fire02.png', 'image/fire02.png', 'image/fire02.png', 'image/fire02.png', 'image/fire03.png', 'image/fire03.png', 'image/fire03.png', 'image/fire03.png', 'image/fire04.png', 'image/fire04.png', 'image/fire04.png', 'image/fire04.png', 'image/fire05.png', 'image/fire05.png', 'image/fire05.png', 'image/fire05.png', 'image/fire06.png', 'image/fire06.png', 'image/fire06.png', 'image/fire06.png', 'image/fire07.png', 'image/fire07.png', 'image/fire07.png', 'image/fire07.png'];
    for (const path of framePathsFire) {
      const frame = new Image();
      frame.src = path;
      this.fireInfo.framePath.push(frame);
    }
    this.unicycleImage = new Image();
    this.unicycleImage.src = 'image/unicycle.png';
    this.lifeCount = new Image();
    this.lifeCount.src = 'image/head.png';
    this.clockDown = new Image();
    this.clockDown.src = 'image/clock.png';
    // 翅膀图片集锦
    const framePathsWing = ['image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png'];
    for (const path of framePathsWing) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.wingFrame.push(frame);
    }
    // 身体图片集锦
    const bodyPathsBody = ['image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png'];
    for (const path of bodyPathsBody) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.bodyFrame.push(frame);
    }
    // 发射图片集锦
    const bodyPathsShot = ['image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png'];
    for (const path of bodyPathsShot) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.shotFrame.push(frame);
    }
    this.lightShot = new Image();
    this.lightShot.src = 'image/tornado.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域结束 */
    /* 事件处理监听绑定开始 */
    wx.onTouchStart(this.touchStartHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
    /* 事件处理监听绑定结束 */
  }
  // 绘制背景
  drawBackground() {
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
    const number = '12';
    const textWidth = this.context.measureText(number).width;
    const startX = this.canvas.width - textWidth - 10;
    const scoreY = menuButtonInfo.top + 20 * scaleY; // 分数的y坐标
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
    if (this.clockDown.complete) {
      this.context.drawImage(this.clockDown, iconX, iconY, iconSize, iconSize);
    }
    this.context.save();
    this.context.fillStyle = '#ffffff99';
    this.context.textAlign = 'left'; // 文本左对齐
    this.context.textBaseline = 'middle';
    this.context.fillText(`${this.clockDownTime.toString().padStart(2, '0')}`, clockDownX, clockDownY);
    this.context.restore();
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
  // 绘制游戏背景
  drawGameBackground() {
    if (this.gameBackground.complete) {
      this.context.drawImage(this.gameBackground, this.character.moveX, 0, this.canvas.width, this.canvas.height * 0.6)
    }
    if (this.gameBackgroundRight.complete) {
      this.context.drawImage(this.gameBackgroundRight, this.canvas.width + this.character.moveX, 0, this.canvas.width, this.canvas.height * 0.6)
    }
  }
  // 更新游戏背景
  updateGameBackground() {
    this.character.moveX = -this.character.x + 35 * scaleX;
    if (this.character.moveX >= 0) {
      this.character.moveX = 0;
    }
  }
  // 绘制陆地
  drawYard() {
    if (this.yardImage.complete) {
      this.context.drawImage(this.yardImage, this.character.moveX, menuButtonInfo.bottom + this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.1)
      this.context.drawImage(this.yardImage, this.canvas.width + this.character.moveX, menuButtonInfo.bottom + this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.1)
    }
  }
  // 绘制魔法阵
  drawTransport() {
    if (this.gearSecondInfo.gearStatue == 'right') {
      if (this.transport.complete && this.transportInfo.show) {
        this.context.drawImage(this.transport, this.transportInfo.x + this.character.moveX, this.transportInfo.y - this.transportInfo.height / 2, this.transportInfo.width, this.transportInfo.height);
      }
      if (this.transport.complete && this.transportSecondInfo.show) {
        this.context.save();
        this.context.translate(this.transportSecondInfo.x + this.transportSecondInfo.width / 2 + this.character.moveX, this.transportSecondInfo.y + this.transportSecondInfo.height / 2);
        this.context.rotate(Math.PI / 2);
        this.context.translate(-(this.transportSecondInfo.x + this.transportSecondInfo.width / 2) + this.character.moveX, -(this.transportSecondInfo.y + this.transportSecondInfo.height / 2));
        this.context.drawImage(this.transport, this.transportSecondInfo.x, this.transportSecondInfo.y - this.transportSecondInfo.height / 2, this.transportSecondInfo.width, this.transportSecondInfo.height);
        this.context.restore();
      }
    }
  }
  // 在函数中更新平台的位置
  updateTransport() {
    if (this.transportSecondInfo.show) {
      const platformSpeed = 0.5; // 平台移动速度
      this.transportSecondInfo.y += platformSpeed * scaleX * this.transportSecondInfo.direction;
      if (this.transportSecondInfo.y < menuButtonInfo.bottom + 60 * scaleY || this.transportSecondInfo.y > this.groundHeight - this.canvas.height * 0.06 + 10 * scaleY) {
        this.transportSecondInfo.direction *= -1;
      }
    }
  }
  // 绘制循环提示
  drawCycleWaveTips() {
    if (this.gearSecondInfo.gearStatue == 'right' && this.cycleWaveInfo.show) {
      if (this.cycleImage.complete) {
        this.context.save();
        this.context.globalAlpha = 0.5;
        this.context.translate(this.cycleWaveInfo.x + this.character.moveX, this.cycleWaveInfo.y);
        this.context.rotate(this.cycleWaveInfo.circleAngle);
        this.context.drawImage(this.cycleImage, -this.cycleWaveInfo.width / 2, -this.cycleWaveInfo.height / 2, this.cycleWaveInfo.width, this.cycleWaveInfo.height);
        this.context.restore();
        // 增加角度以实现旋转
        this.cycleWaveInfo.circleAngle += 0.02;
      }
    }
  }
  // 绘制绳索
  drawRope() {
    if (!this.ropeInfo.break) {
      this.context.save();
      this.context.strokeStyle = this.ropeInfo.color; // 绳子颜色
      this.context.lineWidth = this.ropeInfo.width; // 绳子宽度
      // 开始绘制路径
      this.context.beginPath();
      // 移动到起始点
      this.context.moveTo(this.ropeInfo.startX, this.ropeInfo.startY);
      // 绘制二次贝塞尔曲线
      this.context.quadraticCurveTo(this.unicycleInfo.x, this.ropeInfo.controlY, this.ropeInfo.endX, this.ropeInfo.endY);
      // 绘制路径
      this.context.stroke();
      // 关闭路径
      this.context.closePath();
      this.context.restore();
    }
  }
  // 更新绳索
  updateRope() {
    // 如果绳索和火箭碰撞后，绳索断裂
    if (this.airplaneInfo.y <= this.ropeInfo.startY) {
      this.ropeInfo.break = true;
    }
  }
  // 绘制独轮车
  drawUnicycle() {
    if (this.unicycleImage.complete) {
      this.context.drawImage(this.unicycleImage, this.unicycleInfo.x + this.character.moveX, this.unicycleInfo.y, this.unicycleInfo.width, this.unicycleInfo.height);
    }
  }
  // 更新独轮车
  updateUnicycle() {
    if (!this.ropeInfo.break) {
      if (this.unicycleInfo.direction == 1 && this.unicycleInfo.x <= this.canvas.width * 2 + 32 * scaleX) {
        this.unicycleInfo.x += this.character.speed;
      } else if (this.unicycleInfo.direction == 1) {
        this.unicycleInfo.direction = -1;
      }
      if (this.unicycleInfo.direction == -1 && this.unicycleInfo.x >= -32 * scaleX) {
        this.unicycleInfo.x -= this.character.speed;
      } else if (this.unicycleInfo.direction == -1) {
        this.unicycleInfo.direction = 1;
      }
    } else {
      if (this.unicycleInfo.y >= this.groundHeight + 35 * scaleY) {
        this.unicycleInfo.y = this.groundHeight + 35 * scaleY;
      } else {
        this.unicycleInfo.velocityY += 0.3;
        this.unicycleInfo.y += this.unicycleInfo.velocityY;
      }
    }
  }
  // 绘制火焰
  drawFire() {
    this.context.drawImage(this.fireInfo.framePath[this.fireInfo.currentIndex], this.fireInfo.x + this.character.moveX, this.fireInfo.y, this.fireInfo.width, this.fireInfo.height)
  }
  // 更新火焰
  updateFire() {
    this.fireInfo.currentIndex = (this.fireInfo.currentIndex + 1) % this.fireInfo.framePath.length;
    if (this.particlesShow) {
      if (this.fireInfo.height > 0) {
        this.fireInfo.y++;
        this.fireInfo.height--
      }
      if (this.fireInfo.width > 0) {
        this.fireInfo.width--;
      }
    }
  }
  // 绘制降雪
  createParticle() {
    if (this.particlesShow) {
      const fountainWidth = this.canvas.width * 2 + 20 * scaleX; // 降雪的宽度
      const numParticles = 3; // 每帧生成的粒子数量
      const gradient = this.context.createLinearGradient(this.canvas.width / 2, this.groundHeight, this.canvas.width / 2, 0);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)'); // 底部颜色，白色
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // 顶部颜色，透明
      for (let i = 0; i < numParticles; i++) {
        const particle = {
          x: this.canvas.width / 2 + (Math.random() - 0.5) * fountainWidth, // 在降雪宽度范围内随机分布
          y: 0,
          size: Math.random() * 10 + 0.2, // 粒子的大小
          speedY: Math.random() * -10 - 0.5, // 粒子的垂直速度
          speedX: Math.random() * 4 - 2, // 粒子的水平速度
          gradient: gradient // 渐变色
        };
        this.particles.push(particle);
      }
    }
  }
  // 更新降雪
  updateParticles() {
    if (this.particlesShow) {
      const thresholdY = this.groundHeight + 30 * scaleY; // 阈值，超过该值粒子消失
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];
        // 更新粒子位置
        particle.x += particle.speedX;
        if (particle.y <= this.groundHeight + 29 * scaleY) {
          particle.y -= particle.speedY;
        }
        // 绘制粒子
        this.context.fillStyle = particle.gradient;
        this.context.beginPath(); // 开始路径绘制
        this.context.arc(particle.x + this.character.moveX, particle.y, particle.size / 2, 0, Math.PI * 2); // 绘制圆形
        this.context.fill(); // 填充颜色
        // 移除已超出画布的粒子
        if (particle.y >= thresholdY || particle.x <= 0 || particle.x > this.canvas.width * 2 + 20 * scaleX) {
          this.particles.splice(i, 6);
          i--;
        }
      }
    }
  }
  // 绘制机关
  drawGear() {
    if (this.gearInfo.statue == 'left') {
      if (this.leftGear.complete) {
        this.context.save();
        this.context.translate(this.gearInfo.x + this.character.moveX, this.gearInfo.y);
        this.context.rotate(-Math.PI / 2);
        this.context.drawImage(this.leftGear, -this.gearInfo.width / 2, -this.gearInfo.height / 2, this.gearInfo.width, this.gearInfo.height);
        this.context.restore();
      }
    } else {
      if (this.rightGear.complete) {
        this.context.save();
        this.context.translate(this.gearInfo.x + this.character.moveX, this.gearInfo.y);
        this.context.rotate(-Math.PI / 2);
        this.context.drawImage(this.rightGear, -this.gearInfo.width / 2, -this.gearInfo.height / 2, this.gearInfo.width, this.gearInfo.height);
        this.context.restore();
      }
    }
  }
  // 绘制第二个机关
  drawSecondGear() {
    if (this.gearSecondInfo.gearStatue == 'left') {
      if (this.leftGear.complete) {
        this.context.drawImage(this.leftGear, this.gearSecondInfo.x + this.character.moveX, this.gearSecondInfo.y, this.gearSecondInfo.width,  32 * scaleY);
      }
    } else {
      if (this.rightGear.complete) {
        this.context.drawImage(this.rightGear, this.gearSecondInfo.x + this.character.moveX, this.gearSecondInfo.y, this.gearSecondInfo.width, 32 * scaleY);
      }
    }
    if (this.iceGear.complete) {
      this.context.drawImage(this.iceGear, this.gearSecondInfo.x + this.character.moveX, this.gearSecondInfo.y, this.gearSecondInfo.width, this.gearSecondInfo.height);
    }
  }
  // 更新第二个机关
  updateSecondGear() {
    if (!this.ropeInfo.break) {
      if (this.gearSecondInfo.direction == 1 && this.gearSecondInfo.x <= this.canvas.width * 2 + 32 * scaleX) {
        this.gearSecondInfo.x += this.character.speed;
      } else if (this.gearSecondInfo.direction == 1) {
        this.gearSecondInfo.direction = -1;
      }
      if (this.gearSecondInfo.direction == -1 && this.gearSecondInfo.x >= -32 * scaleX) {
        this.gearSecondInfo.x -= this.character.speed;
      } else if (this.gearSecondInfo.direction == -1) {
        this.gearSecondInfo.direction = 1;
      }
    } else {
      if (this.gearSecondInfo.y >= this.groundHeight + 3 * scaleY) {
        this.gearSecondInfo.y = this.groundHeight + 3 * scaleY;
      } else {
        this.gearSecondInfo.velocityY += 0.3;
        this.gearSecondInfo.y += this.gearSecondInfo.velocityY;
      }
    }
    // 第二个机关和火焰碰撞则消失
    if (this.gearSecondInfo.x <= this.fireInfo.x + this.fireInfo.width - 10 * scaleX && this.gearSecondInfo.x + this.gearSecondInfo.width >= this.fireInfo.x + 10 * scaleX && this.gearSecondInfo.y <= this.fireInfo.y + this.fireInfo.height && this.gearSecondInfo.y + this.gearSecondInfo.height >= this.fireInfo.y) {
      this.gearSecondInfo.height -= 1 * scaleY;
      this.gearSecondInfo.melt = true;
    }
    if (this.gearSecondInfo.height <= 0) {
      this.gearSecondInfo.height = 0;
    }
  }
  // 绘制飞机基座
  drawBase() {
    if (this.baseImage.complete) {
      this.context.drawImage(this.baseImage, (this.canvas.width * 3 / 2 - this.baseImage.width * scaleX * 2 - 10 * scaleX) + this.character.moveX, this.groundHeight + this.baseImage.height * scaleY + 21 * scaleY, this.baseImage.width * scaleX, this.baseImage.height * scaleY)
    }
  }
  // 绘制飞机的主体
  drawAirplane() {
    if (this.airplane.complete && this.airplaneInfo.show) {
      this.context.save();
      this.context.translate(this.airplaneInfo.x + this.character.moveX + this.airplaneInfo.width / 2, this.airplaneInfo.y + this.airplaneInfo.height / 2);
      this.context.rotate(this.airplaneInfo.airplaneRotation);
      this.context.drawImage(this.airplane, -this.airplaneInfo.width / 2, -this.airplaneInfo.height / 2, this.airplaneInfo.width, this.airplaneInfo.height);
      this.context.restore();
    }
  }
  // 更新飞机的主体
  updateAirplane() {
    if (this.airplaneInfo.launch && this.airplaneInfo.show) {
      this.airplaneInfo.velocityY -= this.character.speed;
      this.airplaneInfo.y += this.airplaneInfo.velocityY;
      if (this.airplaneInfo.launchOff >= 1) {
        soundManager.play('launch');
        this.airplaneInfo.launchOff--;
      }
      if (this.airplaneInfo.y <= -2500 * scaleY) {
        soundManager.play('boom');
        this.airplaneInfo.show = false;
        this.particlesShow = true;
      }
    }
  }
  // 绘制人物
  drawCharacter() {
    let characterImg;
    if (this.character.theLastAction == 'right' || this.character.theLastAction == '') {
      if (this.character.isShot) {
        characterImg = this.character.rightShotFrames[this.character.currentRightShotIndex]
      } else {
        if (this.character.isOnGround) {
          characterImg = this.character.rightFrames[this.character.currentRightFrameIndex];
        } else {
          if (this.gameOver) {
            characterImg = this.character.rightDown[0];
          } else {
            characterImg = this.character.gravity > 0 ? this.character.rightJumpFrames[0] : this.character.rightJumpFrames[1];
          }
        }
      }
      this.context.drawImage(characterImg, this.character.x, this.character.y, this.character.width, this.character.height);
    } else if (this.character.theLastAction == 'left') {
      if (this.character.isShot) {
        characterImg = this.character.leftShotFrames[this.character.currentLeftShotIndex]
      } else {
        if (this.character.isOnGround) {
          characterImg = this.character.leftFrames[this.character.currentLeftFrameIndex];
        } else {
          if (this.gameOver) {
            characterImg = this.character.leftDown[0];
          } else {
            characterImg = this.character.gravity > 0 ? this.character.leftJumpFrames[0] : this.character.leftJumpFrames[1];
          }
        }
      }
      this.context.drawImage(characterImg, this.character.x, this.character.y, this.character.width, this.character.height);
    }
  }
  // 更新绘制人物
  updateCharacter() {
    // 记录人物之前的位置
    if (this.pressingDirection == 'right' && !this.character.isFall) {
      this.moveRightCharacter();
    } else if (this.pressingDirection == 'left' && !this.character.isFall) {
      this.moveLeftCharacter();
    }
    // 判断是否处于跳跃
    if (this.character.jumping) {
      if (this.groundHeight - this.character.y > this.character.jumpHeight) {
        this.character.gravity = -0.3;
      }
      this.character.velocityY -= this.character.gravity;
      this.character.y += this.character.velocityY;
      // 如果达到地面，结束跳跃
      if (this.character.y >= this.character.jumpStartY && !this.character.isOnGround) {
        this.character.jumping = false;
        this.character.isOnGround = true;
        this.character.y = this.groundHeight;
        this.character.velocityY = 0;
        this.character.jumpStartY = 0;
        this.character.jumpHeight = this.canvas.height * 0.06;
      }
    }
    // 判断是否与火焰碰撞
    if (this.character.x + this.character.width >= this.fireInfo.x + 10 * scaleX + this.character.moveX && this.character.x <= this.fireInfo.x - 10 * scaleX + this.fireInfo.width + this.character.moveX && this.character.y + this.character.height >= this.fireInfo.y && this.character.y <= this.fireInfo.y + this.fireInfo.height && this.fireInfo.show) {
      // 游戏结束
      clearInterval(this.clearSetInterval);
      this.gameOver = true;
      this.character.isOnGround = false;
      this.character.y = this.character.y + 20
      soundManager.play('crack');
      soundManager.play('lose', 200);
      this.lastLifeCount--
      if (this.lastLifeCount < 0) {
        this.lastLifeCount = 0;
      }
      wx.setStorageSync('lifeCount', this.lastLifeCount)
      if (this.lastLifeCount == 0) {
        this.stopAction();
      } else {
        this.resetGame();
        this.stopAction();
      }
    }
    // 判断是否与第一个机关碰撞
    if (this.character.x + this.character.width >= this.gearInfo.x + this.character.moveX && this.character.x <= this.gearInfo.x + this.gearInfo.width + this.character.moveX && this.character.y + this.character.height >= this.gearInfo.y && (Math.round(this.airplaneInfo.airplaneRotation / (Math.PI / 2) % 4) == -3 || Math.round(this.airplaneInfo.airplaneRotation / (Math.PI / 2) % 4) == 1)) {
      this.gearInfo.statue = 'right';
      if (!this.gearInfo.sound) {
        soundManager.play('gear');
        this.gearInfo.sound = true;
      }
      //火箭飞升开启
      this.airplaneInfo.launch = true;
    }
    // 判断是否与第二个机关碰撞
    if (this.ropeInfo.break && this.gearSecondInfo.melt && this.character.x <= this.gearSecondInfo.x + this.gearSecondInfo.width + this.character.moveX && this.character.x + this.character.width >= this.gearSecondInfo.x + this.character.moveX && this.character.y <= this.gearSecondInfo.y + 32 * scaleY && this.character.y + this.character.height >= this.gearSecondInfo.y) {
      this.gearSecondInfo.gearStatue = 'right';
      if (!this.gearSecondInfo.gearSound) {
        soundManager.play('gear');
        backgroundMusic.setBackgroundMusicSource('audio/phone.mp3');
        backgroundMusic.playBackgroundMusic();
        this.gearSecondInfo.gearSound = true;
      }
    }
    // 判断是否和魔法阵碰撞
    if (this.gearSecondInfo.gearStatue == 'right' && this.character.x + this.character.width >= this.canvas.width - 64 * scaleX + this.character.moveX && this.character.y >= this.transportInfo.y - 20 * scaleY) {
      this.cycleWaveInfo.show = true;
      this.transportSecondInfo.show = true;
    }
    // 判断是否和龙卷风碰撞
    if (this.character.x <= this.lightShotInfo.x + this.lightShotInfo.width - 20 * scaleX + this.character.moveX && this.character.x + this.character.width >= this.lightShotInfo.x + 20 * scaleX + this.character.moveX && this.character.y <= this.lightShotInfo.y + this.lightShotInfo.height - 20 * scaleY && this.character.y + this.character.height >= this.lightShotInfo.y && this.lightShotInfo.show) {
      // 游戏结束
      clearInterval(this.clearSetInterval);
      this.gameOver = true;
      this.character.isOnGround = false;
      this.character.y = this.character.y + 20 * scaleY
      soundManager.play('crack');
      soundManager.play('lose', 200);
      this.lastLifeCount--
      if (this.lastLifeCount < 0) {
        this.lastLifeCount = 0;
      }
      wx.setStorageSync('lifeCount', this.lastLifeCount)
      if (this.lastLifeCount == 0) {
        this.stopAction();
      } else {
        this.resetGame();
        this.stopAction();
      }
    }
    // 判断是否和终点碰撞检测
    if (this.character.x <= this.endDoorStatue.x + this.endDoorStatue.width - 10 * scaleX + this.character.moveX && this.character.x + this.character.width >= this.endDoorStatue.x + 10 * scaleX + this.character.moveX && this.character.y <= this.endDoorStatue.y + this.endDoorStatue.height / 2 && this.character.y + this.character.height >= this.endDoorStatue.y && this.bossInfo.isDead) {
      clearInterval(this.clearSetInterval);
      this.gameWin = true;
      backgroundMusic.stopBackgroundMusic();
      // 前往下一关卡
      wx.setStorageSync('trailNumber', 12)
      this.game.switchScene(new this.game.ending(this.game));
    } else {
      this.gameWin = false;
    }
  }
  // 绘制血量槽
  drawHealthBar() {
    if (!this.bossInfo.isDead) {
      const barWidth = 100 * scaleX; // 血量槽宽度
      const barHeight = 10 * scaleY; // 血量槽高度
      const posX = this.bossInfo.x + 20 * scaleX; // 血量槽左上角 x 坐标
      const posY = this.bossInfo.y; // 血量槽左上角 y 坐标
      const healthPercentage = this.bossInfo.currentHealth / this.bossInfo.maxHealth; // 血量百分比
      // 绘制血量槽背景
      this.context.fillStyle = 'gray';
      this.context.fillRect(posX, posY, barWidth, barHeight);
      // 绘制血量槽
      this.context.fillStyle = 'red';
      this.context.fillRect(posX, posY, barWidth * healthPercentage, barHeight);
    }
  }
  // 更新血量
  updateHealth() {
    if (!this.bossInfo.isDead) {
      if (this.bossInfo.currentHealth <= 0) {
        this.bossInfo.isDead = true; // 标记 Boss 为死亡状态
        this.endDoorStatue.endDoorShow = true;
      }
    }
  }
  // 绘制身体
  drawBossBody() {
    if (!this.bossInfo.isDead) {
      if (!this.bossInfo.isShot) {
        this.context.drawImage(this.bossInfo.bodyFrame[this.bossInfo.currentBodyIndex], this.bossInfo.x, this.bossInfo.y, this.bossInfo.width, this.bossInfo.height);
      } else {
        this.context.drawImage(this.bossInfo.shotFrame[this.bossInfo.currentShotIndex], this.bossInfo.x, this.bossInfo.y, this.bossInfo.width, this.bossInfo.height);
      }
    }
  }
  // 更新身体
  updateBossBody() {
    if (this.cycleWaveInfo.show && !this.bossInfo.isDead) {
      // 控制 boss 的浮动方向
      const floatSpeed = 0.1 * scaleY; // 浮动速度
      const floatRange = 20 * scaleY; // 浮动范围
      this.bossInfo.y += this.bossInfo.floatDirection * floatSpeed;
      // 检查是否达到浮动范围的上限或下限，如果是则改变浮动方向
      if (this.bossInfo.y <= this.bossInfo.initialY - floatRange || this.bossInfo.y >= this.bossInfo.initialY + floatRange) {
        this.bossInfo.floatDirection *= -1; // 改变浮动方向
      }
      // 计算 boss 和主人公之间的距离
      const distance = Math.abs(this.bossInfo.x - this.character.x); // 如果距离小于某个阈值，表示 boss 跟随主人公
      if (distance > this.bossInfo.bossFollowRange) {
        // boss 向主人公移动
        if (this.bossInfo.x < this.character.x) {
          this.bossInfo.x += this.character.speed * 2;
        } else if (this.bossInfo.x > this.character.x) {
          this.bossInfo.x -= this.character.speed * 2;
        }
      }
      // 控制 boss 攻击姿态
      if (this.clockDownTime % 6 == 0) {
        this.bossInfo.isShot = true;
        this.lightShotInfo.show = true;
      }
      if (!this.bossInfo.isShot) {
        this.bossInfo.currentBodyIndex = (this.bossInfo.currentBodyIndex + 1) % this.bossInfo.bodyFrame.length;
      } else {
        if (this.bossInfo.shotCount < this.bossInfo.shotFrame.length) {
          this.bossInfo.currentShotIndex = (this.bossInfo.currentShotIndex + 1) % this.bossInfo.shotFrame.length;
          this.bossInfo.shotCount++; // 增加计数器
        } else {
          this.bossInfo.isShot = false;
          this.bossInfo.shotCount = 0;
        }
      }
    }
  }
  // 绘制翅膀
  drawWing() {
    if (!this.bossInfo.isDead) {
      this.context.drawImage(this.bossInfo.wingFrame[this.bossInfo.currentIndex], this.bossInfo.x, this.bossInfo.y, this.bossInfo.width, this.bossInfo.height);
    }
  }
  // 更新翅膀
  updateWing() {
    if (this.cycleWaveInfo.show && !this.bossInfo.isDead) {
      this.bossInfo.currentIndex = (this.bossInfo.currentIndex + 1) % this.bossInfo.wingFrame.length;
    }
  }
  // 绘制冲击波
  drawCycleWave() {
    if (this.character.shotWave){
      if(this.cycleInfo.direction == 'right'){
        if(this.cycleImage.complete){
          this.context.save();
          this.context.translate(this.cycleInfo.cycleX + 18 * scaleX + this.cycleInfo.cycleAddDistence, this.cycleInfo.cycleAddHeight + 8 * scaleY);
          this.context.rotate(this.cycleInfo.angle);
          this.context.drawImage(this.cycleImage, -8 * scaleY, -8 * scaleY, 16 * scaleY, 16 * scaleY);
          this.context.restore();
          // 增加角度以实现旋转
          this.cycleInfo.angle += 0.05;
        }
      }else if(this.cycleInfo.direction == 'left'){
        if(this.cycleImage.complete){
          this.context.save();
          this.context.translate(this.cycleInfo.cycleX - 18 * scaleX + this.cycleInfo.cycleAddDistence, this.cycleInfo.cycleAddHeight + 8 * scaleY);
          this.context.rotate(this.cycleInfo.angle);
          this.context.drawImage(this.cycleImage, -8 * scaleY, -8 * scaleY, 16 * scaleY, 16 * scaleY);
          this.context.restore();
          // 增加角度以实现旋转
          this.cycleInfo.angle += 0.05;
        }
      }
    }
  }
  // 更新冲击波
  updateCycleWave() {
    if (this.character.shotWave) {
      if (this.cycleInfo.direction == 'right') {
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence >= this.canvas.width - 20 * scaleX) {
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.cycleInfo.angle = 0;
          this.cycleInfo.direction = '';
        } else {
          this.cycleInfo.cycleAddDistence += this.cycleInfo.speed;
        }
        // 如果冲击波和火箭碰撞检测
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence >= this.airplaneInfo.x + this.character.moveX && this.cycleInfo.cycleX <= this.airplaneInfo.x + this.airplaneInfo.width + this.character.moveX && this.cycleInfo.cycleAddHeight + 16 * scaleY >= this.airplaneInfo.y && this.cycleInfo.cycleAddHeight <= this.airplaneInfo.y + this.airplaneInfo.height) {
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
          this.airplaneInfo.airplaneRotation -= Math.PI / 2;
        }
        // 如果冲击波和 boss 碰撞检测
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence >= this.bossInfo.x + this.bossInfo.width / 3 && this.cycleInfo.cycleX <= this.bossInfo.x + this.bossInfo.width / 3 && this.cycleInfo.cycleAddHeight + 16 * scaleY >= this.bossInfo.y && this.cycleInfo.cycleAddHeight <= this.bossInfo.y + this.bossInfo.height - 30 * scaleY && this.cycleWaveInfo.show && !this.bossInfo.isDead) {
          this.bossInfo.currentHealth -= 25;
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
        }
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence > this.transportInfo.x + this.character.moveX && this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence < this.transportInfo.x + this.transportInfo.width + this.character.moveX && this.cycleInfo.cycleAddHeight > this.transportInfo.y - 40 * scaleY && this.cycleWaveInfo.show) {
          this.cycleInfo.cycleAddHeight = this.transportSecondInfo.y + 24 * scaleY;
          this.cycleInfo.cycleX = this.transportSecondInfo.x;
          this.cycleInfo.cycleAddDistence = 20 * scaleX;
          this.cycleInfo.cycleAddDistence += this.cycleInfo.speed;
        }
      } else if (this.cycleInfo.direction == 'left') {
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence <= 20 * scaleX) {
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.cycleInfo.angle = 0;
          this.cycleInfo.direction = '';
        } else {
          this.cycleInfo.cycleAddDistence -= this.cycleInfo.speed;
        }
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence <= this.airplaneInfo.x + this.airplaneInfo.width + this.character.moveX && this.cycleInfo.cycleX >= this.airplaneInfo.x + this.character.moveX && this.cycleInfo.cycleAddHeight + 16 * scaleY >= this.airplaneInfo.y && this.cycleInfo.cycleAddHeight <= this.airplaneInfo.y + this.airplaneInfo.height) {
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
          this.airplaneInfo.airplaneRotation += Math.PI / 2;
        }
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence >= this.bossInfo.x + this.bossInfo.width / 3 && this.cycleInfo.cycleX <= this.bossInfo.x + this.bossInfo.width / 3 && this.cycleInfo.cycleAddHeight + 16 * scaleY >= this.bossInfo.y && this.cycleInfo.cycleAddHeight <= this.bossInfo.y + this.bossInfo.height - 30 * scaleY && this.cycleWaveInfo.show && !this.bossInfo.isDead) {
          this.bossInfo.currentHealth -= 25;
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
        }
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence < this.transportInfo.x + this.transportInfo.width + this.character.moveX && this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence > this.transportInfo.x + this.character.moveX && this.cycleInfo.cycleAddHeight > this.transportInfo.y - 40 * scaleY && this.cycleWaveInfo.show) {
          this.cycleInfo.direction = 'right';
          this.cycleInfo.cycleAddHeight = this.transportSecondInfo.y + 24 * scaleY;
          this.cycleInfo.cycleX = this.transportSecondInfo.x;
          this.cycleInfo.cycleAddDistence = 20 * scaleX;
          this.cycleInfo.cycleAddDistence -= this.cycleInfo.speed;
        }
      }
    }
  }
  // 绘制终点
  drawEndDoor() {
    if (this.endDoorStatue.endDoorShow) {
      this.context.drawImage(this.endDoorImage, this.endDoorStatue.x + this.character.moveX, this.endDoorStatue.y, this.endDoorStatue.width, this.endDoorStatue.height)
    }
  }
  // 更新终点
  updateEndDoor() {
    if (!this.bossInfo.isDead) {
      this.endDoorStatue.x = this.bossInfo.x;
      this.endDoorStatue.y = this.bossInfo.y;
    }else{
      if (this.endDoorStatue.endDoorShow) {
        if (this.endDoorStatue.y <= this.groundHeight - this.endDoorStatue.height / 2) {
          this.endDoorStatue.velocityY += 0.3;
          this.endDoorStatue.y += this.endDoorStatue.velocityY;
        }
      }
    }
  }
  // 绘制发射波
  drawTornado() {
    if (this.lightShot.complete && this.lightShotInfo.show) {
      this.context.save();
      this.context.translate(this.lightShotInfo.x + this.character.moveX + this.lightShotInfo.width / 2, this.lightShotInfo.y);
      this.context.rotate(this.lightShotInfo.angle);
      this.context.drawImage(this.lightShot, -this.lightShotInfo.width / 2, -this.lightShotInfo.height / 2, this.lightShotInfo.width, this.lightShotInfo.height);
      this.context.restore();
      // 增加角度以实现旋转
      this.lightShotInfo.angle += 0.05;
    }
  }
  // 更新发射波
  updateTornado() {
    if (this.lightShotInfo.show) {
      this.lightShotInfo.x -= this.character.speed;
      if (this.lightShotInfo.x <= -128 * scaleX) {
        this.lightShotInfo.show = false;
        this.lightShotInfo.x = this.canvas.width * 2;
      }
    }
  }
  // 绘制手柄
  drawJoystick() {
    // 计算手柄位置和大小（这里简化为固定值，你可以根据实际需要调整）
    const joystickSize = Math.min(this.canvas.width, this.canvas.height) * 0.2;
    const joystickY = this.canvas.height * 0.85;
    // 绘制方向键（矩形）
    const arrowSize = joystickSize * 0.5;
    // 绘制方向键（D-Pad）
    const padSize = joystickSize * 0.6;
    const buttonSize = padSize;
    this.context.save();
    // 上方向键
    this.drawRectangle(10 + arrowSize * 4 / 3, joystickY - padSize / 2 - buttonSize, buttonSize, 'up');
    // 下方向键
    this.drawRectangle(10 + arrowSize * 4 / 3, joystickY + padSize / 2, buttonSize, 'down');
    // 左方向键
    this.drawRectangle(10, joystickY - buttonSize / 2, buttonSize, 'left');
    // 右方向键
    this.drawRectangle(10 + arrowSize * 8 / 3, joystickY - buttonSize / 2, buttonSize, 'right');
    // 绘制跳跃键
    this.drawRectangle(menuButtonInfo.right - buttonSize, joystickY - padSize / 2 - buttonSize / 2, buttonSize, 'jump');
    // 绘制发射键
    this.drawRectangle(menuButtonInfo.right - buttonSize * 2.5, joystickY - padSize / 2 + buttonSize / 2, buttonSize, 'shot');
    this.context.restore();
  }
  // 绘制带箭头的按钮（方向键）
  drawRectangle(x, y, size, direction) {
    const arrowSize = size / 2; // 箭头的大小
    // 绘制黑色边框
    this.context.strokeStyle = '#ffffff99';
    this.context.lineWidth = 3;
    this.context.beginPath();
    this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    this.context.stroke();
    // 绘制按钮内部
    if (direction == 'up' || direction == 'down' || direction == 'left' || direction == 'right') {
      this.context.fillStyle = '#ffffff77';
      this.context.beginPath();
      this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      this.context.fill();
    } else if (direction == 'jump') {
      this.context.fillStyle = '#ffffff77';
      this.context.beginPath();
      this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      this.context.fill();
    } else if (direction == 'shot') {
      this.context.fillStyle = '#ffffff77';
      this.context.beginPath();
      this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      this.context.fill();
    }
    // 绘制箭头
    this.context.fillStyle = '#000000';
    this.context.beginPath();
    // 绘制文字
    this.context.fillStyle = '#000000';
    this.context.font = `${Math.min(this.canvas.width, this.canvas.height) * 0.06}px Arial`;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    switch (direction) {
      case 'up':
        this.context.moveTo(x + size / 2 - arrowSize / 2, y + size / 2 + arrowSize / 2);
        this.context.lineTo(x + size / 2 + arrowSize / 2, y + size / 2 + arrowSize / 2);
        this.context.lineTo(x + size / 2, y + size / 2 - arrowSize * 3 / 4);
        break;
      case 'down':
        this.context.moveTo(x + size / 2 - arrowSize / 2, y + size / 2 - arrowSize / 2);
        this.context.lineTo(x + size / 2 + arrowSize / 2, y + size / 2 - arrowSize / 2);
        this.context.lineTo(x + size / 2, y + size / 2 + arrowSize * 3 / 4);
        break;
      case 'left':
        this.context.moveTo(x + size / 2 + arrowSize / 2, y + size / 2 - arrowSize / 2);
        this.context.lineTo(x + size / 2 - arrowSize * 3 / 4, y + size / 2);
        this.context.lineTo(x + size / 2 + arrowSize / 2, y + size / 2 + arrowSize / 2);
        break;
      case 'right':
        this.context.moveTo(x + size / 2 - arrowSize / 2, y + size / 2 - arrowSize / 2);
        this.context.lineTo(x + size / 2 + arrowSize * 3 / 4, y + size / 2);
        this.context.lineTo(x + size / 2 - arrowSize / 2, y + size / 2 + arrowSize / 2);
        break;
      case 'jump':
        this.context.fillText('J', x + size / 2, y + size / 2 + 2 * scaleY);
        break;
      case 'shot':
        this.context.fillText('S', x + size / 2, y + size / 2 + 2 * scaleY);
        break;
    }
    this.context.closePath();
    this.context.fill();
  }
  // 绘制行为
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制游戏背景
    this.drawGameBackground();
    // 绘制独轮车
    this.drawUnicycle();
    // 绘制陆地
    this.drawYard();
    // 绘制循环提示
    this.drawCycleWaveTips();
    // 绘制魔法阵
    this.drawTransport();
    // 绘制绳索
    this.drawRope();
    // 绘制火焰
    this.drawFire();
    // 绘制降雪
    this.createParticle();
    // 绘制机关
    this.drawGear();
    // 绘制第二个机关
    this.drawSecondGear();
    // 绘制飞机基座
    this.drawBase();
    // 绘制飞机的主体
    this.drawAirplane();
    // 绘制翅膀
    this.drawWing();
    // 绘制血量槽
    this.drawHealthBar();
    // 绘制身体
    this.drawBossBody();
    // 绘制冲击波
    this.drawCycleWave();
    // 绘制终点
    this.drawEndDoor();
    // 绘制人物
    this.drawCharacter();
    // 绘制发射波
    this.drawTornado();
    // 绘制移动按钮所在区域
    this.drawJoystick();
    // 绘制返回按钮
    this.drawBack();
    // 绘制关卡显示
    this.drawAroundNumber();
    // 绘制生命数
    this.drawLifeCount();
    // 绘制倒计时
    this.startCountdown();
  }
  update() {
    // 当游戏结束时无返回值
    if (this.gameOver || this.gameWin) {
      backgroundMusic.stopBackgroundMusic();
      if(this.lastLifeCount == 0){
        if (this.failTipsImage.complete) {
          this.context.drawImage(this.failTipsImage, (this.canvas.width - this.failTipsImage.width * scaleX) / 2, (this.canvas.height - this.failTipsImage.height * scaleY) / 2 - this.failTipsImage.height * scaleY / 2, this.failTipsImage.width * scaleX, this.failTipsImage.height * scaleY);
        }
        this.buttonStartInfo = drawIconButton(this.context, "重新开始", this.canvas.width / 2, this.canvas.height / 2 + 40 * scaleY);
        this.buttonShareInfo = drawIconButton(this.context, "分享好友", this.canvas.width / 2, this.canvas.height / 2 + 110 * scaleY);
      }
    } else {
      let self = this;
      // 更新游戏背景
      this.updateGameBackground();
      // 更新冲击波
      this.updateCycleWave();
      // 更新绳索
      this.updateRope();
      // 更新独轮车
      this.updateUnicycle();
      // 更新第二个机关
      this.updateSecondGear();
      // 更新血量
      this.updateHealth();
      // 更新身体
      this.updateBossBody();
      // 更新翅膀
      this.updateWing();
      // 在函数中更新平台的位置
      this.updateTransport();
      // 更新火焰
      this.updateFire();
      // 更新发射波
      this.updateTornado();
      // 更新降雪
      this.updateParticles();
      // 更新飞机的主体
      this.updateAirplane();
      // 更新终点
      this.updateEndDoor();
      // 更新人物动态
      this.updateCharacter();
      // 更新倒计时运行
      if (this.runLimit >= 1){
        this.runLimit--;
        this.clearSetInterval = setInterval(function() {
          self.countdownFunc();
        }, 1000);
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
      if (this.lastLifeCount == 0) {
        this.stopAction();
      } else {
        this.resetGame();
        this.stopAction();
      }
    }
  }
  // 通用返回按钮作用区
  touchHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const btn = this.backButton;
    // 点击返回按钮事件
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
    if (this.gameOver) {
      if (touchX >= this.buttonStartInfo.x && touchX <= this.buttonStartInfo.x + this.buttonStartInfo.width &&
        touchY >= this.buttonStartInfo.y && touchY <= this.buttonStartInfo.y + this.buttonStartInfo.height) {
        this.stopAction();
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
        wx.shareAppMessage(() => {
          return {
            title: '一起寻回我们曾经的美好！',
            imageUrl: 'image/thumbnail.jpg' // 分享图片的路径
          };
        });
      }
    }
  }
  touchStartHandler(e) {
    const touch = e.touches[0];
    const canvasRect = this.canvas.getBoundingClientRect();
    const touchX = touch.clientX - canvasRect.left;
    const touchY = touch.clientY - canvasRect.top;
    const joystickSize = Math.min(this.canvas.width, this.canvas.height) * 0.2;
    const joystickY = this.canvas.height * 0.85;
    // 绘制方向键（矩形）
    const arrowSize = joystickSize * 0.5;
    const padSize = joystickSize * 0.6;
    const buttonSize = padSize;
    // 当游戏结束时无返回值
    if (this.gameOver || this.gameWin){
      return;
    }
    // 判断点击位置是否在方向键上
    if (
      touchX >= 10 + arrowSize * 4 / 3 && touchX <= 10 + arrowSize * 4 / 3 + buttonSize &&
      touchY >= joystickY - padSize / 2 - buttonSize && touchY <= joystickY - padSize / 2
    ) {
      // 上方向键
      // this.pressingDirection = 'up';
      // this.character.theLastAction = 'up';
    } else if (
      touchX >= 10 + arrowSize * 4 / 3 && touchX <= 10 + arrowSize * 4 / 3 + buttonSize &&
      touchY >= joystickY + padSize / 2 && touchY <= joystickY + padSize / 2 + buttonSize
    ) {
      // 停止行为
      this.stopAction();
    } else if (
      touchX >= 10 && touchX <= 10 + buttonSize &&
      touchY >= joystickY - buttonSize / 2 && touchY <= joystickY + buttonSize / 2 && !this.character.isFall
    ) {
      // 左方向键
      this.pressingDirection = 'left';
      this.character.theLastAction = 'left';
      this.moveLeftCharacter();
    } else if (
      touchX >= 10 + arrowSize * 8 / 3 && touchX <= 10 + arrowSize * 8 / 3 + buttonSize &&
      touchY >= joystickY - buttonSize / 2 && touchY <= joystickY + buttonSize / 2 && !this.character.isFall
    ) {
      // 右方向键
      this.pressingDirection = 'right';
      this.character.theLastAction = 'right';
      this.moveRightCharacter();
    } else if (
      touchX >= menuButtonInfo.right - buttonSize * 2.5 && touchX <= menuButtonInfo.right - buttonSize * 2.5 + buttonSize &&
      touchY >= joystickY - padSize / 2 + buttonSize / 2 && touchY <= joystickY - padSize / 2 + buttonSize * 3/2) {
      // 发射
      this.character.isShot = true;
      if (!this.character.shotWave){
        this.toShot();
        soundManager.play('throw');
      }else{
        // 第二次按下后瞬移到冲击波所在位置
        this.toWave();
        soundManager.play('move');
      }
    }else if (
      touchX >= menuButtonInfo.right - buttonSize && touchX <= menuButtonInfo.right &&
      touchY >= joystickY - padSize / 2 - buttonSize / 2 && touchY <= joystickY - padSize / 2 + buttonSize / 2 &&!this.character.isFall) {
      // 跳跃
      this.jumpHandler();
      soundManager.play('jump');
    }
  }
  touchEndHandler(e) {
    if (this.character.isShot) {
      this.character.currentRightShotIndex = 0;
      this.character.currentLeftShotIndex = 0;
      this.character.isShot = false;
    }
  }
  // 停止行为
  stopAction() {
    if (this.pressingDirection == 'right') {
      this.character.currentRightFrameIndex = 0;
      this.pressingDirection = null; // 清空按键方向
    } else if (this.pressingDirection == 'left') {
      this.character.currentLeftFrameIndex = 0;
      this.pressingDirection = null; // 清空按键方向
    }
  }
  // 向右移动动作
  moveRightCharacter() {
    this.character.x += this.character.speed;
    if (this.character.x >= this.canvas.width - 20 * scaleX) {
      this.character.x = this.canvas.width - 20 * scaleX
    }
    this.character.currentRightFrameIndex = (this.character.currentRightFrameIndex + 1) % this.character.rightFrames.length;
  }
  // 向左移动动作
  moveLeftCharacter() {
    this.character.x -= this.character.speed;
    if (this.character.x <= 0) {
      this.character.x = 0
    }
    this.character.currentLeftFrameIndex = (this.character.currentLeftFrameIndex + 1) % this.character.leftFrames.length;
  }
  // 发射的事件处理
  toShot() {
    if (this.character.isShot) {
      this.character.currentRightShotIndex = (this.character.currentRightShotIndex + 1) % this.character.rightShotFrames.length;
      this.character.currentLeftShotIndex = (this.character.currentLeftShotIndex + 1) % this.character.leftShotFrames.length;
      this.character.shotWave = true;
      this.cycleInfo.cycleAddHeight = this.character.y;
      if (this.character.theLastAction == 'right' || this.character.theLastAction == '') {
        this.cycleInfo.cycleX = this.character.x;
        this.cycleInfo.direction = 'right';
      } else if (this.character.theLastAction == 'left') {
        this.cycleInfo.cycleX = this.character.x + 18;
        this.cycleInfo.direction = 'left';
      }
    }
  }
  // 瞬移的事件处理
  toWave() {
    if (this.character.theLastAction == 'left') {
      this.character.x = this.cycleInfo.cycleX - 24 + this.cycleInfo.cycleAddDistence;
    } else if (this.character.theLastAction == 'right' || this.character.theLastAction == '') {
      this.character.x = this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence;
    }
    this.character.y = this.cycleInfo.cycleAddHeight
    this.character.shotWave = false;
    this.cycleInfo.cycleAddDistence = 0;
    this.cycleInfo.angle = 0;
    this.cycleInfo.direction = '';
    this.cycleInfo.cycleX = 0;
    if (this.character.y == this.groundHeight) {
      this.character.isOnGround = true;
      this.character.jumping = false;
    } else {
      this.character.isOnGround = false;
      this.character.jumping = true;
      this.character.jumpStartY = this.groundHeight;
      this.character.jumpHeight = this.groundHeight - this.cycleInfo.cycleAddHeight;
    }
    this.character.isFall = false;
  }
  // 跳跃的事件处理
  jumpHandler() {
    if (!this.character.jumping) {
      this.character.jumping = true;
      this.character.isOnGround = false;
      this.character.jumpStartY = this.character.y;
      this.character.gravity = 0.3;
    }
  }
  // 重置游戏
  resetGame() {
    backgroundMusic.setBackgroundMusicSource('audio/cinemaback.mp3');
    backgroundMusic.playBackgroundMusic();
    this.groundHeightChange = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    this.character = {
      width: 20 * scaleX,
      height: 35 * scaleY,
      x: 35 * scaleX,
      y: this.groundHeight,
      speed: 1 * scaleX, // 人物每次移动的距离
      leftFrames: [], // 存储向左帧图片的数组
      rightFrames: [], // 存储向右帧图片的数组
      leftJumpFrames: [], // 存储向左弹跳图片的数组
      rightJumpFrames: [], // 存储向右弹跳图片的数组
      leftShotFrames: [], // 存储向左发射图片的数组
      rightShotFrames: [], // 存储向右发射图片的数据
      leftDown: [], // 存储向左死掉的图片数组
      rightDown: [], // 存储向右死掉的图片数组
      currentLeftFrameIndex: 0,
      currentRightFrameIndex: 0,
      currentLeftShotIndex: 0,
      currentRightShotIndex: 0,
      theLastAction: '', // 按钮停下后最后一个动作
      jumping: false,
      jumpStartY: 0,
      jumpStartTime: 0,
      jumpHeight: 35 * scaleY, // 跳跃高度
      gravity: 0.3, // 重力
      jumpSpeed: -10 * scaleY, // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
      isFall: false, // 是否处于掉落状态
      moveX: 0,
    };
    const framePathsRight = ['image/right1.png', 'image/right1.png', 'image/right2.png', 'image/right2.png', 'image/right3.png', 'image/right3.png'];
    for (const path of framePathsRight) {
      const frame = new Image();
      frame.src = path;
      this.character.rightFrames.push(frame);
    }
    const framePathsLeft = ['image/left1.png', 'image/left1.png', 'image/left2.png', 'image/left2.png', 'image/left3.png', 'image/left3.png'];
    for (const path of framePathsLeft) {
      const frame = new Image();
      frame.src = path;
      this.character.leftFrames.push(frame);
    }
    const framePathsRightJump = ['image/rightjump1.png', 'image/rightjump2.png'];
    for (const path of framePathsRightJump) {
      const frame = new Image();
      frame.src = path;
      this.character.rightJumpFrames.push(frame);
    }
    const framePathsLeftJump = ['image/leftjump1.png', 'image/leftjump2.png'];
    for (const path of framePathsLeftJump) {
      const frame = new Image();
      frame.src = path;
      this.character.leftJumpFrames.push(frame);
    }
    const framePathsRightShot = ['image/shot1.png', 'image/shot2.png'];
    for (const path of framePathsRightShot) {
      const frame = new Image();
      frame.src = path;
      this.character.rightShotFrames.push(frame);
    }
    const framePathsLeftShot = ['image/shot3.png', 'image/shot4.png'];
    for (const path of framePathsLeftShot) {
      const frame = new Image();
      frame.src = path;
      this.character.leftShotFrames.push(frame);
    }
    const framePathsRightDead = ['image/rightdown.png'];
    for (const path of framePathsRightDead) {
      const frame = new Image();
      frame.src = path;
      this.character.rightDown.push(frame);
    }
    const framePathsLeftDead = ['image/leftdown.png'];
    for (const path of framePathsLeftDead) {
      const frame = new Image();
      frame.src = path;
      this.character.leftDown.push(frame);
    }
    this.cycleInfo = {
      cycleX: 0,
      cycleAddHeight: 0,
      cycleAddDistence: 0,
      speed: 2 * scaleX,
      angle: 0,
      direction: ''
    }
    this.endDoorStatue = {
      x: 0,
      y: 0,
      width: 64 * scaleY,
      height: 64 * scaleY,
      endDoorShow: false,
      velocityY: 0,
      gravity: 0.3,
    }
    this.transportInfo = {
      x: this.canvas.width - 64 * scaleY,
      y: this.groundHeight + 10 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: true
    }
    this.transportSecondInfo = {
      x: -20 * scaleX,
      y: menuButtonInfo.bottom + 60 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: false,
      direction: 1
    }
    this.cycleWaveInfo = {
      x: this.canvas.width - 32 * scaleY,
      y: this.groundHeight - 50 * scaleY,
      width: 16 * scaleY,
      height: 16 * scaleY,
      show: false
    }
    this.gearInfo = {
      x: (this.canvas.width - 32 * scaleX) * 2,
      y: this.groundHeight,
      width: 32 * scaleY,
      height: 32 * scaleY,
      statue: 'left',
      sound: false
    }
    this.gearSecondInfo = {
      x: -32 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.06 - 105 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      velocityY: 0,
      direction: 1,
      gearStatue: 'left',
      gearSound: false,
      melt: false, // 是否化了
    }
    this.fireInfo = {
      x: this.canvas.width / 2 + 40 * scaleX,
      y: this.groundHeight - 75 * scaleY,
      width: 125 * scaleY,
      height: 125 * scaleY,
      framePath: [],
      show: true,
      currentIndex: 0
    }
    const framePathsFire = ['image/fire01.png', 'image/fire01.png', 'image/fire01.png', 'image/fire01.png', 'image/fire02.png', 'image/fire02.png', 'image/fire02.png', 'image/fire02.png', 'image/fire03.png', 'image/fire03.png', 'image/fire03.png', 'image/fire03.png', 'image/fire04.png', 'image/fire04.png', 'image/fire04.png', 'image/fire04.png', 'image/fire05.png', 'image/fire05.png', 'image/fire05.png', 'image/fire05.png', 'image/fire06.png', 'image/fire06.png', 'image/fire06.png', 'image/fire06.png', 'image/fire07.png', 'image/fire07.png', 'image/fire07.png', 'image/fire07.png'];
    for (const path of framePathsFire) {
      const frame = new Image();
      frame.src = path;
      this.fireInfo.framePath.push(frame);
    }
    this.airplaneInfo = {
      x: this.canvas.width * 3 / 2 - 100 * scaleX,
      y: this.groundHeight - 24 * scaleY,
      width: 54 * scaleX,
      height: 34 * scaleY,
      airplaneRotation: 0,
      velocityY: 0,
      launch: false,
      launchOff: 1,
      show: true
    }
    // 绳子信息
    this.ropeInfo = {
      startX: 0,
      startY: this.groundHeight - this.canvas.height * 0.06 - 50 * scaleY,
      endX: this.canvas.width,
      endY: this.groundHeight - this.canvas.height * 0.06 - 50 * scaleY,
      controlX: this.canvas.width / 2,
      controlY: this.groundHeight - this.canvas.height * 0.06 - 30 * scaleY,
      color: '#333',
      width: 5,
      break: false,
    }
    this.unicycleInfo = {
      x: -32 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.06 - 73 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      velocityY: 0,
      direction: 1 // 1 为向右，-1 为向左
    }
    this.bossInfo = {
      x: this.canvas.width * 2,
      y: menuButtonInfo.bottom + 60 * scaleY,
      initialY: menuButtonInfo.bottom + 60 * scaleY,
      width: 128 * scaleY,
      height: 128 * scaleY,
      wingFrame: [],
      bodyFrame: [],
      shotFrame: [],
      currentIndex: 0,
      currentBodyIndex: 0,
      currentShotIndex: 0,
      shotCount: 0,
      floatDirection: 1, // 初始向上浮动，-1 为向下浮动
      isShot: false,
      bossFollowRange: 20,
      maxHealth: 100, // 最大血量
      currentHealth: 100, // 当前血量
      isDead: false, // 是否已死亡
    }
    // 翅膀图片集锦
    const framePathsWing = ['image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing01.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing02.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing03.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing04.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing05.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png', 'image/wing06.png'];
    for (const path of framePathsWing) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.wingFrame.push(frame);
    }
    // 身体图片集锦
    const bodyPathsBody = ['image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss01.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png'];
    for (const path of bodyPathsBody) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.bodyFrame.push(frame);
    }
    // 发射图片集锦
    const bodyPathsShot = ['image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss02.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss03.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss04.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss05.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png', 'image/boss06.png'];
    for (const path of bodyPathsShot) {
      const frame = new Image();
      frame.src = path;
      this.bossInfo.shotFrame.push(frame);
    }
    this.lightShotInfo = {
      x: this.canvas.width * 2,
      y: this.groundHeight,
      width: 128 * scaleY,
      height: 128 * scaleY,
      angle: 0,
      show: false,
    }
    this.lastLifeCount = null;
    this.clockDownTime = 90;
    this.runLimit = 1;
    this.particles = [];
    this.particlesShow = false;
    this.pressingDirection = null;
    this.gameOver = false;
    this.gameWin = false;
    this.buttonStartInfo = "";
    this.buttonShareInfo = "";
    this.clearSetInterval = '';
  }
  // 页面销毁机制
  destroy() {
    // 移除触摸事件监听器
    wx.offTouchStart(this.touchStartHandler.bind(this));
    wx.offTouchEnd(this.touchEndHandler.bind(this));
    // 清理加载图片
    this.backButton = '';
    this.gameBackground.src = '';
    this.gameBackgroundRight.src = '';
    this.yardImage.src = '';
    this.cycleImage.src = '';
    this.endDoorImage.src = '';
    this.transport.src = '';
    this.lifeCount.src = '';
    this.clockDown.src = '';
    this.leftGear.src = '';
    this.rightGear.src = '';
    this.iceGear.src = '';
    this.lightShot.src = '';
    this.baseImage.src = '';
    this.airplane.src = '';
    this.unicycleImage.src = '';
    this.failTipsImage.src = '';
    // 清理人物图片
    this.destroyCharacterFrames();
  }
  // 返回其他层后销毁加载图片，避免内存泄漏
  destroyCharacterFrames() {
    for (let i = 0; i < this.character.leftFrames.length; i++) {
      this.destroyImage(this.character.leftFrames[i]);
    }
    for (let i = 0; i < this.character.rightFrames.length; i++) {
      this.destroyImage(this.character.rightFrames[i]);
    }
    for (let i = 0; i < this.character.leftJumpFrames.length; i++) {
      this.destroyImage(this.character.leftJumpFrames[i]);
    }
    for (let i = 0; i < this.character.rightJumpFrames.length; i++) {
      this.destroyImage(this.character.rightJumpFrames[i]);
    }
    for (let i = 0; i < this.character.leftShotFrames.length; i++) {
      this.destroyImage(this.character.leftShotFrames[i]);
    }
    for (let i = 0; i < this.character.rightShotFrames.length; i++) {
      this.destroyImage(this.character.rightShotFrames[i]);
    }
    for (let i = 0; i < this.character.leftDown.length; i++) {
      this.destroyImage(this.character.leftDown[i]);
    }
    for (let i = 0; i < this.character.rightDown.length; i++) {
      this.destroyImage(this.character.rightDown[i]);
    }
    for (let i = 0; i < this.fireInfo.framePath.length; i++) {
      this.destroyImage(this.fireInfo.framePath[i]);
    }
    for (let i = 0; i < this.bossInfo.wingFrame.length; i++) {
      this.destroyImage(this.bossInfo.wingFrame[i]);
    }
    for (let i = 0; i < this.bossInfo.bodyFrame.length; i++) {
      this.destroyImage(this.bossInfo.bodyFrame[i]);
    }
    // 清空数组
    this.character.leftFrames = [];
    this.character.rightFrames = [];
    this.character.leftJumpFrames = [];
    this.character.rightJumpFrames = [];
    this.character.leftShotFrames = [];
    this.character.rightShotFrames = [];
    this.character.leftDown = [];
    this.character.rightDown = [];
    this.fireInfo.framePath = [];
    this.bossInfo.wingFrame = [];
    this.bossInfo.bodyFrame = [];
  }
  // 销毁图片时调用
  destroyImage(imageObject) {
    imageObject.src = '';
  }
}