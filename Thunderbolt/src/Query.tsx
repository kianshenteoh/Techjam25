import { useCallback, useEffect, useState } from '@lynx-js/react'

import './Query.css'

export function Query ({ }) {
    return (
        <view>
            <view className='Background' />
            <view className='App'>
                <text className='Prompt'>Upload your image here</text>
            </view>
        </view>
    )
}