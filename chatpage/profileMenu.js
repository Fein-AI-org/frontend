export function initProfileMenu() {
  const profileMenu = document.getElementById("profileMenu");
  const mobileMenu = document.getElementById("mobileProfileMenu");
  const profileButton = document.querySelector(".profile-button"); // Assuming this is the button

  window.toggleProfileMenu = function () {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Toggle mobile menu
      const isMobileMenuOpen = mobileMenu.classList.toggle("show");
      // Ensure desktop menu is closed if mobile is opening
      if (isMobileMenuOpen) {
        profileMenu.classList.remove("show");
      }
    } else {
      // Toggle desktop menu
      const isDesktopMenuOpen = profileMenu.classList.toggle("show");
      // Ensure mobile menu is closed if desktop is opening
      if (isDesktopMenuOpen) {
        mobileMenu.classList.remove("show");
      }
    }
  };

  window.closeMobileMenu = function () {
    // This function is called by an inline onclick in HTML, let's make it use the .show class
    mobileMenu.classList.remove("show");
  };

  // Close menu when clicking outside
  window.addEventListener('click', function(event) {
    // Ensure profileButton is not null before trying to check if it contains the event target
    const isClickInsideProfileButton = profileButton ? profileButton.contains(event.target) : false;

    if (!profileMenu.contains(event.target) &&
        !mobileMenu.contains(event.target) &&
        !isClickInsideProfileButton) {
      profileMenu.classList.remove('show');
      mobileMenu.classList.remove('show');
    }
  });
}
