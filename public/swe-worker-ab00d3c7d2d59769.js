(() => {
  self.onmessage = async (e) => {
    switch (e.data.type) {
      case "__START_URL_CACHE__": {
        const t = e.data.url,
          a = await fetch(t);
        if (!a.redirected) {
          return (await caches.open("start-url")).put(t, a);
        }
        return Promise.resolve();
      }
      case "__FRONTEND_NAV_CACHE__": {
        const t = e.data.url,
          a = await caches.open("pages");
        if (await a.match(t, { ignoreSearch: !0 })) {
          return;
        }
        const r = await fetch(t);
        if (!r.ok) {
          return;
        }
        return a.put(t, r.clone()), Promise.resolve();
      }
      default:
        return Promise.resolve();
    }
  };
})();
