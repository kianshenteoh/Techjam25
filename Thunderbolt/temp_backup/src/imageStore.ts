// imageStore.ts
let _path: string | null = null;
export const setImagePath = (p: string | null) => { _path = p; (globalThis as any).__IMG = p; };
export const getImagePath = () => (globalThis as any).__IMG ?? _path;
