import {
  createBackButton
} from '../../utils/button';
let systemInfo = wx.getSystemInfoSync();
let menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export default class Instruction {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.context = game.context;
    canvas.width = systemInfo.screenWidth * systemInfo.devicePixelRatio;
    canvas.height = systemInfo.screenHeight * systemInfo.devicePixelRatio;
    this.context.scale(systemInfo.devicePixelRatio, systemInfo.devicePixelRatio);
    // 绘制游戏区域背景
    this.gameBackground = new Image();
    this.gameBackground.src = 'image/background.jpg';
    // 绘制陆地
    this.yardImage = new Image();
    this.yardImage.src = 'image/yard.jpg';
    // 陆地高度
    this.groundHeight = menuButtonInfo.bottom + this.canvas.height * 0.5 + 6 - 35;
    // 创建返回按钮
    this.backButton = createBackButton(this.context, 10, menuButtonInfo.top, 'image/reply.png', () => {
      this.game.switchScene(new this.game.startup(this.game));
    });
    // 绘制人物
    this.character = {
      width: 20,
      height: 35,
      x: 35,
      y: this.groundHeight,
      speed: systemInfo.screenWidth * 0.005, // 人物每次移动的距离
      leftFrames: [], // 存储向左帧图片的数组
      rightFrames: [], // 存储向右帧图片的数组
      leftJumpFrames: [], // 存储向左弹跳图片的数组
      rightJumpFrames: [], // 存储向右弹跳图片的数组
      leftShotFrames: [], // 存储向左发射图片的数组
      rightShotFrames: [], // 存储向右发射图片的数据
      currentLeftFrameIndex: 0,
      currentRightFrameIndex: 0,
      currentLeftShotIndex: 0,
      currentRightShotIndex: 0,
      theLastAction: '', // 按钮停下后最后一个动作
      jumping: false,
      jumpStartY: 0,
      jumpStartTime: 0,
      jumpHeight: this.canvas.height * 0.06, // 跳跃高度
      gravity: 0.3,    // 重力
      jumpSpeed: -10,   // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
    };
    // 向右移动时候图片集锦
    const framePathsRight = ['image/right1.png', 'image/right2.png', 'image/right3.png'];
    for (const path of framePathsRight) {
      const frame = new Image();
      frame.src = path;
      this.character.rightFrames.push(frame);
    }
    // 向左移动时候图片集锦
    const framePathsLeft = ['image/left1.png', 'image/left2.png', 'image/left3.png'];
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
    // 绘制发出的冲击波图片
    this.cycleImage = new Image();
    this.cycleImage.src = 'image/cycle.png';
    this.cycleSpeed = systemInfo.screenWidth * 0.005;
    this.cycleAddDistence = 0;
    this.cycleAddHeight = 0;
    this.angle = 0; // 冲击波旋转角度
    this.cycleX = 0; // 记录发出冲击波的初始位置
    this.direction = ''; //记录冲击波的方向
    // 添加触摸事件监听
    wx.onTouchStart(this.touchStartHandler.bind(this));
    wx.onTouchEnd(this.touchEndHandler.bind(this));
    this.pressingDirection = null; // 记录当前长按的方向键
  }
  // 绘制背景
  drawBackground() {
    // 带有透明度的白色背景
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  // 绘制返回按钮
  drawBack() {
    if (this.backButton.image.complete) {
      this.context.drawImage(this.backButton.image, this.backButton.x, this.backButton.y);
    }
  }
  // 绘制游戏活动区域
  drawActionZone() {
    // 保存当前context状态
    this.context.save();
    // 绘制黑色矩形
    const rectHeight = this.canvas.height * 0.6;
    this.context.fillStyle = '#000000'; // 黑色
    this.context.fillRect(0, 0, this.canvas.width, rectHeight);
    this.context.restore();
  }
  // 绘制游戏背景
  drawGameBackground() {
    if(this.gameBackground.complete){
      this.context.drawImage(this.gameBackground, 0, 0, this.canvas.width, this.canvas.height * 0.6 - 6)
    }
  }
  // 绘制陆地
  drawYard() {
    if(this.yardImage.complete){
      this.context.drawImage(this.yardImage, 0, menuButtonInfo.bottom + this.canvas.height * 0.5 + 6, this.canvas.width, this.canvas.height * 0.1)
    }
  }
  // 绘制人物
  drawCharacter() {
    let characterImg;
    if(this.character.theLastAction == 'right' || this.character.theLastAction == ''){
      if (this.character.isShot){
        characterImg = this.character.rightShotFrames[this.character.currentRightShotIndex]
      }else{
        if(this.character.isOnGround){
          characterImg = this.character.rightFrames[this.character.currentRightFrameIndex];
        }else{
          characterImg = this.character.gravity > 0 ? this.character.rightJumpFrames[0] : this.character.rightJumpFrames[1];
        }
      }
      this.context.drawImage(characterImg, this.character.x, this.character.y, this.character.width, this.character.height);
    }else if(this.character.theLastAction == 'left'){
      if (this.character.isShot){
        characterImg = this.character.leftShotFrames[this.character.currentLeftShotIndex]
      }else{
        if(this.character.isOnGround){
          characterImg = this.character.leftFrames[this.character.currentLeftFrameIndex];
        }else{
          characterImg = this.character.gravity > 0 ? this.character.leftJumpFrames[0] : this.character.leftJumpFrames[1];
        }
      }
      this.context.drawImage(characterImg, this.character.x, this.character.y, this.character.width, this.character.height);
    }
  }
  // 更新绘制人物
  updateCharacter() {
    if(this.pressingDirection == 'right'){
      this.moveRightCharacter();
    }else if(this.pressingDirection == 'left'){
      this.moveLeftCharacter();
    }
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
        this.character.gravity = 0.3;
        this.character.velocityY = 0;
        this.character.jumpStartY = 0;
        this.character.jumpHeight = this.canvas.height * 0.06;
      }
    }
  }
  // 绘制冲击波
  drawCycleWave() {
    if (this.character.shotWave){
      if(this.direction == 'right'){
        if(this.cycleImage.complete){
          this.context.save();
          this.context.translate(this.cycleX + 18 + this.cycleAddDistence, this.cycleAddHeight + 8);
          this.context.rotate(this.angle);
          this.context.drawImage(this.cycleImage, -8, -8, 16, 16);
          this.context.restore();
          // 增加角度以实现旋转
          this.angle += 0.05;
        }
      }else if(this.direction == 'left'){
        if(this.cycleImage.complete){
          this.context.save();
          this.context.translate(this.cycleX - 18 + this.cycleAddDistence, this.cycleAddHeight + 8);
          this.context.rotate(this.angle);
          this.context.drawImage(this.cycleImage, -8, -8, 16, 16);
          this.context.restore();
          // 增加角度以实现旋转
          this.angle += 0.05;
        }
      }
    }
  }
  // 更新冲击波
  updateCycleWave(){
    if (this.character.shotWave){
      if(this.direction == 'right'){
        if (this.cycleX + this.cycleAddDistence >= this.canvas.width - 20){
          this.character.shotWave = false;
          this.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
        }else{
          this.cycleAddDistence += this.cycleSpeed;
        }
      }else if(this.direction == 'left'){
        if (this.cycleX + this.cycleAddDistence <= 20){
          this.character.shotWave = false;
          this.cycleAddDistence = 0;
          this.angle = 0;
          this.direction = '';
        }else{
          this.cycleAddDistence -= this.cycleSpeed;
        }
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
    const buttonSize = padSize * 1 + 4;
    // 保存当前context状态
    this.context.save();
    // 上方向键
    this.drawRectangle(23 + arrowSize, joystickY - padSize / 2 - buttonSize, buttonSize, 'up');
    // 下方向键
    this.drawRectangle(23 + arrowSize, joystickY + padSize / 2, buttonSize, 'down');
    // 左方向键
    this.drawRectangle(13, joystickY - buttonSize / 2, buttonSize, 'left');
    // 右方向键
    this.drawRectangle(33 + arrowSize * 2, joystickY - buttonSize / 2, buttonSize, 'right');
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
    this.context.strokeStyle = '#000000';
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
      this.context.fillStyle = '#ff880077';
      this.context.beginPath();
      this.context.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
      this.context.fill();
    } else if (direction == 'shot') {
      this.context.fillStyle = '#00ff9977';
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
        this.context.fillText('J', x + size / 2, y + size / 2 + 2);
        break;
      case 'shot':
        this.context.fillText('S', x + size / 2, y + size / 2 + 2);
        break;
    }
    this.context.closePath();
    this.context.fill();
  }
  // 绘制行为
  draw() {
    // 绘制背景
    this.drawBackground();
    // 绘制游戏活动区域
    this.drawActionZone();
    // 绘制移动按钮所在区域
    this.drawJoystick();
    // 绘制游戏背景
    this.drawGameBackground()
    // 绘制陆地
    this.drawYard();
    // 绘制人物
    this.drawCharacter();
    // 绘制冲击波
    this.drawCycleWave();
    // 绘制返回按钮
    this.drawBack();
  }
  update() {
    // 更新人物动态
    this.updateCharacter();
    // 更新冲击波
    this.updateCycleWave();
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
      btn.onClick();
      return
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
    const buttonSize = padSize * 1;
    // 判断点击位置是否在方向键上
    if (
      touchX >= 23 + arrowSize && touchX <= 23 + arrowSize + buttonSize &&
      touchY >= joystickY - padSize / 2 - buttonSize && touchY <= joystickY - padSize / 2
    ) {
      // 上方向键
      // this.pressingDirection = 'up';
      // this.character.theLastAction = 'up';
    } else if (
      touchX >= 23 + arrowSize && touchX <= 23 + arrowSize + buttonSize &&
      touchY >= joystickY + padSize / 2 && touchY <= joystickY + padSize / 2 + buttonSize
    ) {
      if (this.pressingDirection == 'right') {
        this.character.currentRightFrameIndex = 0;
        this.pressingDirection = null; // 清空按键方向
      }else if(this.pressingDirection == 'left'){
        this.character.currentLeftFrameIndex = 0;
        this.pressingDirection = null; // 清空按键方向
      }
    } else if (
      touchX >= 13 && touchX <= 13 + buttonSize &&
      touchY >= joystickY - buttonSize / 2 && touchY <= joystickY + buttonSize / 2
    ) {
      // 左方向键
      this.pressingDirection = 'left';
      this.character.theLastAction = 'left';
      this.moveLeftCharacter();
    } else if (
      touchX >= 33 + arrowSize * 2 && touchX <= 33 + arrowSize * 2 + buttonSize &&
      touchY >= joystickY - buttonSize / 2 && touchY <= joystickY + buttonSize / 2
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
      }else{
        // 第二次按下后瞬移到冲击波所在位置
        this.toWave();
      }
    }else if (
      touchX >= menuButtonInfo.right - buttonSize && touchX <= menuButtonInfo.right &&
      touchY >= joystickY - padSize / 2 - buttonSize / 2 && touchY <= joystickY - padSize / 2 + buttonSize / 2) {
      // 跳跃
      this.jumpHandler();
    }
  }
  touchEndHandler(e) {
    if(this.character.isShot){
      this.character.currentRightShotIndex = 0;
      this.character.currentLeftShotIndex = 0;
      this.character.isShot = false;
    }
  }
  // 向右移动动作
  moveRightCharacter(){
    this.character.x += this.character.speed;
    if (this.character.x >= this.canvas.width - 20){
      this.character.x = this.canvas.width - 20
    }
    this.character.currentRightFrameIndex = (this.character.currentRightFrameIndex + 1) % this.character.rightFrames.length;
  }
  // 向左移动动作
  moveLeftCharacter(){
    this.character.x -= this.character.speed;
    if (this.character.x <= 0){
      this.character.x = 0
    }
    this.character.currentLeftFrameIndex = (this.character.currentLeftFrameIndex + 1) % this.character.leftFrames.length;
  }
  // 发射的事件处理
  toShot(){
    if(this.character.isShot){
      this.character.currentRightShotIndex = (this.character.currentRightShotIndex + 1) % this.character.rightShotFrames.length;
      this.character.currentLeftShotIndex = (this.character.currentLeftShotIndex + 1) % this.character.leftShotFrames.length;
      this.character.shotWave = true;
      this.cycleAddHeight = this.character.y;
      if (this.character.theLastAction == 'right' || this.character.theLastAction == ''){
        this.cycleX = this.character.x;
        this.direction = 'right';
      }else if(this.character.theLastAction == 'left'){
        this.cycleX = this.character.x + 18;
        this.direction = 'left';
      }
    }
  }
  // 瞬移的事件处理
  toWave(){
    if (this.character.theLastAction == 'left'){
      this.character.x = this.cycleX - 24 + this.cycleAddDistence;
    }else{
      this.character.x = this.cycleX + this.cycleAddDistence;
    }
    this.character.y = this.cycleAddHeight
    this.character.shotWave = false;
    this.cycleAddDistence = 0;
    this.angle = 0;
    this.direction = '';
    this.cycleX = 0;
    if(this.character.y == this.groundHeight){
      this.character.isOnGround = true;
      this.character.jumping = false;
    }else{
      this.character.isOnGround = false;
      this.character.jumping = true;
      this.character.jumpStartY = this.groundHeight;
      this.character.jumpHeight = this.groundHeight - this.cycleAddHeight;
    }
  }
  // 跳跃的事件处理
  jumpHandler(){
    if(!this.character.jumping){
      this.character.jumping = true;
      this.character.isOnGround = false;
      this.character.jumpStartY = this.character.y;
    }
  }
  // 重置游戏
  resetGame() {
    // 绘制人物
    this.character = {
      width: 20,
      height: 35,
      x: 35,
      y: this.groundHeight,
      speed: systemInfo.screenWidth * 0.005, // 人物每次移动的距离
      leftFrames: [], // 存储向左帧图片的数组
      rightFrames: [], // 存储向右帧图片的数组
      leftJumpFrames: [], // 存储向左弹跳图片的数组
      rightJumpFrames: [], // 存储向右弹跳图片的数组
      leftShotFrames: [], // 存储向左发射图片的数组
      rightShotFrames: [], // 存储向右发射图片的数据
      currentLeftFrameIndex: 0,
      currentRightFrameIndex: 0,
      currentLeftShotIndex: 0,
      currentRightShotIndex: 0,
      theLastAction: '', // 按钮停下后最后一个动作
      jumping: false,
      jumpStartY: 0,
      jumpStartTime: 0,
      jumpHeight: this.canvas.height * 0.06, // 跳跃高度
      gravity: 0.3,    // 重力
      jumpSpeed: -10,   // 起跳初始速度
      velocityY: 0, // 纵向速度
      isOnGround: true, // 初始化在地面
      isShot: false, // 发射状态
      shotWave: false, // 发射冲击波状态
    };
    // 重置冲击波数据
    this.cycleAddDistence = 0;
    this.cycleAddHeight = 0;
    this.angle = 0; // 冲击波旋转角度
    this.cycleX = 0; // 记录发出冲击波的初始位置
    this.direction = ''; // 记录冲击波方向
  }
  // 页面销毁机制
  destroy() {
    // 移除触摸事件监听器
    wx.offTouchStart(this.touchStartHandler.bind(this));
    wx.offTouchEnd(this.touchEndHandler.bind(this));
    // 清理加载图片
    this.backButton.image.src = '';
    this.gameBackground.src = '';
    this.yardImage.src = '';
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
    // 清空数组
    this.character.leftFrames = [];
    this.character.rightFrames = [];
    this.character.leftJumpFrames = [];
    this.character.rightJumpFrames = [];
    this.character.leftShotFrames = [];
    this.character.rightShotFrames = [];
  }
  // 销毁图片时调用
  destroyImage(imageObject) {
    imageObject.src = '';
  }
}