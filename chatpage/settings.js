export function initSettings() {
  window.openSettings = function () {
    const overlay = document.getElementById('settingsOverlay');
    overlay.classList.add('visible');
  };

  window.closeSettings = function () {
    document.getElementById('settingsOverlay').classList.remove('visible');
  };

  window.openSettingSection = function (section) {
    const details = document.getElementById('settingDetails');
    let content = '';
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
        content = '<p>Invalid section</p>';
    }
    details.innerHTML = content;
    
  };
}
