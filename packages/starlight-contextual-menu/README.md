# starlight-contextual-menu

Add contextual menu to your Starlight documentation.

![starlight-contextual-menu](https://raw.githubusercontent.com/corsfix/starlight-contextual-menu/refs/heads/main/docs/public/banner.png)

See it live on a real documentation page: [https://corsfix.com/docs/cors-proxy/api](https://corsfix.com/docs/cors-proxy/api)

## Usage

Install the plugin by running the following command:

```bash
npm i starlight-contextual-menu
```

Inside your astro.config.mjs file add the `starlightContextualMenu` plugin:

```js
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightContextualMenu from "starlight-contextual-menu";

export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      plugins: [starlightContextualMenu({
        actions: ["copy", "view", "chatgpt", "claude"]
      })],
      sidebar: [
        ...
      ],
    }),
  ],
});
```

There are 4 built in actions:

- `copy`: Copy page
- `view`: View as Markdown
- `chatgpt`: Open in ChatGPT
- `claude`: Open in Claude

By default, when not specifying actions, only `copy` and `view` will appear in the menu.

## License

[MIT](LICENSE)
