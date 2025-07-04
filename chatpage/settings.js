// Store DOM elements
let settingsOverlay,
    settingsContainer,
    settingsNav,
    settingsNavItems,
    settingsDetailPanel,
    settingsPages,
    desktopCloseButton,
    mobileCloseButton,
    mobileBackButtons;

// State variables
let currentOpenPageId = null; // For mobile, the ID of the currently visible page in detailPanel
const SETTINGS_PREFIX = 'fein_setting_';

function saveSetting(key, value) {
  try {
    localStorage.setItem(SETTINGS_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("Error saving setting to localStorage:", e);
  }
}

function loadSetting(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(SETTINGS_PREFIX + key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.error("Error loading setting from localStorage:", e);
    return defaultValue;
  }
}

function populateFormElements() {
  // Profile
  document.getElementById('setting-name').value = loadSetting('profile_name', 'User Name');
  document.getElementById('setting-email').value = loadSetting('profile_email', 'you@example.com'); // Assuming email is not changed by user here

  // Notifications
  document.getElementById('setting-notif-email').checked = loadSetting('notif_email', true);
  document.getElementById('setting-notif-push').checked = loadSetting('notif_push', true);

  // Privacy
  document.getElementById('setting-privacy-discoverable').checked = loadSetting('privacy_discoverable', false);

  // Account
  document.getElementById('setting-language').value = loadSetting('account_language', 'en');

  // General
  document.getElementById('setting-general-darktheme').checked = loadSetting('general_darktheme', true);
}

function collectAndSaveFormElements(pageId) {
  switch (pageId) {
    case 'profile':
      saveSetting('profile_name', document.getElementById('setting-name').value);
      // saveSetting('profile_email', document.getElementById('setting-email').value); // Email likely not editable
      break;
    case 'notifications':
      saveSetting('notif_email', document.getElementById('setting-notif-email').checked);
      saveSetting('notif_push', document.getElementById('setting-notif-push').checked);
      break;
    case 'privacy':
      saveSetting('privacy_discoverable', document.getElementById('setting-privacy-discoverable').checked);
      break;
    case 'account':
      saveSetting('account_language', document.getElementById('setting-language').value);
      break;
    case 'general':
      saveSetting('general_darktheme', document.getElementById('setting-general-darktheme').checked);
      break;
  }
  // console.log(`Settings for ${pageId} saved.`);
}


function isMobileView() {
  return window.innerWidth <= 768;
}

function updateNavActiveState(pageId) {
  settingsNavItems.forEach(item => {
    if (item.dataset.section === pageId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function showPage(pageId) {
  currentOpenPageId = pageId; // Keep track of the active sub-page

  if (isMobileView()) {
    // Mobile View: Stacked Navigation
    settingsNav.classList.remove('page-slide-in'); // Ensure nav is ready to slide out or stay
    settingsDetailPanel.classList.remove('nav-active'); // Prepare detail panel to be active

    if (pageId === 'settingsNavHome') { // Special ID to show main navigation list
      settingsDetailPanel.classList.remove('active-page-container');
      settingsNav.style.transform = 'translateX(0)';
      settingsDetailPanel.style.transform = 'translateX(100%)';
      currentOpenPageId = null;
    } else {
      settingsNav.style.transform = 'translateX(-100%)'; // Slide nav list out
      settingsDetailPanel.style.transform = 'translateX(0)'; // Slide detail panel in
      settingsDetailPanel.classList.add('active-page-container');

      settingsPages.forEach(page => {
        if (page.id === `settings-page-${pageId}`) {
          page.classList.add('active');
          const pageTitle = page.dataset.pageTitle || "Settings";
          const mobileHeaderTitleElement = page.querySelector('.settings-header-mobile .settings-title-mobile');
          if (mobileHeaderTitleElement) {
            mobileHeaderTitleElement.textContent = pageTitle;
          }
        } else {
          page.classList.remove('active');
        }
      });
    }
  } else {
    // Desktop View: Two-Column
    settingsPages.forEach(page => {
      page.classList.toggle('active', page.id === `settings-page-${pageId}`);
    });
    const placeholder = document.getElementById('settings-detail-placeholder');
    if (placeholder) {
      placeholder.classList.toggle('active', !pageId || pageId === 'settingsNavHome');
    }
    if (pageId && pageId !== 'settingsNavHome') {
         updateNavActiveState(pageId);
    } else {
        settingsNavItems.forEach(item => item.classList.remove('active'));
    }
  }
}


export function initSettings() {

  settingsOverlay = document.getElementById('settingsOverlay');
  settingsContainer = document.querySelector('.settings-container');
  settingsNav = document.getElementById('settingsNav');
  settingsNavItems = settingsNav.querySelectorAll('li[data-section]');
  settingsDetailPanel = document.getElementById('settingsDetailPanel');
  settingsPages = settingsDetailPanel.querySelectorAll('.settings-page');
  desktopCloseButton = document.querySelector('.settings-header-desktop .settings-close');
  mobileCloseButton = document.querySelector('#settingsNav .settings-close-mobile'); // Close from main nav list

  // Add listeners for "Save" buttons on each page
  settingsPages.forEach(page => {
    const saveButton = page.querySelector('button[id^="save-"]');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const pageId = page.id.replace('settings-page-', '');
        collectAndSaveFormElements(pageId);
        // Add some user feedback, e.g., a temporary message
        alert( (page.dataset.pageTitle || pageId) + ' settings saved!');
      });
    }
  });


  if (!settingsOverlay) return; // Do nothing if settings panel isn't on the page

  settingsNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.dataset.section;
      showPage(sectionId);
    });
  });

  mobileBackButtons = settingsDetailPanel.querySelectorAll('.settings-back-mobile');
  mobileBackButtons.forEach(button => {
    button.addEventListener('click', () => {
      showPage('settingsNavHome'); // Go back to main settings list
    });
  });

  // Also need to handle close from sub-page headers if a global close exists there
  const mobileSubPageCloseButtons = settingsDetailPanel.querySelectorAll('.settings-page .settings-close-mobile');
  mobileSubPageCloseButtons.forEach(btn => btn.addEventListener('click', closeSettings));


  // Initial setup on load
  populateFormElements(); // Load settings from localStorage into form fields
  handleResize(); // Set initial view correctly
  window.addEventListener('resize', handleResize);
}

