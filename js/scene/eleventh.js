import {
  createBackButton,
  drawIconButton,
} from '../../utils/button';
import { soundManager, backgroundMusic, menuButtonInfo, scaleX, scaleY } from '../../utils/global';
export default class Eleventh {
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
    /* 常量设置区域开始 */
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    this.groundHeightChange = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    this.character = {
      width: 20 * scaleX,
      height: 35 * scaleY,
      x: 35 * scaleX,
      y: this.groundHeightChange,
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
      jumpHeight: this.canvas.height * 0.06, // 跳跃高度
      gravity: 0.3, // 重力
      jumpSpeed: -10, // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
      isFall: false, // 是否处于掉落状态
    };
    this.cycleInfo = {
      cycleX: 0,
      cycleAddHeight: 0,
      cycleAddDistence: 0,
      speed: 2 * scaleX,
      angle: 0,
      direction: ''
    }
    this.gearInfo = {
      x: this.canvas.width / 2 + 16 * scaleY,
      y: this.groundHeight - this.canvas.height * 0.30 - 2 * scaleY,
      width: 32 * scaleX,
      height: 32 * scaleY,
      statue: 'left',
      sound: false,
      dropDistence: 0,
    }
    this.rockPlatformList = [{
      x: 10,
      y: this.groundHeight - this.canvas.height * 0.06 + 10 * scaleY,
      direction: 1,
      isMoving: false,
      width: 128 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }, {
      x: this.canvas.width - 78 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.18 + 20 * scaleY,
      direction: 1,
      isMoving: false,
      width: 68 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }, {
      x: this.canvas.width / 2,
      y: this.groundHeight - this.canvas.height * 0.30 + 30 * scaleY,
      direction: 1,
      isMoving: false,
      width: 64 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }];
    this.laserInfo = {
      startX: -20 * scaleX,
      startY: 0,
      length: this.groundHeight + this.character.height,
      color: '#00ff0099',
      width: 5,
      boltSpeed: 0.05,
      segments: 20,
      moveSpeed: 0.5 * scaleX,
      direction: 1 // 1 是向右移动, -1 是向左移动
    }
    this.laserInfoRight = {
      startX: this.canvas.width + 20 * scaleX,
      startY: 0,
      length: this.groundHeight + this.character.height,
      color: '#00ff0099',
      width: 5,
      boltSpeed: 0.05,
      segments: 20,
      moveSpeed: 0.5 * scaleX,
      direction: -1 // -1 是向左移动, 1 是向右移动
    }
    this.woodenBoxInfo = {
      x: this.canvas.width * 0.2,
      y: -30 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      velocityY: 0,
      isBreak: false,
    }
    this.transportInfo = {
      x: this.canvas.width / 2 + 64 * scaleY,
      y: this.groundHeight - 22 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: true
    }
    this.sawmillInfo = {
      x: this.canvas.width / 2 + 80 * scaleY,
      y: this.groundHeight - 42 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      show: false
    }
    this.endDoorStatue = {
      x: this.canvas.width * 0.2,
      y: -30 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      velocityY: 0,
    }
    this.lastLifeCount = null;
    this.clockDownTime = 90;
    this.runLimit = 1;
    this.blackout = false;
    this.blackoutTimer = 0;
    this.pressingDirection = null; // 记录当前长按的方向键
    this.gameOver = false; // 记录游戏是否结束
    this.gameWin = false; //记录游戏是否胜利
    this.buttonStartInfo = "";
    this.buttonShareInfo = "";
    this.context.font = `${20 * scaleX}px Arial`;
    this.clearSetInterval = '';
    /* 常量设置区域结束 */
    /* 图片加载区域开始 */
    this.gameBackground = new Image();
    this.gameBackground.src = 'image/hospitalback.jpg';
    this.backButton = '';
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
    this.leftGear = new Image();
    this.leftGear.src = 'image/joystickleft.png';
    this.rightGear = new Image();
    this.rightGear.src = 'image/joystickright.png';
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png';
    this.platform = [
      'image/circleterrace.png',
      'image/squareterrace.png',
      'image/triangleterrace.png',
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.woodenBoxImage = new Image();
    this.woodenBoxImage.src = 'image/wooden.png';
    this.transport = new Image();
    this.transport.src = 'image/transport.png';
    this.sawmill = new Image();
    this.sawmill.src = 'image/sawmill.png';
    this.endDoorImage = new Image();
    this.endDoorImage.src = 'image/doorbreak.png';
    this.lifeCount = new Image();
    this.lifeCount.src = 'image/head.png';
    this.clockDown = new Image();
    this.clockDown.src = 'image/clock.png';
    this.failTipsImage = new Image();
    this.failTipsImage.src = 'image/gameovertips.png';
    /* 图片加载区域开始 */
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
  // 绘制岩石平台
  drawRockPlatform() {
    this.platform.forEach((element, index) => {
      if (element.complete) {
        this.context.drawImage(element, this.rockPlatformList[index].x, this.rockPlatformList[index].y, this.rockPlatformList[index].width, this.rockPlatformList[index].height);
      }
    })
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
  // 绘制关卡显示
  drawAroundNumber() {
    const number = '11';
    const textWidth = this.context.measureText(number).width;
    const startX = this.canvas.width - textWidth - 10;
    const scoreY = menuButtonInfo.bottom + 20 * scaleY; // 分数的y坐标
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
    const iconY = menuButtonInfo.bottom + 2 * scaleY; // 图标的y坐标
    const scoreY = menuButtonInfo.bottom + 20 * scaleY; // 分数的y坐标
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
      this.context.drawImage(this.gameBackground, 0, 0, this.canvas.width, this.canvas.height * 0.6)
    }
  }
  // 绘制陆地
  drawYard() {
    if (this.yardImage.complete) {
      this.context.drawImage(this.yardImage, 0, menuButtonInfo.bottom + this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 0.1)
    }
  }
  // 绘制魔法阵
  drawTransport() {
    if (this.gearInfo.statue == 'right') {
      if (this.transport.complete) {
        this.context.drawImage(this.transport, this.transportInfo.x, this.transportInfo.y, this.transportInfo.width, this.transportInfo.height);
      }
    }
  }
  // 绘制锯木机提示
  drawSawmill() {
    if (this.gearInfo.statue == 'right') {
      if (this.sawmill.complete && this.sawmillInfo.show) {
        this.context.save();
        this.context.globalAlpha = 0.5;
        this.context.drawImage(this.sawmill, this.sawmillInfo.x, this.sawmillInfo.y, this.sawmillInfo.width, this.sawmillInfo.height);
        this.context.restore();
      }
    }
  }
  // 绘制机关
  drawGear() {
    if (this.gearInfo.statue == 'left') {
      if (this.leftGear.complete) {
        this.context.drawImage(this.leftGear, this.gearInfo.x + this.gearInfo.dropDistence, this.gearInfo.y, this.gearInfo.width, this.gearInfo.height);
      }
    } else {
      if (this.rightGear.complete) {
        this.context.drawImage(this.rightGear, this.gearInfo.x + this.gearInfo.dropDistence, this.gearInfo.y, this.gearInfo.width, this.gearInfo.height);
      }
    }
  }
  // 绘制终点
  drawEndDoor() {
    if (this.endDoorImage.complete) {
      this.context.drawImage(this.endDoorImage, this.endDoorStatue.x, this.endDoorStatue.y, this.endDoorStatue.width, this.endDoorStatue.height)
    }
  }
  // 更新终点
  updateEndDoor() {
    if (this.gearInfo.statue == 'right') {
      if (this.endDoorStatue.y <= this.groundHeight - 32 * scaleY) {
        this.endDoorStatue.velocityY += 0.3;
        this.endDoorStatue.y += this.endDoorStatue.velocityY;
      }
    }
    if (this.endDoorStatue.x >= this.canvas.width - this.endDoorStatue.width) {
      this.endDoorStatue.x = this.canvas.width - this.endDoorStatue.width
    }
    if (this.endDoorStatue.x <= 0){
      this.endDoorStatue.x = 0
    }
  }
  // 绘制木箱
  drawWoodenBox() {
    if (this.woodenBoxImage.complete && !this.woodenBoxInfo.isBreak) {
      this.context.drawImage(this.woodenBoxImage, this.woodenBoxInfo.x, this.woodenBoxInfo.y, this.woodenBoxInfo.width,  this.woodenBoxInfo.height)
    }
  }
  // 更新木箱状态
  updateWoodenBox() {
    if (this.gearInfo.statue == 'right') {
      if (this.woodenBoxInfo.y <= this.groundHeight - 32 * scaleY) {
        this.woodenBoxInfo.velocityY += 0.3;
        this.woodenBoxInfo.y += this.woodenBoxInfo.velocityY;
      }
    }
    if (this.woodenBoxInfo.x >= this.canvas.width - this.woodenBoxInfo.width) {
      this.woodenBoxInfo.x = this.canvas.width - this.woodenBoxInfo.width
    }
    if (this.woodenBoxInfo.x <= 0) {
      this.woodenBoxInfo.x = 0
    }
    // 判断箱子与魔法阵的碰撞检测
    if (this.woodenBoxInfo.x<= this.transportInfo.x + this.transportInfo.width && this.woodenBoxInfo.x + 16 * scaleX >= this.transportInfo.x && this.sawmillInfo.show) {
      this.woodenBoxInfo.isBreak = true;
    }
  }
  // 绘制激光
  drawLaser() {
    const boltPath = this.generateBoltPath(this.laserInfo.startX, this.laserInfo.startY, this.laserInfo.startX, this.laserInfo.startY + this.laserInfo.length, this.laserInfo.segments);
    // 绘制激光路径
    this.context.save();
    this.context.strokeStyle = this.laserInfo.color;
    this.context.lineWidth = this.laserInfo.width;
    this.context.beginPath();
    this.context.moveTo(boltPath[0].x, boltPath[0].y);
    for (var i = 1; i < boltPath.length; i++) {
      this.context.lineTo(boltPath[i].x, boltPath[i].y);
    }
    this.context.stroke();
    // 更新闪电路径以产生动画效果
    for (var i = 1; i < boltPath.length - 1; i++) {
      boltPath[i].x += (Math.random() - 0.5) * this.laserInfo.width * 2;
      boltPath[i].y += (Math.random() - 0.5) * this.laserInfo.width * 2;
    }
    this.context.restore();
  }
  // 绘制激光移动
  updateLaser() {
    if (this.gearInfo.statue == 'right') {
      if (this.laserInfo.direction == 1 && this.laserInfo.startX <= this.canvas.width + 15 * scaleX) {
        this.laserInfo.startX += this.laserInfo.moveSpeed;
      } else if (this.laserInfo.direction == 1) {
        this.laserInfo.direction = -1;
      }
      if (this.laserInfo.direction == -1 && this.laserInfo.startX >= -15 * scaleX) {
        this.laserInfo.startX -= this.laserInfo.moveSpeed;
      } else if (this.laserInfo.direction == -1) {
        this.laserInfo.direction = 1;
      }
    }
  }
  // 绘制右侧激光移动
  drawLaserRight() {
    const boltPath = this.generateBoltPath(this.laserInfoRight.startX, this.laserInfoRight.startY, this.laserInfoRight.startX, this.laserInfoRight.startY + this.laserInfoRight.length, this.laserInfoRight.segments);
    // 绘制激光路径
    this.context.save();
    this.context.strokeStyle = this.laserInfoRight.color;
    this.context.lineWidth = this.laserInfoRight.width;
    this.context.beginPath();
    this.context.moveTo(boltPath[0].x, boltPath[0].y);
    for (var i = 1; i < boltPath.length; i++) {
      this.context.lineTo(boltPath[i].x, boltPath[i].y);
    }
    this.context.stroke();
    // 更新闪电路径以产生动画效果
    for (var i = 1; i < boltPath.length - 1; i++) {
      boltPath[i].x += (Math.random() - 0.5) * this.laserInfoRight.width * 2;
      boltPath[i].y += (Math.random() - 0.5) * this.laserInfoRight.width * 2;
    }
    this.context.restore();
  }
  // 绘制右侧激光移动
  updateLaserRight() {
    if (this.gearInfo.statue == 'right') {
      if (this.laserInfoRight.direction == -1 && this.laserInfoRight.startX >= -20 * scaleX) {
        this.laserInfoRight.startX -= this.laserInfoRight.moveSpeed;
      } else if (this.laserInfoRight.direction == -1) {
        this.laserInfoRight.direction = 1;
      }
      if (this.laserInfoRight.direction == 1 && this.laserInfoRight.startX <= this.canvas.width + 20 * scaleX) {
        this.laserInfoRight.startX += this.laserInfoRight.moveSpeed;
      } else if (this.laserInfoRight.direction == 1) {
        this.laserInfoRight.direction = -1;
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
      if (this.groundHeightChange - this.character.y > this.character.jumpHeight) {
        this.character.gravity = -0.3;
      }
      this.character.velocityY -= this.character.gravity;
      this.character.y += this.character.velocityY;
      // 如果达到地面，结束跳跃
      if (this.character.y >= this.character.jumpStartY && !this.character.isOnGround) {
        this.character.jumping = false;
        this.character.isOnGround = true;
        this.character.y = this.groundHeightChange;
        this.character.velocityY = 0;
        this.character.jumpStartY = 0;
        this.character.jumpHeight = this.canvas.height * 0.06;
      }
    }
    // 判断是否与机关碰撞
    if (this.character.x + this.character.width >= this.gearInfo.x + 10 * scaleX && this.character.x <= this.gearInfo.x + this.gearInfo.width - 10 * scaleX && this.character.y + this.character.height >= this.gearInfo.y && this.character.y <= this.gearInfo.y + this.gearInfo.height) {
      this.gearInfo.statue = 'right';
      if (!this.gearInfo.sound) {
        soundManager.play('gear');
        this.gearInfo.sound = true;
      }
    }
    // 检测人物与平台的碰撞
    for (const plat of this.rockPlatformList) {
      if (
        this.character.x <= plat.x + plat.width - 10 * scaleX &&
        this.character.x + this.character.width >= plat.x + 10 * scaleX &&
        this.character.y + this.character.height >= plat.y && this.character.y <= plat.y + 2 * scaleY && this.character.velocityY > 0
      ) {
          this.character.y = plat.y - this.character.height;
          this.character.isOnGround = true;
          this.character.gravity = 0.3;
          this.character.velocityY = 0;
          this.groundHeightChange = plat.y - this.character.height;
          this.character.jumpStartY = 0;
          this.character.jumping = false;
          plat.isOnPlat = true;
      }
      if (plat.isOnPlat) {
        if(this.character.x > plat.x + plat.width - 10 * scaleX || this.character.x + this.character.width < plat.x + 10 * scaleX){
          plat.isOnPlat = false;
          this.character.jumping = true; // 使人物开始下落
          this.character.isOnGround = false;
          this.groundHeightChange = this.groundHeight;
          this.character.jumpStartY = this.groundHeight;
        }
      }
    }
    // 判断与激光的碰撞检测
    if (this.character.x + this.character.width >= this.laserInfo.startX && this.character.x <= this.laserInfo.startX + this.laserInfo.width) {
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
    // 判断与右激光的碰撞检测
    if (this.character.x + this.character.width >= this.laserInfoRight.startX && this.character.x <= this.laserInfoRight.startX + this.laserInfoRight.width) {
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
    // 判断与魔法阵碰撞检测
    if (this.gearInfo.statue == 'right' && this.character.x <= this.transportInfo.x + this.transportInfo.width && this.character.x + this.character.width >= this.transportInfo.x && this.character.y <= this.transportInfo.y + this.transportInfo.height && this.character.y + this.character.height >= this.transportInfo.y) {
      this.sawmillInfo.show = true;
    }
    // 人物在笼子外则会推着笼子离开
    if (!this.woodenBoxInfo.isBreak && this.gearInfo.statue == 'right') {
      if (this.character.theLastAction == 'left' && this.character.x >= this.woodenBoxInfo.x + this.woodenBoxInfo.width && this.character.x <= this.woodenBoxInfo.x + this.woodenBoxInfo.width + 2 * scaleX && this.character.y >= this.groundHeight) {
        this.woodenBoxInfo.x -= this.character.speed;
        this.endDoorStatue.x -= this.character.speed;
      }
      if (this.character.theLastAction == 'right' && this.character.x + this.character.width >= this.woodenBoxInfo.x && this.character.x + this.character.width <= this.woodenBoxInfo.x + 2 * scaleX && this.character.y >= this.groundHeight) {
        this.woodenBoxInfo.x += this.character.speed;
        this.endDoorStatue.x += this.character.speed;
      }
    }
    // 判断是否与终点碰撞
    if (this.character.x <= this.endDoorStatue.x + this.endDoorStatue.width * 2 / 3 && this.character.x + this.character.width >= this.endDoorStatue.x + this.endDoorStatue.width / 3 && this.character.y <= this.endDoorStatue.y + this.endDoorStatue.height && this.character.y + this.character.height >= this.endDoorStatue.y && this.woodenBoxInfo.isBreak){
      clearInterval(this.clearSetInterval);
      this.gameWin = true;
      soundManager.play('win');
      backgroundMusic.stopBackgroundMusic();
      // 前往下一关卡
      wx.setStorageSync('trailNumber', 11)
      this.game.switchScene(new this.game.twelfth(this.game));
    }else{
      this.gameWin = false;
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
      } else if (this.cycleInfo.direction == 'left') {
        if (this.cycleInfo.cycleX + this.cycleInfo.cycleAddDistence <= 20 * scaleX) {
          this.character.shotWave = false;
          this.cycleInfo.cycleAddDistence = 0;
          this.cycleInfo.angle = 0;
          this.cycleInfo.direction = '';
        } else {
          this.cycleInfo.cycleAddDistence -= this.cycleInfo.speed;
        }
      }
    }
  }
  // 绘制关灯后的黑屏
  drawLightOff() {
    if (this.blackout) {
      this.context.fillStyle = '#00000080';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
  // 更新关灯逻辑
  updateLightOff() {
    if (this.clockDownTime % 3 == 0) {
      this.blackout = false;
      soundManager.play('lightoff');
    } else {
      this.blackout = true;
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
    // 绘制陆地
    this.drawYard();
    // 绘制岩石平台
    this.drawRockPlatform();
    // 绘制魔法阵
    this.drawTransport();
    // 绘制锯木机提示
    this.drawSawmill();
    // 绘制机关
    this.drawGear();
    // 绘制终点
    this.drawEndDoor();
    // 绘制木箱
    this.drawWoodenBox();
    // 绘制人物
    this.drawCharacter();
    // 绘制冲击波
    this.drawCycleWave();
    // 绘制关灯后的黑屏
    this.drawLightOff();
    // 绘制激光
    this.drawLaser();
    // 绘制右侧激光移动
    this.drawLaserRight();
    // 绘制返回按钮
    this.drawBack();
    // 绘制关卡显示
    this.drawAroundNumber();
    // 绘制生命数
    this.drawLifeCount();
    // 绘制倒计时
    this.startCountdown();
    // 绘制移动按钮所在区域
    this.drawJoystick();
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
      // 更新激光移动
      this.updateLaser();
      // 更新右侧激光移动
      this.updateLaserRight();
      // 更新木箱状态
      this.updateWoodenBox();
      // 更新终点
      this.updateEndDoor();
      // 更新冲击波
      this.updateCycleWave();
      // 更新人物动态
      this.updateCharacter();
      // 更新关灯逻辑
      this.updateLightOff();
      // 更新倒计时运行
      // if (this.runLimit >= 1){
      //   this.runLimit--;
      //   this.clearSetInterval = setInterval(function() {
      //     self.countdownFunc();
      //   }, 1000);
      // }
    }
  }
  // 倒计时运行函数
  countdownFunc(_name) {
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
        if (this.lastLifeCount == 0){
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
  moveRightCharacter(){
    this.character.x += this.character.speed;
    if (this.character.x >= this.canvas.width - this.character.width){
      this.character.x = this.canvas.width - this.character.width;
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
        this.cycleInfo.cycleX = this.character.x + 18 * scaleX;
        this.cycleInfo.direction = 'left';
      }
    }
  }
  // 瞬移的事件处理
  toWave() {
    if (this.character.theLastAction == 'left') {
      this.character.x = this.cycleInfo.cycleX - 24 * scaleX + this.cycleInfo.cycleAddDistence;
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
      this.groundHeightChange = this.groundHeight;
      this.character.jumpStartY = this.groundHeightChange;
    }
    this.character.isFall = false;
  }
  // 跳跃的事件处理
  jumpHandler() {
    if (!this.character.jumping) {
      this.character.jumping = true;
      this.character.isOnGround = false;
      this.character.jumpStartY = this.groundHeightChange;
      this.character.gravity = 0.3;
    }
  }
  // 重置游戏
  resetGame() {
    backgroundMusic.playBackgroundMusic();
    this.groundHeightChange = menuButtonInfo.bottom + this.canvas.height * 0.5 - 33 * scaleY;
    // 绘制人物
    this.character = {
      width: 20 * scaleX,
      height: 35 * scaleY,
      x: 35 * scaleX,
      y: this.groundHeightChange,
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
      jumpHeight: this.canvas.height * 0.06, // 跳跃高度
      gravity: 0.3, // 重力
      jumpSpeed: -10, // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
      isFall: false, // 是否处于掉落状态
    };
    this.cycleInfo = {
      cycleX: 0,
      cycleAddHeight: 0,
      cycleAddDistence: 0,
      speed: 2 * scaleX,
      angle: 0,
      direction: ''
    }
    this.gearInfo = {
      x: this.canvas.width / 2 + 16 * scaleY,
      y: this.groundHeight - this.canvas.height * 0.30 - 2 * scaleY,
      width: 32 * scaleX,
      height: 32 * scaleY,
      statue: 'left',
      sound: false,
      dropDistence: 0,
    }
    // 向右移动时候图片集锦
    const framePathsRight = ['image/right1.png', 'image/right1.png', 'image/right2.png', 'image/right2.png', 'image/right3.png', 'image/right3.png'];
    for (const path of framePathsRight) {
      const frame = new Image();
      frame.src = path;
      this.character.rightFrames.push(frame);
    }
    // 向左移动时候图片集锦
    const framePathsLeft = ['image/left1.png', 'image/left1.png', 'image/left2.png', 'image/left2.png', 'image/left3.png', 'image/left3.png'];
    for (const path of framePathsLeft) {
      const frame = new Image();
      frame.src = path;
      this.character.leftFrames.push(frame);
    }
    // 向右移动跳动的图片集锦
    const framePathsRightJump = ['image/rightjump1.png', 'image/rightjump2.png'];
    for (const path of framePathsRightJump) {
      const frame = new Image();
      frame.src = path;
      this.character.rightJumpFrames.push(frame);
    }
    // 向左移动弹跳的图片集锦
    const framePathsLeftJump = ['image/leftjump1.png', 'image/leftjump2.png'];
    for (const path of framePathsLeftJump) {
      const frame = new Image();
      frame.src = path;
      this.character.leftJumpFrames.push(frame);
    }
    // 向右发射的图片集锦
    const framePathsRightShot = ['image/shot1.png', 'image/shot2.png'];
    for (const path of framePathsRightShot) {
      const frame = new Image();
      frame.src = path;
      this.character.rightShotFrames.push(frame);
    }
    // 向左发射的图片集锦
    const framePathsLeftShot = ['image/shot3.png', 'image/shot4.png'];
    for (const path of framePathsLeftShot) {
      const frame = new Image();
      frame.src = path;
      this.character.leftShotFrames.push(frame);
    }
    // 向右死掉的图片集锦
    const framePathsRightDead = ['image/rightdown.png'];
    for (const path of framePathsRightDead) {
      const frame = new Image();
      frame.src = path;
      this.character.rightDown.push(frame);
    }
    // 向左死掉的图片集锦
    const framePathsLeftDead = ['image/leftdown.png'];
    for (const path of framePathsLeftDead) {
      const frame = new Image();
      frame.src = path;
      this.character.leftDown.push(frame);
    }
    this.platform = [
      'image/circleterrace.png',
      'image/squareterrace.png',
      'image/triangleterrace.png',
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.rockPlatformList = [{
      x: 10,
      y: this.groundHeight - this.canvas.height * 0.06 + 10 * scaleY,
      direction: 1,
      isMoving: false,
      width: 128 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }, {
      x: this.canvas.width - 78 * scaleX,
      y: this.groundHeight - this.canvas.height * 0.18 + 20 * scaleY,
      direction: 1,
      isMoving: false,
      width: 68 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }, {
      x: this.canvas.width / 2,
      y: this.groundHeight - this.canvas.height * 0.30 + 30 * scaleY,
      direction: 1,
      isMoving: false,
      width: 64 * scaleX,
      height: 28 * scaleY,
      isOnPlat: false,
    }];
    this.laserInfo = {
      startX: -20 * scaleX,
      startY: 0,
      length: this.groundHeight + this.character.height,
      color: '#00ff0099',
      width: 5,
      boltSpeed: 0.05,
      segments: 20,
      moveSpeed: 0.5 * scaleX,
      direction: 1 // 1 是向右移动, -1 是向左移动
    }
    this.laserInfoRight = {
      startX: this.canvas.width + 20 * scaleX,
      startY: 0,
      length: this.groundHeight + this.character.height,
      color: '#00ff0099',
      width: 5,
      boltSpeed: 0.05,
      segments: 20,
      moveSpeed: 0.5 * scaleX,
      direction: -1 // -1 是向左移动, 1 是向右移动
    }
    this.woodenBoxInfo = {
      x: this.canvas.width * 0.2,
      y: -30 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      velocityY: 0,
      isBreak: false,
    }
    this.transportInfo = {
      x: this.canvas.width / 2 + 64 * scaleY,
      y: this.groundHeight - 22 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      show: true
    }
    this.sawmillInfo = {
      x: this.canvas.width / 2 + 80 * scaleY,
      y: this.groundHeight - 42 * scaleY,
      width: 32 * scaleY,
      height: 32 * scaleY,
      show: false
    }
    this.endDoorStatue = {
      x: this.canvas.width * 0.2,
      y: -30 * scaleY,
      width: 64 * scaleY,
      height: 64 * scaleY,
      velocityY: 0,
    }
    this.lastLifeCount = null;
    this.clockDownTime = 90;
    this.runLimit = 1;
    this.blackout = false;
    this.blackoutTimer = 0;
    this.pressingDirection = null; // 记录当前长按的方向键
    this.gameOver = false; // 记录游戏是否结束
    this.gameWin = false; //记录游戏是否胜利
    this.buttonStartInfo = "";
    this.buttonShareInfo = "";
    this.context.font = `${20 * scaleX}px Arial`;
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
    this.yardImage.src = '';
    this.cycleImage.src = '';
    this.leftGear.src = '';
    this.rightGear.src = '';
    this.woodenBoxImage.src = '';
    this.transport.src = '';
    this.endDoorImage.src = '';
    this.lifeCount.src = '';
    this.clockDown.src = '';
    this.failTipsImage.src = '';
    this.platform.forEach(img => img = null);
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
    // 清空数组
    this.character.leftFrames = [];
    this.character.rightFrames = [];
    this.character.leftJumpFrames = [];
    this.character.rightJumpFrames = [];
    this.character.leftShotFrames = [];
    this.character.rightShotFrames = [];
    this.character.leftDown = [];
    this.character.rightDown = [];
  }
  // 销毁图片时调用
  destroyImage(imageObject) {
    imageObject.src = '';
  }
  generateBoltPath(startX, startY, endX, endY, segments) {
    var points = [{
      x: startX,
      y: startY
    }, {
      x: endX,
      y: endY
    }];
    for (var i = 0; i < segments; i++) {
      var midX = (points[i].x + points[i + 1].x) / 2;
      var midY = (points[i].y + points[i + 1].y) / 2;
      midX += (Math.random() - 0.5) * this.laserInfo.width * 2;
      midY += (Math.random() - 0.5) * this.laserInfo.width * 2;
      points.splice(i + 1, 0, {
        x: midX,
        y: midY
      });
    }
    return points;
  }
}