// Visitor Tracking System
(function() {
    'use strict';

    // Get visitor information
    function getVisitorInfo() {
        return {
            id: generateVisitorId(),
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            referrer: document.referrer || 'Direct',
            ip: 'Unknown', // Will be detected server-side
            country: 'Unknown',
            city: 'Unknown',
            device: getDeviceType(),
            browser: getBrowserInfo(),
            sessionId: getSessionId()
        };
    }

    // Generate unique visitor ID
    function generateVisitorId() {
        let visitorId = localStorage.getItem('nolazVisitorId');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('nolazVisitorId', visitorId);
        }
        return visitorId;
    }

    // Get session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('nolazSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('nolazSessionId', sessionId);
        }
        return sessionId;
    }

    // Detect device type
    function getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'Mobile';
        if (width <= 1024) return 'Tablet';
        return 'Desktop';
    }

    // Get browser information
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // Store visitor data locally
    function storeVisitorData(visitorInfo) {
        let visitors = JSON.parse(localStorage.getItem('nolazVisitors') || '[]');
        
        // Remove old entries (keep last 100)
        if (visitors.length > 100) {
            visitors = visitors.slice(-100);
        }
        
        visitors.push(visitorInfo);
        localStorage.setItem('nolazVisitors', JSON.stringify(visitors));
        
        // Also store in a separate live visitors array
        let liveVisitors = JSON.parse(localStorage.getItem('nolazLiveVisitors') || '[]');
        
        // Remove visitors older than 30 minutes
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        liveVisitors = liveVisitors.filter(v => v.timestamp > thirtyMinutesAgo);
        
        // Add current visitor
        liveVisitors.push(visitorInfo);
        localStorage.setItem('nolazLiveVisitors', JSON.stringify(liveVisitors));
    }

    // Track page view
    function trackPageView() {
        const visitorInfo = getVisitorInfo();
        storeVisitorData(visitorInfo);
        
        // Send heartbeat every 30 seconds to show user is still active
        setInterval(() => {
            const heartbeat = {
                ...visitorInfo,
                timestamp: new Date().toISOString(),
                action: 'heartbeat'
            };
            
            let liveVisitors = JSON.parse(localStorage.getItem('nolazLiveVisitors') || '[]');
            
            // Update existing visitor or add new one
            const existingIndex = liveVisitors.findIndex(v => v.sessionId === heartbeat.sessionId);
            if (existingIndex >= 0) {
                liveVisitors[existingIndex] = heartbeat;
            } else {
                liveVisitors.push(heartbeat);
            }
            
            // Remove visitors older than 30 minutes
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
            liveVisitors = liveVisitors.filter(v => v.timestamp > thirtyMinutesAgo);
            
            localStorage.setItem('nolazLiveVisitors', JSON.stringify(liveVisitors));
        }, 30000);
    }

    // Track user actions
    function trackAction(action, details = {}) {
        const actionData = {
            ...getVisitorInfo(),
            action: action,
            details: details
        };
        
        let actions = JSON.parse(localStorage.getItem('nolazUserActions') || '[]');
        actions.push(actionData);
        
        // Keep only last 50 actions
        if (actions.length > 50) {
            actions = actions.slice(-50);
        }
        
        localStorage.setItem('nolazUserActions', JSON.stringify(actions));
    }

    // Initialize tracking
    function initTracking() {
        // Track page load
        trackPageView();
        
        // Track clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                trackAction('click', {
                    element: e.target.tagName,
                    text: e.target.textContent.trim().substring(0, 50),
                    href: e.target.href || ''
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', function(e) {
            trackAction('form_submit', {
                form: e.target.id || 'unknown'
            });
        });
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', function() {
            trackAction('visibility_change', {
                hidden: document.hidden
            });
        });
    }

    // Start tracking when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

})();