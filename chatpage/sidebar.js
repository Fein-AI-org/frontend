export function initSidebar() {
  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    sidebar.classList.toggle("collapsed");
    sidebar.classList.toggle("show");
    if (isMobile) {
      if (sidebar.classList.contains("show") && !sidebar.classList.contains("collapsed")) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  };

  // Optional: close sidebar when clicking overlay on mobile
  if (!window._sidebarOverlayListener) {
    window._sidebarOverlayListener = true;
    document.body.addEventListener('click', function(e) {
      if (document.body.classList.contains('sidebar-open')) {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar.contains(e.target) && !e.target.closest('.menu-toggle')) {
          sidebar.classList.add('collapsed');
          sidebar.classList.remove('show');
          document.body.classList.remove('sidebar-open');
        }
      }
    }, true);
  }
}
