import SoundManager from './soundManager';
import BackgroundMusic from './backgroundMusic';
const soundManager = new SoundManager();
const backgroundMusic = new BackgroundMusic();
const systemInfo = wx.getSystemInfoSync();
const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
export { soundManager, backgroundMusic, systemInfo, menuButtonInfo };