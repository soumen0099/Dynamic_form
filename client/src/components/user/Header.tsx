import { useState, useEffect } from 'react';
import { BookOpen, Phone, X, Menu } from 'lucide-react';
import type { BranchSettings } from '../../API/services/settingsService';

interface HeaderProps {
    settings: BranchSettings;
    scrollToSection: (sectionId: string) => void;
}

export const Header = ({ settings, scrollToSection }: HeaderProps) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            
            if (mobileMenu && !mobileMenu.contains(event.target as Node) && 
                mobileMenuButton && !mobileMenuButton.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);
    return (
        <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between py-4">
                    {/* Enhanced Logo & Site Name with Animation */}
                    <div className="flex items-center space-x-4 group cursor-pointer">
                        {settings.header?.logo ? (
                            <div className="relative">
                                <img
                                    src={settings.header.logo}
                                    alt="Institute Logo"
                                    className="h-16 w-16 object-contain rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300"
                                />
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`
                                    }}
                                ></div>
                            </div>
                        ) : (
                            <div
                                className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500"
                                style={{
                                    background: `linear-gradient(135deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`
                                }}
                            >
                                <BookOpen className="text-white transform group-hover:scale-110 transition-transform duration-300" size={32} />
                            </div>
                        )}
                        <div className="group-hover:translate-x-1 transition-transform duration-300">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-gray-800 transition-colors duration-300">
                                {settings.header?.siteName || "Institute"}
                            </h1>
                            {settings.header?.tagline && (
                                <p
                                    className="font-medium text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ color: settings.theme?.primaryColor || 'var(--primary-color)' }}
                                >
                                    {settings.header.tagline}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Modern Navigation with Enhanced Effects */}
                    {settings.header?.navigation && settings.header.navigation.length > 0 && (
                        <nav className="hidden md:flex items-center space-x-2">
                            {settings.header.navigation
                                .filter(nav => nav.isActive)
                                .sort((a, b) => a.order - b.order)
                                .map((navItem, index) => {
                                    const isScrollLink = navItem.url.startsWith('#') ||
                                        navItem.title.toLowerCase() === 'home' ||
                                        navItem.title.toLowerCase() === 'about' ||
                                        navItem.title.toLowerCase() === 'services' ||
                                        navItem.title.toLowerCase() === 'contact';

                                    if (isScrollLink) {
                                        let sectionId = navItem.url.replace('#', '');

                                        if (navItem.title.toLowerCase() === 'home') sectionId = 'hero';
                                        if (navItem.title.toLowerCase() === 'about') sectionId = 'about';
                                        if (navItem.title.toLowerCase() === 'services') sectionId = 'services';
                                        if (navItem.title.toLowerCase() === 'contact') sectionId = 'contact';

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => scrollToSection(sectionId)}
                                                className="relative text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:text-white hover:-translate-y-1 hover:shadow-lg group overflow-hidden"
                                                style={{
                                                    background: 'linear-gradient(145deg, transparent, transparent)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = `linear-gradient(145deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`;
                                                    e.currentTarget.style.boxShadow = `0 10px 25px ${settings.theme?.primaryColor || 'var(--primary-color)'}40`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(145deg, transparent, transparent)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <span className="relative z-10">{navItem.title}</span>
                                                <div
                                                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    style={{
                                                        background: `linear-gradient(45deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}20, ${settings.theme?.accentColor || 'var(--accent-color)'}20)`
                                                    }}
                                                ></div>
                                            </button>
                                        );
                                    }

                                    return (
                                        <a
                                            key={index}
                                            href={navItem.url}
                                            className="relative text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:text-white hover:-translate-y-1 hover:shadow-lg group overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(145deg, transparent, transparent)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = `linear-gradient(145deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`;
                                                e.currentTarget.style.boxShadow = `0 10px 25px ${settings.theme?.primaryColor || 'var(--primary-color)'}40`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(145deg, transparent, transparent)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <span className="relative z-10">{navItem.title}</span>
                                            <div
                                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{
                                                    background: `linear-gradient(45deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}20, ${settings.theme?.accentColor || 'var(--accent-color)'}20)`
                                                }}
                                            ></div>
                                        </a>
                                    );
                                })}

                            {/* WhatsApp CTA Button */}
                            <div className="ml-4 pl-4 border-l border-gray-200">
                                <a
                                    href="https://wa.me/+918436618251?text=Hi,%20I'm%20interested%20in%20learning%20more%20about%20your%20courses."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl inline-flex items-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 15px 35px ${settings.theme?.primaryColor || 'var(--primary-color)'}50`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = `0 5px 15px ${settings.theme?.primaryColor || 'var(--primary-color)'}30`;
                                    }}
                                >
                                    <Phone className="mr-2" size={16} />
                                    Get Started
                                </a>
                            </div>
                        </nav>
                    )}

                    {/* Mobile Menu Button - Enhanced */}
                    <div className="md:hidden">
                        <button
                            id="mobile-menu-button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 rounded-xl transition-all duration-300 transform hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}20, ${settings.theme?.accentColor || 'var(--accent-color)'}20)`
                            }}
                        >
                            {isMobileMenuOpen ? (
                                <X 
                                    size={24} 
                                    style={{ color: settings.theme?.primaryColor || 'var(--primary-color)' }}
                                />
                            ) : (
                                <Menu 
                                    size={24} 
                                    style={{ color: settings.theme?.primaryColor || 'var(--primary-color)' }}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    id="mobile-menu"
                    className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
                >
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        {settings.header?.navigation
                            ?.filter(nav => nav.isActive)
                            .sort((a, b) => a.order - b.order)
                            .map((navItem, index) => {
                                const isScrollLink = navItem.url.startsWith('#') ||
                                    navItem.title.toLowerCase() === 'home' ||
                                    navItem.title.toLowerCase() === 'about' ||
                                    navItem.title.toLowerCase() === 'services' ||
                                    navItem.title.toLowerCase() === 'contact';

                                if (isScrollLink) {
                                    let sectionId = navItem.url.replace('#', '');

                                    if (navItem.title.toLowerCase() === 'home') sectionId = 'hero';
                                    if (navItem.title.toLowerCase() === 'about') sectionId = 'about';
                                    if (navItem.title.toLowerCase() === 'services') sectionId = 'services';
                                    if (navItem.title.toLowerCase() === 'contact') sectionId = 'contact';

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                scrollToSection(sectionId);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            {navItem.title}
                                        </button>
                                    );
                                }

                                return (
                                    <a
                                        key={index}
                                        href={navItem.url}
                                        className="block px-4 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        {navItem.title}
                                    </a>
                                );
                            })}

                        {/* Mobile WhatsApp Button */}
                        <a
                            href="https://wa.me/+918436618251?text=Hi,%20I'm%20interested%20in%20learning%20more%20about%20your%20courses."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center mt-4 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                            style={{
                                background: `linear-gradient(135deg, ${settings.theme?.primaryColor || 'var(--primary-color)'}, ${settings.theme?.accentColor || 'var(--accent-color)'})`
                            }}
                        >
                            <Phone className="inline-block mr-2" size={16} />
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};
