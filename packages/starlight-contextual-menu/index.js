import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function starlightContextualMenuIntegration(options) {
  // Set default options for contextual menu
  const config = {
    // Contextual menu options
    menuItems: [
      { label: "Edit this page", href: "#", icon: "edit" },
      { label: "View source", href: "#", icon: "code" },
      { label: "Report issue", href: "#", icon: "bug" },
    ],
    triggerIcon:
      "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z",
    position: "title-right",
    showOnHover: false,
    ...options,
  };

  return {
    name: "starlight-contextual-menu",
    hooks: {
      "astro:config:setup": async ({ injectScript }) => {
        // Read the contextual menu script
        const contextualMenuContent = readFileSync(
          join(__dirname, "contextual-menu.js"),
          "utf-8"
        );

        // Inject contextual menu script
        injectScript(
          "page",
          `
            ${contextualMenuContent};
            initContextualMenu(${JSON.stringify({
              menuItems: config.menuItems,
              triggerIcon: config.triggerIcon,
              position: config.position,
              showOnHover: config.showOnHover,
            })});          
          `
        );
      },
      "astro:build:done": ({ logger }) => {
        logger.info(
          `Starlight Contextual Menu plugin has been installed successfully! Menu position: ${config.position}`
        );
      },
    },
  };
}

export default function starlightContextualMenu(userConfig) {
  return {
    name: "starlight-contextual-menu-plugin",
    hooks: {
      "config:setup"({ addIntegration, logger }) {
        /**
         * This is the entry point of your Starlight Contextual Menu plugin.
         * The `setup` hook is called when Starlight is initialized (during the Astro `astro:config:setup` integration
         * hook).
         *
         * This plugin provides:
         * - A contextual menu on the right side of page titles
         *
         * @see https://starlight.astro.build/reference/plugins/
         */
        addIntegration(starlightContextualMenuIntegration(userConfig));
      },
    },
  };
}
