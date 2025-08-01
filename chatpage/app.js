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
  window.openInvestApp = openInvestApp;

  initSidebar();
  initChat();
  initProfileMenu();
  initSettings();
  
});

// Function to open the Invest app
function openInvestApp() {
  // Try to open the Invest app in a new tab
  // First, try the development server URL
  const investUrl = 'https://invest-5alediilo-shaadarts-projects.vercel.app/';
  
  // Check if the Invest app is running by attempting to open it
  const newTab = window.open(investUrl, '_blank');
  
  // If the tab doesn't open (popup blocked), provide fallback
  if (!newTab) {
    alert('Please allow popups for this site or manually navigate to: ' + investUrl);
  }
  
  // Optional: You could also check if the server is running with a fetch request
  // fetch(investUrl).catch(() => {
  //   alert('Invest app is not running. Please start it first with: npm run dev');
  // });
}
