import { useState } from '@lynx-js/react';
import { getMiniApi, pickImageOnce } from './platform.ts';

import homeIcon from './assets/icon-home.png';
import boltIcon from './assets/icon-bolt.png';

import './HomeGpt.css';

type FeatureCount = { label: string; value: number };
type Results = {
  dangerPercent: number;            // 0..100
  features: FeatureCount[];         // e.g. [{label:'Signs', value:4}, ...]
};

export function HomeGpt({ initialResults }: { initialResults?: Results }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [results, setResults] = useState<Results | undefined>(initialResults);

  const handlePick = async () => {
    const api = getMiniApi();
    if (!api) { console.warn('No mini-app API found'); return; }
    try {
      const src = await pickImageOnce(api);
      if (src) {
        setImgSrc(src);
        // TODO: call backend to score the image and update results
        // const r = await scoreImage(src); setResults(r);
      }
    } catch (e) {
      console.error('pick image failed', e);
    }
  };

  const displaySrc = imgSrc ?? boltIcon;
  const percent = results?.dangerPercent ?? -1;

  // Build up to three bars (matches the mock), extra entries will wrap nicely.
  const bars = results?.features ?? [
    // empty when no results; CSS shows dashed placeholder for .Bars when empty
  ];

  return (
    <view className="Screen">
      <view className="AppPad">

        {/* Top: welcome + subtitle */}
        <text className="Welcome">Welcome to Thunderbolt</text>
        <text className="Subtitle">Detection risk with Thunderbolt AI</text>

        {/* New image button */}
        <text className="PrimaryBtn" bindtap={handlePick}>New image</text>

        {/* Small bolt icon */}
        <image className="TopBolt" src={boltIcon} />

        {/* Results card / dashboard */}
        <view className="Card">
          <view className="CardRow">
            <text className="CardTitle">Recent results</text>
            <text className="Muted">Danger level:</text>
          </view>

          <view className="CardRow gap">
            <text className="SecondaryBtn">View image</text>

            {/* Circular gauge */}
            <view
              className={`Gauge ${percent < 0 ? 'Gauge--placeholder' : ''}`}
              // --p is the percentage for the conic gradient ring
              style={{ ['--p' as any]: `${Math.max(0, Math.min(100, percent))}` }}
            >
              <text className="GaugeValue">
                {percent < 0 ? '-' : `${percent}`}%
              </text>
            </view>
          </view>

          {/* “Your image contains…” */}
          <view className="Explain">
            <text className="ExplainHead">Your image contained several identifying features:</text>
          </view>

          {/* Bars */}
          <view className={`Bars ${bars.length ? '' : 'Bars--empty'}`}>
            {bars.slice(0, 6).map((b, i) => (
              <view className="BarCol" key={`${b.label}-${i}`}>
                <view
                  className="Bar"
                  // height scales 0–8 units -> 0–100% with cap
                  style={{ ['--h' as any]: `${Math.min(8, Math.max(0, b.value))}` }}
                />
                <text className="BarValue">{b.value}</text>
                <text className="BarLabel">{b.label}</text>
              </view>
            ))}
          </view>
        </view>


        {/* Bottom nav */}
        <view className="Nav">
          <view className="NavGrad" />
          <view className="NavInner">
            <view className="NavItem">
              <image className="NavIcon" src={homeIcon} />
            </view>
            <view> {/*className="NavItem NavItem--active"*/}
              <image className="NavIcon" src={boltIcon} />
            </view>
          </view>
        </view>
      </view>
    </view>
  );
}

/*
        <image
          className={`Preview ${imgSrc ? '' : 'Preview--placeholder'}`}
          src={displaySrc}
          style={{ width: '88vw', maxWidth: '360px', height: '0px' }}
          binderror={() => console.warn('image failed to load:', displaySrc)}
          bindload={() => console.log('image loaded:', displaySrc)}
        />
*/