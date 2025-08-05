import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync } from "node:fs";

import { starlightMarkdownIntegration } from "starlight-markdown";

const __dirname = dirname(fileURLToPath(import.meta.url));

function starlightContextualMenuIntegration(options) {
  const config = {
    actions: ["copy", "view"], // Default actions
    ...options,
  };

  return {
    name: "starlight-contextual-menu",
    hooks: {
      "astro:config:setup": async ({ injectScript }) => {
        const contextualMenuContent = readFileSync(
          join(__dirname, "contextual-menu.js"),
          "utf-8"
        );

        injectScript(
          "page",
          `
            ${contextualMenuContent};
            initContextualMenu(${JSON.stringify({
              actions: config.actions,
            })});          
          `
        );
      },
    },
  };
}

export default function starlightContextualMenu(userConfig) {
  return {
    name: "starlight-contextual-menu-plugin",
    hooks: {
      "config:setup"({ addIntegration }) {
        addIntegration(starlightMarkdownIntegration(userConfig));
        addIntegration(starlightContextualMenuIntegration(userConfig));
      },
    },
  };
}
