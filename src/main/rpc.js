import { handle, reply } from "../rpc/main";

// import addPlugins from "./grabber/plugins";
import searchComics from "./grabber/comics";
import fetchChapters from "./grabber/chapters";
import fetchPages from "./grabber/pages";

import run from "./downloader/index";

reply("grab:comics", ({ language, plugin, text }, stream) =>
  searchComics(plugin, language, text, stream)
);

reply("grab:chapters", ({ comic, plugin }, stream) =>
  fetchChapters(plugin, comic, stream)
);

reply("grab:pages", ({ chapter, comic, plugin }, stream) =>
  fetchPages(plugin, comic, chapter, stream)
);

handle("run", run);