function handleResize() {
    if (!settingsOverlay || !settingsOverlay.classList.contains('visible')) {
        return; // Don't do anything if settings isn't open
    }

    if (isMobileView()) {
        settingsContainer.classList.add('mobile-view');
        settingsContainer.classList.remove('desktop-view');
        // If a sub-page is open, keep it. If not, ensure nav is primary.
        if (!currentOpenPageId) {
            showPage('settingsNavHome');
        } else {
            showPage(currentOpenPageId); // Re-evaluate display for current page
        }
    } else {
        settingsContainer.classList.remove('mobile-view');
        settingsContainer.classList.add('desktop-view');
        // If no specific page was active (e.g. was on nav home on mobile), show placeholder or first item
        // If a page was active, try to keep it active
        const activeNavItem = settingsNav.querySelector('li.active');
        if (currentOpenPageId && currentOpenPageId !== 'settingsNavHome') {
            showPage(currentOpenPageId);
        } else if (activeNavItem) {
            showPage(activeNavItem.dataset.section);
        } else {
            showPage(settingsNavItems[0] ? settingsNavItems[0].dataset.section : null); // Show first section or placeholder
        }
    }

  window.openSettings = function () {
    const overlay = document.getElementById('settingsOverlay');
    overlay.classList.add('visible');
  };

  window.closeSettings = function () {
    document.getElementById('settingsOverlay').classList.remove('visible');
  };

  window.openSettingSection = function (section, clickedElement) {
    const details = document.getElementById('settingDetails');
    const sectionItems = document.querySelectorAll('.settings-sections li');
    let content = '';

    // Remove 'active' class from all section items
    sectionItems.forEach(item => item.classList.remove('active'));

    // Add 'active' class to the clicked item
    if (clickedElement) {
      clickedElement.classList.add('active');
    }

    switch (section) {
      case 'general':
        content = '<h3>General</h3><p>Language, theme, and accessibility settings.</p>';
        break;
      case 'notifications':
        content = '<h3>Notifications</h3><p>Manage sound, alerts, and push preferences.</p>';
        break;
      case 'personalization':
        content = '<h3>Personalization</h3><p>Customize avatars, chat style, and more.</p>';
        break;
      case 'speech':
        content = '<h3>Speech</h3><p>Enable voice input and adjust speech settings.</p>';
        break;
      case 'data':
        content = '<h3>Data Controls</h3><p>Clear history, export data, or manage privacy options.</p>';
        break;
      case 'builder':
        content = '<h3>Builder Profile</h3><p>Edit your AI builder details and profile information.</p>';
        break;
      case 'apps':
        content = '<h3>Connected Apps</h3><p>View and manage third-party app connections.</p>';
        break;
      case 'security':
        content = '<h3>Secure Sign In</h3><p>Enable 2FA, change password, and security questions.</p>';
        break;
      default:
        content = '<p>Select a setting to view details.</p>'; // Default message if no valid section
    }
    details.innerHTML = content;

    // Optional: If no section is pre-selected, select 'general' by default when settings open
    // This would require modifying openSettings() or having an initial active section.
  };

  // Modify openSettings to optionally open the 'general' section by default.
  window.openSettings = function () {
    const overlay = document.getElementById('settingsOverlay');
    overlay.classList.add('visible');
    // Optionally, open the 'general' section by default if no section is active
    const activeSection = document.querySelector('.settings-sections li.active');
    if (!activeSection) {
      const generalSectionElement = document.querySelector('.settings-sections li[onclick*="general"]');
      if (generalSectionElement) {
        openSettingSection('general', generalSectionElement);
      } else {
        // Fallback if 'general' isn't found (e.g. first item) or clear details
         document.getElementById('settingDetails').innerHTML = '<p>Select a setting to view details.</p>';
      }
    }
  };

}


window.openSettings = function () {
  if (!settingsOverlay) return;
  populateFormElements(); // Ensure form is fresh each time
  settingsOverlay.classList.add('visible');
  handleResize(); // This will call showPage with appropriate default
};

window.closeSettings = function () {
  if (!settingsOverlay) return;
  settingsOverlay.classList.remove('visible');
  // Reset to a known state for mobile if needed
  if (isMobileView()) {
    showPage('settingsNavHome'); // Go back to main settings list view
  }
  currentOpenPageId = null; // Reset current page
};
