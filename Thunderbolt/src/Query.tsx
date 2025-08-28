import { useCallback, useEffect, useState } from '@lynx-js/react'
import { getMiniApi, pickImageOnce } from './platform.ts';
import lynxLogo from './assets/lynx-logo.png'
import './Query.css'

export function Query ({ }) {
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

    const displaySrc = imgSrc ?? lynxLogo;
    
    return (
        <view>
            <view className='Background' />
            <view className='App'>
                <text className='Prompt'>Upload your image here</text>

                <text className="PickBtn" bindtap={handlePick}>Choose image</text>

                <image
                    className={`Preview ${imgSrc ? '' : 'Preview--placeholder'}`}
                    src={displaySrc}
                    // Many mini-apps ignore CSS height if none provided; give explicit size:
                    style={{ width: '88vw', maxWidth: '360px', height: '200px' }}
                    // Different runtimes use different event names; add both:
                    binderror={() => console.warn('image failed to load:', displaySrc)}
                    bindload={() => console.log('image loaded:', displaySrc)}
                    />
            </view>

        </view>
    )
}
