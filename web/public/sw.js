self.addEventListener("install", (event) => {
    self.skipWaiting();
});
const createHandler = (base) => {
    return new Proxy(() => { }, {
        get(target, p, receiver) {
            if (p === "get") {
                const ret = createHandler(base);
                ret.method = "get";
                return ret;
            }
            return createHandler(`${base}/${p}`);
        },
        apply(target, thisArg, argArray) {
            return fetch(base, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(argArray),
            }).then((res) => {
                if (res.headers.get("content-type")?.toLowerCase() === "application/json") {
                    return res.json();
                }
                return res;
            });
        },
    });
};
const api = createHandler("/api");
const CACHE = "AADD";
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
        cache.put(url, res.clone());
        return res;
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
