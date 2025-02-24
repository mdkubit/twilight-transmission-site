import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { Link, Action } from '../../atoms';
import ImageBlock from '../../molecules/ImageBlock';

export default function Header(props) {
    const { headerVariant, isSticky, title, isTitleVisible, logo, primaryLinks = [], socialLinks = [], styles = {} } = props;
    const headerWidth = styles.self?.width ?? 'narrow';

    return (
        <header className={classNames('sb-component', 'sb-component-header', isSticky ? 'sticky top-0 z-10' : 'relative', 'border-b', 'border-current')}>
            <div className={classNames('mx-auto', mapMaxWidthStyles(headerWidth), { 'xl:border-l xl:border-r border-current': headerWidth === 'narrow', '2xl:border-l 2xl:border-r border-current': headerWidth === 'wide' })}>
                <Link href="#main" className="sr-only">
                    Skip to main content
                </Link>
                <HeaderVariantA
                    title={title}
                    isTitleVisible={isTitleVisible}
                    logo={logo}
                    primaryLinks={primaryLinks}
                    socialLinks={socialLinks}
                />
            </div>
        </header>
    );
}

function HeaderVariantA(props) {
    const { primaryLinks = [], socialLinks = [], ...logoProps } = props;
    return (
        <div className="flex items-center relative">
            <SiteLogoLink {...logoProps} />
            <NavLinks links={primaryLinks} />
            <SocialIcons links={socialLinks} />
            <MobileMenu {...props} />
        </div>
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
                        <Link {...link} className={classNames('relative px-4 py-2 text-lg transition duration-300', isActive ? 'text-twilight font-bold' : 'text-gray-300', 'hover:text-cyanGlow')}> {link.label} </Link>
                    </li>
                );
            })}
        </ul>
    );
}

function SocialIcons({ links }) {
    return (
        <ul className="hidden lg:flex space-x-4 ml-auto">
            {links.map((link, index) => (
                <motion.li key={index} whileHover={{ scale: 1.2 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <Action {...link} className="text-lg hover:text-twilight transition duration-300" />
                </motion.li>
            ))}
        </ul>
    );
}

function MobileMenu(props) {
    const { primaryLinks = [], socialLinks = [], ...logoProps } = props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="ml-auto lg:hidden">
            <button 
                aria-label="Open Menu" 
                className="border-l border-current h-10 min-h-full p-4 focus:outline-none" 
                onClick={() => setIsMenuOpen(true)}
            >
                ☰
            </button>
            {isMenuOpen && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="border-b border-current flex items-center justify-between p-4">
                        <SiteLogoLink {...logoProps} />
                        <button 
                            aria-label="Close Menu" 
                            className="border-l border-current p-4" 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col items-center space-y-6 py-12">
                        <NavLinks links={primaryLinks} />
                        <SocialIcons links={socialLinks} />
                    </div>
                </motion.div>
            )}
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
