const DEFAULT_ACTIONS = {
  copy: {
    label: "Copy page",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    className: "copy-action",
    action: async () => {
      /**
       * The MIT License (MIT)
       *
       * Copyright (c) 2021 Cloudflare, Inc.
       *
       * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction,
       * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
       * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
       */
      const markdownUrl = new URL("index.md", window.location.href).toString();
      try {
        const clipboardItem = new ClipboardItem({
          ["text/plain"]: fetch(markdownUrl)
            .then((r) => r.text())
            .then((t) => new Blob([t], { type: "text/plain" }))
            .catch((e) => {
              throw new Error(`Received ${e.message} for ${markdownUrl}`);
            }),
        });

        await navigator.clipboard.write([clipboardItem]);

        const buttonElement = document.querySelector(".copy-action");
        const originalContent = buttonElement.innerHTML;
        const textSpan = buttonElement.querySelector("span");
        if (textSpan) {
          textSpan.textContent = "Copied!";
        } else {
          buttonElement.textContent = "Copied!";
        }

        setTimeout(() => {
          buttonElement.innerHTML = originalContent;
        }, 2000);
      } catch (error) {
        console.error("Failed to copy Markdown:", error);
      }
    },
  },
  view: {
    label: "View as Markdown",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="208" height="128" viewBox="0 0 208 128"><rect width="198" height="118" x="5" y="5" ry="10" stroke="currentColor" stroke-width="10" fill="transparent"/><path stroke="currentColor" fill="currentColor" d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/></svg>`,
    action: () => {
      window.open(new URL("index.md", window.location.href), "_blank");
    },
  },
};

function createMenuItemsFromActions(actions) {
  return actions
    .map((action) => {
      // Handle both string actions and object actions
      if (typeof action === "string") {
        const menuItem = DEFAULT_ACTIONS[action];
        if (!menuItem) {
          console.warn(
            `Unknown action: ${action}. Available actions: ${Object.keys(
              DEFAULT_ACTIONS
            ).join(", ")}`
          );
          return null;
        }
        return { ...menuItem };
      } else if (typeof action === "object" && action !== null) {
        // Custom action object
        return { ...action };
      }

      return null;
    })
    .filter(Boolean);
}

function initContextualMenu(config) {
  // Generate menu items from actions or use provided menuItems
  const menuItems = createMenuItemsFromActions(config.actions);

  document.addEventListener("DOMContentLoaded", () => {
    const titleElement =
      document.querySelector("h1") ||
      document.querySelector(".sl-markdown-content h1") ||
      document.querySelector("[data-page-title]");

    if (!titleElement) {
      console.warn("Contextual menu: Could not find page title element");
      return;
    }

    const parentElement = titleElement.parentElement;
    if (!parentElement) {
      console.warn("Contextual menu: Could not find parent element of title");
      return;
    }

    const menuContainer = document.createElement("div");
    menuContainer.id = "contextual-menu-container";
    menuContainer.className = `contextual-menu-container`;

    let mainActionButton = null;
    if (menuItems.length > 0) {
      const firstItem = menuItems[0];
      mainActionButton = document.createElement("button");
      mainActionButton.className = `contextual-main-action ${
        firstItem.className || ""
      }`.trim();
      mainActionButton.textContent = firstItem.label;

      mainActionButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (firstItem.action && typeof firstItem.action === "function") {
          firstItem.action();
        }
      });

      if (firstItem.icon) {
        mainActionButton.innerHTML = `${firstItem.icon}<span>${firstItem.label}</span>`;
      }
    }

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
        <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"/>
      </svg>
    `;

    const dropdownMenu = document.createElement("div");
    dropdownMenu.id = "contextual-dropdown-menu";
    dropdownMenu.className = "contextual-dropdown-menu";

    menuItems.forEach((item) => {
      const menuItem = document.createElement("button");
      menuItem.className = `contextual-menu-item ${
        item.className || ""
      }`.trim();
      menuItem.textContent = item.label;

      menuItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (item.action && typeof item.action === "function") {
          item.action();
        }
        closeMenu(); // Close the menu after action is executed
      });

      if (item.icon) {
        menuItem.innerHTML = `${item.icon}<span>${item.label}</span>`;
      }

      dropdownMenu.appendChild(menuItem);
    });

    if (mainActionButton) {
      menuContainer.appendChild(mainActionButton);
    }
    menuContainer.appendChild(triggerButton);
    menuContainer.appendChild(dropdownMenu);

    parentElement.style.display = "flex";
    parentElement.style.justifyContent = "space-between";
    parentElement.style.alignItems = "flex-start";
    parentElement.classList.add("contextual-menu-parent");
    parentElement.appendChild(menuContainer);

    const style = document.createElement("style");
    style.textContent = `
      .contextual-menu-container {
        position: relative;
        display: inline-flex;
        align-items: center;
        margin-left: auto;
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
        font-family: inherit;
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
        border: none;
        background: transparent;
        width: 100%;
        text-align: left;
        cursor: pointer;
        font-family: inherit;
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

    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      dropdownMenu.classList.toggle("show", isMenuOpen);
      triggerButton.ariaExpanded = isMenuOpen.toString();
    };

    const closeMenu = () => {
      isMenuOpen = false;
      dropdownMenu.classList.remove("show");
      triggerButton.ariaExpanded = "false";
    };

    triggerButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    document.addEventListener("click", (e) => {
      if (!menuContainer.contains(e.target)) {
        closeMenu();
      }
    });

    return () => {
      if (menuContainer.parentNode) {
        menuContainer.parentNode.removeChild(menuContainer);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  });
}

export default initContextualMenu;
