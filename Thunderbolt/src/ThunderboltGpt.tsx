import { useState } from '@lynx-js/react';
import { getMiniApi, pickImageOnce } from './platform.ts';

import homeIcon from './assets/icon-home.png';
import boltIcon from './assets/icon-bolt.png';

import './ThunderboltGpt.css';

export function ThunderboltGpt() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handlePick = async () => {
    const api = getMiniApi();
    if (!api) { console.warn('No mini-app API found'); return; }
    try {
      const src = await pickImageOnce(api);
      if (src) setImgSrc(src);
    } catch (e) {
      console.error('pick image failed', e);
    }
  };

  const handleDetect = () => {
    // TODO: call backend to run detection for imgSrc
    console.log('Run Thunderbolt detection on:', imgSrc);
  };

  return (
    <view className="Screen">
      <view className="AppPad">

        {/* Title banner */}
        <view className="TitleRow">
          <text className="Title">Detect risk with Thunderbolt AI</text>
          <image className="TitleBolt" src={boltIcon} />
        </view>

        {/* Upload controls */}
        <text className="UploadLabel">Upload image here:</text>
        <text className="PrimaryBtn" bindtap={handlePick}>Upload</text>

        {/* Preview card */}
        <view className="PreviewCard">
          <text className="PreviewTitle">Preview</text>
          {imgSrc ? (
            <image className="PreviewImg" src={imgSrc} />
          ) : (
            <view className="PreviewBox" />
          )}
        </view>

        {/* Detect button */}
        <view className="ActionBolt" bindtap={handleDetect}>
          <image className="ActionBoltIcon" src={boltIcon} />
        </view>

        {/* Bottom nav (same markup as HomeGpt) */}
        <view className="Nav">
          <view className="NavGrad" />
          <view className="NavInner">
            <view className="NavItem">
              <image className="NavIcon" src={homeIcon} />
            </view>
            <view className="NavItem NavItem--active">
              <image className="NavIcon" src={boltIcon} />
            </view>
          </view>
        </view>
      </view>
    </view>
  );
}
