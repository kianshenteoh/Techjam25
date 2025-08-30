// src/platform.ts

// Mini-app style APIs we may fall back to (WeChat/Alipay/etc)
export type GenericMiniApi = {
  chooseImage?: (opts: any) => any;
  chooseMedia?: (opts: any) => any;
};

// Kept for compatibility with existing pages
export function getMiniApi(): GenericMiniApi | null {
  const g = globalThis as any;
  return g.lynx ?? g.Lynx ?? g.LynxJSBridge ?? g.wx ?? g.uni ?? g.tt ?? g.my ?? null;
}

function extractPath(r: any): string | null {
  return (
    r?.tempFiles?.[0]?.path ||
    r?.tempFiles?.[0]?.tempFilePath ||
    r?.tempFilePaths?.[0] ||
    r?.filePaths?.[0] ||
    r?.files?.[0]?.path ||
    null
  );
}

export async function pickImageOnce(api?: GenericMiniApi): Promise<string | null> {
  const g = globalThis as any;
  const lynx = g.lynx || g.Lynx || g.LynxJSBridge;

  // 1) Lynx native module (Swift)
  try {
    if (lynx?.requireModuleAsync) {
      const mod = await lynx.requireModuleAsync('NativePhotoPickerModule');
      if (mod?.pick) {
        return await new Promise<string | null>((resolve) => {
          try {
            mod.pick('album', 1, (res: any) => resolve(extractPath(res)));
          } catch {
            resolve(null);
          }
        });
      }
    }
    if (lynx?.getJSModule) {
      const mod = lynx.getJSModule('NativePhotoPickerModule');
      if (mod?.pick) {
        return await new Promise<string | null>((resolve) => {
          try {
            mod.pick('album', 1, (res: any) => resolve(extractPath(res)));
          } catch {
            resolve(null);
          }
        });
      }
    }
  } catch (e) {
    console.warn('NativePhotoPickerModule bridge failed:', e);
  }

  // 2) Fallback: mini-program APIs (album only). Narrow the functions first.
  const a = api || getMiniApi();

  const ci = a?.chooseImage;
  if (ci) {
    return await new Promise<string | null>((resolve) => {
      const ok = (r: any) => resolve(extractPath(r));
      const fail = () => resolve(null);
      const ret = ci({
        count: 1,
        sizeType: ['compressed', 'original'],
        sourceType: ['album'],
        success: ok,
        fail,
      });
      if ((ret as any)?.then) (ret as any).then(ok, fail);
    });
  }

  const cm = a?.chooseMedia;
  if (cm) {
    return await new Promise<string | null>((resolve) => {
      const ok = (r: any) => resolve(extractPath(r));
      const fail = () => resolve(null);
      const ret = cm({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album'],
        success: ok,
        fail,
      });
      if ((ret as any)?.then) (ret as any).then(ok, fail);
    });
  }

  // 3) Web fallback (no-op inside native Explorer)
  if (typeof document !== 'undefined') {
    return await new Promise<string | null>((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const f = input.files?.[0];
        resolve(f ? URL.createObjectURL(f) : null);
      };
      input.click();
    });
  }

  return null;
}
