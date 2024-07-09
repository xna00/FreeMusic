import "reflect-metadata";
import "./models/index.js";

import * as _api from "./api/index.js";

import { createServer } from "https";
import { idMap, state } from "./api/global.js";
import { ReadableStream } from "stream/web";
import { Readable } from "stream";
import {
  createReadStream,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "fs";
import { IncomingMessage, RequestListener, ServerResponse } from "http";
import assert from "assert";
import { extname, join, relative } from "path";

type Fns = {
  [K in string]?: ((...params: any) => unknown) | Fns;
};
const api: Fns = _api;

const port = 8888;
const base = `https://localhost:${port}`;

const parseFn = (req: IncomingMessage) => {
  assert(req.url);
  const pathname = new URL(req.url, base).pathname;
  const segs = pathname.split("/").slice(2);
  const fnName = segs[segs.length - 1];
  if (
    !(
      (fnName.startsWith("get") && req.method === "GET") ||
      req.method === "POST"
    )
  ) {
    return;
  }
  const fn = segs.reduce((prev, curr) => (prev as any)?.[curr], api);
  return fn;
};

const parseData = (req: IncomingMessage): Promise<string> => {
  assert(req.url);
  if (req.method === "GET") {
    const u = new URL(req.url, base);
    return Promise.resolve(u.searchParams.get("data") || "");
  } else if (req.method === "POST") {
    return new Promise((res, rej) => {
      let chunks: any[] = [];
      req.on("readable", () => {
        let chunk;
        while (null !== (chunk = req.read())) {
          chunks.push(chunk);
        }
      });
      req.on("end", () => {
        const content = chunks.join("");
        res(content);
      });
    });
  } else {
    return Promise.resolve("");
  }
};

const apiHandler = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage;
  }
) => {
  assert(req.url);
  if (
    !req.headers["content-type"]?.toLowerCase().includes("application/json")
  ) {
    res.statusCode = 415;
    res.end();
  } else {
    const fn = parseFn(req);
    if (typeof fn !== "function") {
      res.statusCode = 404;
      res.end();
      return;
    }

    const content = await parseData(req);
    const id = state.id;
    idMap[id] = {
      requestHeaders: req.headers,
    };
    console.log(id, idMap[id]);
    const send = (code: number, data: object) => {
      if (
        idMap[id].responseHeaders?.["content-type"] &&
        idMap[id].responseHeaders?.["content-type"] !== "application/json"
      ) {
        res.writeHead(code, {
          ...idMap[id].responseHeaders,
        });
        if (data instanceof ReadableStream) {
          Readable.fromWeb(data).pipe(res, {
            end: true,
          });
        }
        return;
      }
      const body = JSON.stringify(data);
      res
        .writeHead(code, {
          "content-length": Buffer.byteLength(body),
          "content-type": "application/json",
          ...idMap[id]?.responseHeaders,
        })
        .end(body);
    };
    try {
      const params = JSON.parse(content);
      console.log(fn, params);
      const ret = (fn as any)(...params);
      state.id++;
      Promise.resolve(ret)
        .then(
          (data) => {
            send(idMap[id].statusCode ?? 200, data);
          },
          (error) => {
            send(idMap[id].statusCode ?? 500, { message: String(error) });
          }
        )
        .finally(() => {
          delete idMap[id];
        });
    } catch (error) {
      send(400, {
        message: {
          params: content,
          error: String(error),
        },
      });
    } finally {
    }
  }
};

const staticFiles: Record<string, number[]> = {
  /*STATIC_FILES*/
};
function readAllFiles(dirPath: string) {
  // 读取目录中的内容
  readdirSync(dirPath).forEach((file) => {
    const fullPath = join(dirPath, file);
    const fileStats = statSync(fullPath);
    if (fileStats.isDirectory()) {
      // 如果是目录，递归调用 readAllFiles
      readAllFiles(fullPath);
    } else {
      // 如果是文件，将文件路径和状态添加到 map 中
      staticFiles["/" + relative("./www", fullPath)] = [
        ...readFileSync(fullPath, {}),
      ];
    }
  });
}

readAllFiles("./www");

console.log(staticFiles);

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".txt": "text/plain",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(
  {
    cert: readFileSync("./certs/server.crt"),
    key: readFileSync("./certs/server.key"),
  },
  (req, res) => {
    console.log(req.url);
    assert(req.url);
    if (req.url.startsWith("/api/")) {
      apiHandler(req, res);
    } else {
      const pathname = new URL(req.url, base).pathname;
      const path =
        staticFiles[pathname] !== undefined ? pathname : "/index.html";
      console.log(path);
      const ext = extname(path).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.writeHead(200, "OK", {
        "content-type": contentType,
      });
      console.log(staticFiles[path]);
      res.write(Buffer.from(staticFiles[path]));
      res.end();
    }
  }
);

server.listen(8888);
console.log(base);
