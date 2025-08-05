/**
 * Creates and manages a contextual menu on the right side of the title
 * @param {Object} config - Configuration options
 * @param {Array} config.menuItems - Array of menu items {label, href, icon?, target?}
 * @param {string} config.triggerIcon - SVG path for the trigger button icon
 */
function initContextualMenu(config = {}) {
  const {
    menuItems = [
      { label: "Edit this page", href: "#", icon: "edit" },
      { label: "View source", href: "#", icon: "code" },
      { label: "Report issue", href: "#", icon: "bug" },
    ],
    triggerIcon = "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z",
    position = "title-right",
  } = config;

  document.addEventListener("DOMContentLoaded", () => {
    // Find the page title element
    const titleElement =
      document.querySelector("h1") ||
      document.querySelector(".sl-markdown-content h1") ||
      document.querySelector("[data-page-title]");

    if (!titleElement) {
      console.warn("Contextual menu: Could not find page title element");
      return;
    }

    // Get the parent element to inject the menu container
    const parentElement = titleElement.parentElement;
    if (!parentElement) {
      console.warn("Contextual menu: Could not find parent element of title");
      return;
    }

    // Create the contextual menu container
    const menuContainer = document.createElement("div");
    menuContainer.id = "contextual-menu-container";
    menuContainer.className = `contextual-menu-container ${position}`;

    // Create main action button from first menu item
    let mainActionButton = null;
    if (menuItems.length > 0) {
      const firstItem = menuItems[0];
      mainActionButton = document.createElement("a");
      mainActionButton.href = firstItem.href;
      mainActionButton.className = "contextual-main-action";
      mainActionButton.textContent = firstItem.label;

      if (firstItem.target) {
        mainActionButton.target = firstItem.target;
      }

      if (firstItem.icon) {
        const iconSvg = getIconSvg(firstItem.icon);
        mainActionButton.innerHTML = `${iconSvg}<span>${firstItem.label}</span>`;
      }
    }

    // Create the trigger button
    const triggerButton = document.createElement("button");
    triggerButton.id = "contextual-menu-trigger";
    triggerButton.className = "contextual-menu-trigger";
    triggerButton.ariaLabel = "Open contextual menu";
    triggerButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="20" 
           height="20" 
           viewBox="0 0 24 24"
           fill="none" 
           stroke="currentColor" 
           stroke-width="2" 
           stroke-linecap="round" 
           stroke-linejoin="round">
        <path d="${triggerIcon}"/>
      </svg>
    `;

    // Create the dropdown menu
    const dropdownMenu = document.createElement("div");
    dropdownMenu.id = "contextual-dropdown-menu";
    dropdownMenu.className = "contextual-dropdown-menu";

    // Create menu items
    menuItems.forEach((item) => {
      const menuItem = document.createElement("a");
      menuItem.href = item.href;
      menuItem.className = "contextual-menu-item";
      menuItem.textContent = item.label;

      if (item.target) {
        menuItem.target = item.target;
      }

      if (item.icon) {
        const iconSvg = getIconSvg(item.icon);
        menuItem.innerHTML = `${iconSvg}<span>${item.label}</span>`;
      }

      dropdownMenu.appendChild(menuItem);
    });

    // Assemble the menu
    if (mainActionButton) {
      menuContainer.appendChild(mainActionButton);
    }
    menuContainer.appendChild(triggerButton);
    menuContainer.appendChild(dropdownMenu);

    // Style the parent element to accommodate the menu
    parentElement.style.display = "flex";
    parentElement.style.justifyContent = "space-between";
    parentElement.style.alignItems = "flex-start";
    parentElement.classList.add("contextual-menu-parent");
    parentElement.appendChild(menuContainer);

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .contextual-menu-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        margin-left: auto;
      }
      
      .contextual-menu-container.title-left {
        margin-left: 0;
        margin-right: 1rem;
      }
      
      .contextual-main-action {
        background: var(--sl-color-bg);
        color: var(--sl-color-text);
        border: 1px solid var(--sl-color-gray-5);
        border-right: none;
        border-radius: 0.5rem 0 0 0.5rem;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-decoration: none;
        height: 2rem;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .contextual-main-action:hover {
        background: var(--sl-color-hairline-light);
      }
      
      .contextual-main-action svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      
      .contextual-menu-trigger {
        background: var(--sl-color-bg);
        border: 1px solid var(--sl-color-gray-5);
        border-radius: 0 0.5rem 0.5rem 0;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        color: var(--sl-color-text);
      }
      
      .contextual-menu-trigger:hover {
        background: var(--sl-color-hairline-light);
      }
      
      .contextual-dropdown-menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        background: var(--sl-color-bg);
        border: 1px solid var(--sl-color-gray-5);
        border-radius: 0.5rem;
        box-shadow: var(--sl-shadow-md);
        min-width: 180px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: opacity 0.15s ease, visibility 0.15s ease, transform 0.15s ease;
        z-index: 1000;
        padding: 4px;
      }
      
      .contextual-dropdown-menu.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .contextual-menu-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        color: var(--sl-color-text);
        text-decoration: none;
        font-size: 14px;
        line-height: 1.5;
        gap: 8px;
        border-radius: 0.5rem;
      }
      
      .contextual-menu-item:hover {
        background: var(--sl-color-hairline-light);
      }
      
      .contextual-menu-item svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
      
        /* Mobile responsive */
        @media (max-width: 72rem) {
          .contextual-menu-parent {
            flex-direction: column;
          }

          .contextual-menu-container {
            margin-left: 0;
          }
          
          .contextual-dropdown-menu {
            left: 0;
            right: auto;
          }
        }
    `;
    document.head.appendChild(style);

    let isMenuOpen = false;

    // Toggle menu function
    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      dropdownMenu.classList.toggle("show", isMenuOpen);
      triggerButton.ariaExpanded = isMenuOpen.toString();
    };

    // Close menu function
    const closeMenu = () => {
      isMenuOpen = false;
      dropdownMenu.classList.remove("show");
      triggerButton.ariaExpanded = "false";
    };

    triggerButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menuContainer.contains(e.target)) {
        closeMenu();
      }
    });

    // Cleanup function for navigation
    return () => {
      if (menuContainer.parentNode) {
        menuContainer.parentNode.removeChild(menuContainer);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  });

  // Helper function to get SVG icons
  function getIconSvg(iconName) {
    const icons = {
      edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
      code: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
      bug: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="14" x="8" y="6" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 12h-4"/><path d="M4 12h4"/><path d="m16 2-2 2"/><path d="m8 2 2 2"/></svg>`,
      link: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
      external: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    };

    return icons[iconName] || icons.link;
  }
}

export default initContextualMenu;
