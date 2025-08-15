import { useState, useEffect } from 'react';

export const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if cookie exists
        const checkCookie = () => {
            const cookies = document.cookie.split(';');
            const consentCookie = cookies.find(cookie => 
                cookie.trim().startsWith('cookieConsent=')
            );
            return !!consentCookie;
        };

        if (!checkCookie()) {
            setShowBanner(true);
        }
    }, []);

    const initializeAnalytics = () => {
        // Initialize analytics tracking
        const analyticsData = {
            firstVisit: new Date().toISOString(),
            visits: 1,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            deviceType: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            referrer: document.referrer
        };
        localStorage.setItem('siteAnalytics', JSON.stringify(analyticsData));
    };

    const trackUserBehavior = () => {
        // Track user interaction with site
        const behaviorData = {
            lastActive: new Date().toISOString(),
            pagesViewed: [],
            interactions: [],
            formSubmissions: 0
        };
        localStorage.setItem('userBehavior', JSON.stringify(behaviorData));
    };

    const saveUserPreferences = () => {
        // Save user preferences
        const preferences = {
            theme: 'light',
            fontSize: 'normal',
            notifications: true,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
    };

    const acceptCookies = () => {
        // Set cookie with 1 year expiry
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `cookieConsent=accepted; expires=${expiryDate.toUTCString()}; path=/`;

        try {
            // Initialize all tracking and preferences
            initializeAnalytics();
            trackUserBehavior();
            saveUserPreferences();

            // Start session tracking
            sessionStorage.setItem('sessionStart', new Date().toISOString());

            // Update visit count
            const visits = parseInt(localStorage.getItem('visitCount') || '0');
            localStorage.setItem('visitCount', (visits + 1).toString());

            console.log('Cookie consent accepted and tracking initialized');
        } catch (error) {
            console.error('Error initializing tracking:', error);
        }

        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div 
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
            style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                animation: 'slideUp 0.5s ease-out'
            }}
        >
            <style>
                {`
                    @keyframes slideUp {
                        from {
                            transform: translateY(100%);
                        }
                        to {
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">🍪 We Value Your Privacy</span>
                        <br />
                        <p className="mt-1">
                            We use cookies to enhance your experience, analyze site traffic, and provide better services.
                            <br />
                            <span className="text-xs text-gray-500">
                                By clicking "Accept", you agree to our use of cookies.
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={acceptCookies}
                            className="px-6 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors duration-200 flex items-center"
                        >
                            <span className="mr-2">Accept</span> ✓
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
