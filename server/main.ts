import "reflect-metadata";
import "./models/index.js";

import * as _api from "./api/index.js";

import { createServer } from "http";
import { idMap, state } from "./api/global.js";
import { ReadableStream } from "stream/web";
import { Readable } from "stream";

type Fns = {
  [K in string]?: ((...params: any) => unknown) | Fns;
};
const api: Fns = _api;

const port = 8888;
const base = `http://localhost:${port}`;

const server = createServer((req, res) => {
  console.log(req.url);
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
  } else if (
    !req.headers["content-type"]?.toLowerCase().includes("application/json")
  ) {
    res.statusCode = 415;
    res.end();
  } else if (!req.url || !req.url.startsWith("/api/")) {
    res.statusCode = 404;
    res.end();
  } else {
    const pathname = new URL(req.url, base).pathname;
    const fn = pathname
      .split("/")
      .slice(2)
      .reduce((prev, curr) => (prev as any)?.[curr], api);
    if (typeof fn !== "function") {
      res.statusCode = 404;
      res.end();
    } else {
      let chunks: any[] = [];
      req.on("readable", () => {
        let chunk;
        while (null !== (chunk = req.read())) {
          chunks.push(chunk);
        }
      });
      req.on("end", () => {
        const id = state.id;
        idMap[id] = {
          requestHeaders: req.headers,
        };
        console.log(id, idMap[id]);
        const content = chunks.join("");
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
                end: true
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
        }
      });
    }
  }
});

server.listen(8888);
console.log(base);
