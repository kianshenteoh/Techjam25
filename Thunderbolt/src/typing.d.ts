declare let NativeModules: {
  NativePhotoPickerModule?: {
    pick(source: string, count: number, cb: (res: { tempFiles?: { path?: string }[] } | null) => void): void;
  };
};
