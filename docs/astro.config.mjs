// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightContextualMenu from "starlight-contextual-menu";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      plugins: [
        starlightContextualMenu({
          // Contextual menu configuration
          menuItems: [
            {
              label: "Menu 1",
              href: "https://github.com/user/repo/edit/main/docs/src/content/docs/{filepath}",
              icon: "edit",
              target: "_blank",
            },
            {
              label: "Menu 2",
              href: "https://github.com/user/repo/blob/main/docs/src/content/docs/{filepath}",
              icon: "code",
              target: "_blank",
            },
            {
              label: "Menu 3",
              href: "https://github.com/user/repo/issues/new",
              icon: "bug",
              target: "_blank",
            },
          ],
          position: "title-right",
          showOnHover: false,
        }),
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
    }),
  ],
});
