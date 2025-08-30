// lib/imageStore.ts
let _uri: string | null = null;

export function setImagePath(uri: string | null) {
  _uri = uri;
}

export function getImagePath(): string | null {
  return _uri;
}
