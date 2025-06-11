export function initProfileMenu() {
  window.toggleProfileMenu = function () {
    const isMobile = window.innerWidth < 768;
    const profileMenu = document.getElementById("profileMenu");
    const mobileMenu = document.getElementById("mobileProfileMenu");

    const alreadyShown = profileMenu.classList.contains("show");

    // Close both by default
    profileMenu.classList.remove("show");
    mobileMenu.style.display = "none";

    if (isMobile) {
      mobileMenu.style.display = "block";
    } else {
      if (!alreadyShown) profileMenu.classList.add("show");
    }
  };

  window.closeMobileMenu = function () {
    document.getElementById("mobileProfileMenu").style.display = "none";
  };
  
}
