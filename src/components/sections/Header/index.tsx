import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

import { Link, Action, Social } from '../../atoms';
import ImageBlock from '../../molecules/ImageBlock';

export default function Header(props) {
    const { headerVariant, isSticky, title, isTitleVisible, logo, primaryLinks = [], socialLinks = [], styles = {} } = props;
    const headerWidth = styles.self?.width ?? 'narrow';

    return (
        <header className={classNames('sb-component', 'sb-component-header', isSticky ? 'sticky top-0 z-10' : 'relative', 'border-b', 'border-current')}>
            <div
                className={classNames('mx-auto flex items-center justify-between', mapMaxWidthStyles(headerWidth), {
                    'xl:border-l xl:border-r border-current': headerWidth === 'narrow',
                    '2xl:border-l 2xl:border-r border-current': headerWidth === 'wide'
                })}
            >
                <SiteLogoLink title={title} isTitleVisible={isTitleVisible} logo={logo} />
                <NavLinks links={primaryLinks} />
                <SocialIcons links={socialLinks} />
                <MobileMenu primaryLinks={primaryLinks} socialLinks={socialLinks} />
            </div>
        </header>
    );
}

function NavLinks({ links }) {
    const router = useRouter();
    return (
        <ul className="hidden lg:flex space-x-6">
            {links.map((link, index) => {
                const isActive = router.pathname === (link.url || '#');
                return (
                    <li key={index}>
                        <Link
                            {...link}
                            className={classNames(
                                'relative px-4 py-2 text-lg transition duration-300',
                                isActive ? 'text-twilight font-bold' : 'text-gray-300',
                                'hover:text-cyanGlow'
                            )}
                        >
                            {link.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}

function SocialIcons({ links }) {
    return (
        <ul className="hidden lg:flex space-x-4">
            {links.map((link, index) => (
                <motion.li key={index} whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    <Action {...link} className="text-lg hover:text-twilight transition duration-300" />
                </motion.li>
            ))}
        </ul>
    );
}

function MobileMenu({ primaryLinks, socialLinks }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="lg:hidden flex">
            {/* 🔹 Ensuring the menu button is **always** visible */}
            <button 
                aria-label="Open Menu" 
                className="border border-current h-10 w-10 p-2 rounded-lg focus:outline-none flex items-center justify-center bg-gray-800 text-white"
                onClick={() => setIsMenuOpen(true)}
            >
                ☰
            </button>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="absolute top-4 right-4">
                            <button 
                                aria-label="Close Menu" 
                                className="p-3 bg-white text-black rounded-full shadow-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <ul className="flex flex-col space-y-6 text-white text-2xl">
                            {primaryLinks.map((link, index) => (
                                <li key={index}>
                                    <Link {...link} className="hover:text-cyanGlow">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex space-x-6 mt-8">
                            {socialLinks.map((link, index) => (
                                <motion.li key={index} whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                                    <Action {...link} className="text-lg hover:text-cyanGlow transition duration-300" />
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SiteLogoLink({ title, isTitleVisible, logo }) {
    const fixedLogo = logo || {
        type: 'ImageBlock',
        url: '/images/AstralSeal.png',
        altText: 'The Astral Seal',
        caption: ''
    };

    return (
        <div className="border-r border-current flex items-center">
            <Link href="/" className="sb-header-logo flex items-center h-full p-4">
                <ImageBlock {...fixedLogo} className={classNames('max-h-12', { 'mr-2': isTitleVisible })} />
                {title && isTitleVisible && <span className="text-base tracking-widest uppercase">{title}</span>}
            </Link>
        </div>
    );
}

function mapMaxWidthStyles(width) {
    switch (width) {
        case 'narrow':
            return 'max-w-7xl';
        case 'wide':
            return 'max-w-screen-2xl';
        case 'full':
            return 'max-w-full';
        default:
            return null;
    }
}
