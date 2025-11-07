
import React, { useState, useEffect } from 'react';
import Button from './Button';

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-brand-slate text-white p-4 z-50 shadow-lg">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm mb-4 sm:mb-0 sm:mr-4">
                    We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                </p>
                <Button onClick={handleAccept} variant="primary" size="sm">
                    Accept
                </Button>
            </div>
        </div>
    );
};

export default CookieBanner;
