import { initSidebar } from './sidebar.js';
import { initChat } from './chat.js';
import { initProfileMenu } from './profileMenu.js';
import { initSettings } from './settings.js';
import { startVoice, stopVoice,toggleHold, toggleMic, toggleSpeakerDropdown } from './voice.js';

window.addEventListener('DOMContentLoaded', () => {
  window.startVoice = startVoice;
  window.stopVoice = stopVoice;
  window.toggleMic = toggleMic;
  window.toggleHold = toggleHold;
  window.toggleSpeakerDropdown = toggleSpeakerDropdown;

  initSidebar();
  initChat();
  initProfileMenu();
  initSettings();
  
});
