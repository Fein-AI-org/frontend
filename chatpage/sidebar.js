export function initSidebar() {
  window.toggleSidebar = function () {
    const sidebar = document.getElementById("sidebar");
    
    // Toggle for desktop
    sidebar.classList.toggle("collapsed");
    
    // Toggle for mobile
    sidebar.classList.toggle("show");
  };
}
