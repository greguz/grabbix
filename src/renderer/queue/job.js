import * as os from "os";
import * as path from "path";
import shortid from "shortid";

import { request } from "../../rpc/renderer";

export default async function job(plugin, comic, chapter) {
  const id = shortid.generate();
  const dir = path.join(os.tmpdir(), "grabbix", id);
  const tasks = [];

  await new Promise((resolve, reject) => {
    request(
      "grab:pages",
      { plugin, comic, chapter },
      ({ number, url }) =>
        tasks.push({
          status: "PENDING",
          type: "DOWNLOAD",
          url,
          file: path.join(dir, number.toString().padStart(5, "0"))
        }),
      err => (err ? reject(err) : resolve())
    );
  });

  // tasks.push({
  //   status: "PENDING",
  //   type: "MOVE",
  //   source: dir,
  //   target: path.join(
  //     "?",
  //     comic.title,
  //     `${chapter.number.toString().padStart(3, "0")}: ${chapter.title}`
  //   )
  // });

  return {
    id,
    status: "PENDING",
    progress: 0,
    comic,
    chapter,
    tasks
  };
}
