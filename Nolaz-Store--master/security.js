// Security Protection for Nolaz Store
(function() {
    'use strict';

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });

    // Detect DevTools
    let devtools = {
        open: false,
        orientation: null
    };

    const threshold = 160;

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial;"><h1>Access Denied</h1><p>Developer tools detected. Please close them to continue.</p></div>';
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Console warning
    console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cThis is a browser feature intended for developers. Unauthorized access is prohibited.', 'color: red; font-size: 16px;');

    // Disable text selection (except for input fields)
    document.onselectstart = function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        return false;
    };
    document.onmousedown = function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        return false;
    };

    // Disable drag and drop
    document.ondragstart = function() {
        return false;
    };

    // Clear console periodically
    setInterval(function() {
        console.clear();
    }, 1000);

    // Rate limiting for requests
    const requestLimiter = {
        requests: {},
        limit: 10,
        window: 60000, // 1 minute

        isAllowed: function(ip) {
            const now = Date.now();
            if (!this.requests[ip]) {
                this.requests[ip] = [];
            }
            
            // Remove old requests
            this.requests[ip] = this.requests[ip].filter(time => now - time < this.window);
            
            if (this.requests[ip].length >= this.limit) {
                return false;
            }
            
            this.requests[ip].push(now);
            return true;
        }
    };

    // XSS Protection
    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Override form submissions to sanitize inputs
    document.addEventListener('submit', function(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], textarea');
        
        inputs.forEach(input => {
            input.value = sanitizeInput(input.value);
        });
    });

    // Detect suspicious activity
    let suspiciousActivity = 0;
    const maxSuspiciousActivity = 5;

    function detectSuspiciousActivity() {
        suspiciousActivity++;
        if (suspiciousActivity >= maxSuspiciousActivity) {
            document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial;"><h1>Security Alert</h1><p>Suspicious activity detected. Access temporarily restricted.</p></div>';
        }
    }

    // Monitor for automated requests
    let lastActivity = Date.now();
    document.addEventListener('click', function() {
        const now = Date.now();
        if (now - lastActivity < 100) { // Too fast clicking
            detectSuspiciousActivity();
        }
        lastActivity = now;
    });

    // Protect against iframe embedding
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // Basic bot detection
    function detectBot() {
        // Check for common bot user agents
        const botPatterns = [
            /bot/i, /crawler/i, /spider/i, /scraper/i,
            /curl/i, /wget/i, /python/i, /php/i
        ];
        
        const userAgent = navigator.userAgent;
        return botPatterns.some(pattern => pattern.test(userAgent));
    }

    if (detectBot()) {
        document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial;"><h1>Access Denied</h1><p>Automated access detected.</p></div>';
    }

    // Keep admin links visible but secure
    window.addEventListener('load', function() {
        // Admin links remain visible for access
        console.log('Admin access available via Login button');
    });

})();