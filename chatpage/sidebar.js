export function initSidebar() {
window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    sidebar.classList.toggle("show");
    document.body.classList.toggle('sidebar-open', sidebar.classList.contains("show"));
  } else {
    sidebar.classList.toggle("collapsed");
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
