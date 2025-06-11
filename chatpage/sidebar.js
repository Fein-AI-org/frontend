export function initSidebar() {
  window.toggleSidebar = function () {
    document.getElementById("sidebar").classList.toggle("collapsed");
  };
}
