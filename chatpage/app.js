import { initSidebar } from './sidebar.js';
import { initChat } from './chat.js';
import { initProfileMenu } from './profileMenu.js';
import { initSettings } from './settings.js';

window.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initChat();
  initProfileMenu();
  initSettings();
});
