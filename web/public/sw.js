const isGetMethod = (path) => !!path.split("/").pop()?.startsWith("get");
const createHandler = (base) => {
    return new Proxy(() => { }, {
        get(target, p, receiver) {
            if (p === "makeUrl") {
                const ret = (...data) => {
                    return isGetMethod(base)
                        ? `${base}?data=${encodeURIComponent(JSON.stringify(data))}`
                        : base;
                };
                return ret;
            }
            const ret = createHandler(`${base}/${p}`);
            return ret;
        },
        apply(target, thisArg, argArray) {
            const isGet = isGetMethod(base);
            return fetch(isGet
                ? `${base}?data=${encodeURIComponent(JSON.stringify(argArray))}`
                : base, {
                method: isGet ? "GET" : "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: isGet ? null : JSON.stringify(argArray),
            }).then((res) => {
                if (res.headers.get("content-type")?.toLowerCase() === "application/json") {
                    return res.json();
                }
                return res;
            });
        },
    });
};
//
const api = createHandler("/api");
const CACHE_OLD = "AADD";
const CACHE = "FREE_MUSIC_V1";
self.addEventListener("install", (event) => {
    self.skipWaiting();
    caches.delete(CACHE_OLD);
});
const handler = async (e) => {
    const url = new URL(e.request.url);
    const pathname = url.pathname;
    const cache = await caches.open(CACHE);
    const cachedRes = await cache.match(url);
    if (cachedRes) {
        return cachedRes;
    }
    if (pathname.startsWith("/audios/")) {
        const res = await api.source.getAudio(pathname.replace("/audios/", ""));
        if (res.ok) {
            const length = Number(res.headers.get("content-length") ?? "0");
            const newRes = new Response(res.body, {
                status: 200,
                headers: {
                    "accept-ranges": "bytes",
                    "content-length": length.toString(),
                    "content-type": "application/octet-stream",
                    range: `bytes=0-${length - 1}`,
                },
            });
            cache.put(url, newRes.clone());
            console.log("newRes", newRes, [...newRes.headers]);
            return newRes;
        }
        else {
            return res;
        }
    }
    if (pathname.startsWith("/images/")) {
        const res = await api.source.getImage(pathname.replace("/images/", ""));
        cache.put(url, res.clone());
        return res;
    }
    return fetch(e.request);
};
self.addEventListener("fetch", (e) => {
    const url = new URL(e.request.url);
    const pathname = url.pathname;
    if (pathname.startsWith("/audios/") || pathname.startsWith("/images/")) {
        e.respondWith(handler(e));
    }
});
export {};
