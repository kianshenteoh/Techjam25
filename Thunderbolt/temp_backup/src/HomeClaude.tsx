import { useCallback, useEffect, useState } from '@lynx-js/react'
import { getMiniApi, pickImageOnce } from './platform.ts';
import lynxLogo from './assets/lynx-logo.png'
import homeIcon from './assets/home-icon.png' // Add your home icon asset
import thunderboltIcon from './assets/thunderbolt-icon.png' // Add your thunderbolt icon asset
import './Query.css'

interface DetectionResult {
  dangerLevel: number; // 0-100 percentage
  signs: number;
  buses: number;
  buildings: number;
}

export function Query ({}) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
    
    const handlePick = async () => {
        const api = getMiniApi();
        if (!api) { console.warn('No mini-app API found'); return; }
        try {
            const src = await pickImageOnce(api);
            if (src) {
                setImgSrc(src);
                // Simulate API call - replace with actual backend call
                // setDetectionResult({ dangerLevel: 90, signs: 4, buses: 3, buildings: 3 });
            }
        } catch (e) {
            console.error('pick image failed', e);
        }
    };

    const renderCircularProgress = () => {
        if (!detectionResult) {
            return (
                <view className="circular-progress">
                    <view className="progress-circle progress-circle--placeholder">
                        <text className="progress-text">- %</text>
                    </view>
                </view>
            );
        }

        const percentage = detectionResult.dangerLevel;
        
        return (
            <view className="circular-progress">
                <view 
                    className="progress-circle progress-circle--active"
                    style={{
                        background: `conic-gradient(from 0deg, ${percentage >= 70 ? '#ff4444' : percentage >= 40 ? '#ffaa44' : '#44ff44'} ${percentage * 3.6}deg, #333 ${percentage * 3.6}deg)`
                    }}
                >
                    <view className="progress-inner">
                        <text className="progress-text">{percentage}%</text>
                    </view>
                </view>
            </view>
        );
    };

    const renderBarChart = () => {
        if (!detectionResult) {
            return (
                <view className="bar-chart">
                    <view className="bar-item">
                        <view className="bar-container">
                            <view className="bar-placeholder">—</view>
                        </view>
                        <text className="bar-label">Signs</text>
                    </view>
                    <view className="bar-item">
                        <view className="bar-container">
                            <view className="bar-placeholder">—</view>
                        </view>
                        <text className="bar-label">Buses</text>
                    </view>
                    <view className="bar-item">
                        <view className="bar-container">
                            <view className="bar-placeholder">—</view>
                        </view>
                        <text className="bar-label">Buildings</text>
                    </view>
                </view>
            );
        }

        const maxValue = Math.max(detectionResult.signs, detectionResult.buses, detectionResult.buildings, 1);
        
        return (
            <view className="bar-chart">
                <view className="bar-item">
                    <view className="bar-container">
                        <view 
                            className="bar-fill" 
                            style={{ height: `${(detectionResult.signs / maxValue) * 80}px` }}
                        >
                            <text className="bar-count">{detectionResult.signs}</text>
                        </view>
                    </view>
                    <text className="bar-label">Signs</text>
                </view>
                <view className="bar-item">
                    <view className="bar-container">
                        <view 
                            className="bar-fill" 
                            style={{ height: `${(detectionResult.buses / maxValue) * 80}px` }}
                        >
                            <text className="bar-count">{detectionResult.buses}</text>
                        </view>
                    </view>
                    <text className="bar-label">Buses</text>
                </view>
                <view className="bar-item">
                    <view className="bar-container">
                        <view 
                            className="bar-fill" 
                            style={{ height: `${(detectionResult.buildings / maxValue) * 80}px` }}
                        >
                            <text className="bar-count">{detectionResult.buildings}</text>
                        </view>
                    </view>
                    <text className="bar-label">Buildings</text>
                </view>
            </view>
        );
    };
    
    return (
        <view className="Screen">
            <view className='Background' />
            <view className='App'>
                {/* Header Section */}
                <view className="header-section">
                    <text className="welcome-text">Welcome to Thunderbolt</text>
                    <text className="detection-text">Detection risk with Thunderbolt AI</text>
                    
                    <text className="new-image-btn" bindtap={handlePick}>New image</text>
                    
                    {/* Thunderbolt Icon */}
                    <view className="thunderbolt-icon">
                        <text className="thunderbolt-symbol">⚡</text>
                    </view>
                </view>

                {/* Dashboard Section */}
                <view className="dashboard">
                    <view className="dashboard-header">
                        <text className="recent-results-text">Recent results</text>
                        <text className="danger-level-text">Danger level:</text>
                    </view>
                    
                    <view className="dashboard-content">
                        <text className="view-image-btn">View image</text>
                        
                        {/* Circular Progress */}
                        {renderCircularProgress()}
                        
                        <text className="image-contains-text">
                            {detectionResult ? "Your image contained several identifying features:" : "Upload an image to see results"}
                        </text>
                        
                        {/* Bar Chart */}
                        {renderBarChart()}
                    </view>
                </view>

                {/* Navigation Bar */}
                <view className="navigation-bar">
                    <view className="nav-item">
                        <image className="nav-icon" src={homeIcon} />
                    </view>
                    <view className="nav-item">
                        <image className="nav-icon" src={thunderboltIcon} />
                    </view>
                </view>
            </view>
        </view>
    )
}