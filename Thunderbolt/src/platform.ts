export type GenericMiniApi = {
  chooseImage?: (opts: any) => any;
  chooseMedia?: (opts: any) => any;
};

export function getMiniApi(): GenericMiniApi | null {
  const g = globalThis as any;
  return g.lynx ?? g.Lynx ?? g.LynxJSBridge ?? g.wx ?? g.uni ?? g.tt ?? g.my ?? null;
}

// Promise wrapper (handles both callback and promise styles)
export function pickImageOnce(api: GenericMiniApi): Promise<string | null> {
  return new Promise<string | null>((resolve, reject) => {
    const ok = (r: any) =>
      resolve(r?.tempFiles?.[0]?.path || r?.tempFiles?.[0]?.tempFilePath || r?.tempFilePaths?.[0] || null);

    if (api.chooseImage) {
      const r = api.chooseImage({ count: 1, sourceType: ['album', 'camera'], success: ok, fail: reject });
      if (r?.then) r.then(ok, reject);
      return;
    }
    if (api.chooseMedia) {
      const r = api.chooseMedia({ count: 1, mediaType: ['image'], success: ok, fail: reject });
      if (r?.then) r.then(ok, reject);
      return;
    }
    resolve(null);
  });
}
