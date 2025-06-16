import { initSidebar } from './sidebar.js';
import { initChat } from './chat.js';
import { initProfileMenu } from './profileMenu.js';
import { initSettings } from './settings.js';
import { startVoice, stopVoice } from './voice.js';

window.addEventListener('DOMContentLoaded', () => {
  window.startVoice = startVoice;
  window.stopVoice = stopVoice;

  initSidebar();
  initChat();
  initProfileMenu();
  initSettings();
  
});
