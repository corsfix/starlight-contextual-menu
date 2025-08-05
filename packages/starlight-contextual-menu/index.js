import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function starlightContextualMenuIntegration(options) {
  // Set default options for contextual menu
  const config = {
    menuItems: [
      {
        label: "Copy page",
        href: "https://github.com/user/repo/edit/main/docs/src/content/docs/{filepath}",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
      },
      {
        label: "View as Markdown",
        href: "https://github.com/user/repo/blob/main/docs/src/content/docs/{filepath}",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="208" height="128" viewBox="0 0 208 128"><rect width="198" height="118" x="5" y="5" ry="10" stroke="currentColor" stroke-width="10" fill="transparent"/><path stroke="currentColor" fill="currentColor" d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/></svg>`,
      },
    ],
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
