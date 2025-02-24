import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { Link, Action, Social } from '../../atoms';
import ImageBlock from '../../molecules/ImageBlock';

export default function Header(props) {
    const { headerVariant, isSticky, title, isTitleVisible, logo, primaryLinks = [], socialLinks = [], styles = {} } = props;
    const headerWidth = styles.self?.width ?? 'narrow';

    return (
        <header className={classNames('sb-component sb-component-header', isSticky ? 'sticky top-0 z-10' : 'relative', 'border-b border-current')}>
            <div
                className={classNames('mx-auto', mapMaxWidthStyles(headerWidth), {
                    'xl:border-l xl:border-r border-current': headerWidth === 'narrow',
                    '2xl:border-l 2xl:border-r border-current': headerWidth === 'wide'
                })}
            >
                <Link href="#main" className="sr-only">
                    Skip to main content
                </Link>
                <HeaderVariants
                    variant={headerVariant}
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

function HeaderVariants(props) {
    const { variant = 'variant-a', ...rest } = props;
    return variant === 'variant-a' ? <HeaderVariantA {...rest} /> : variant === 'variant-b' ? <HeaderVariantB {...rest} /> : <HeaderVariantC {...rest} />;
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

function HeaderVariantB(props) {
    return (
        <div className="flex items-center relative">
            <SiteLogoLink {...props} />
            <NavLinks links={props.primaryLinks} />
        </div>
    );
}

function HeaderVariantC(props) {
    return (
        <div className="flex items-center relative">
            <SiteLogoLink {...props} />
            <SocialIcons links={props.socialLinks} />
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
                        <Link
                            {...link}
                            className={classNames(
                                'relative px-4 py-2 text-lg transition duration-300',
                                isActive ? 'text-twilight font-bold' : 'text-gray-300',
                                'hover:text-cyanGlow'
                            )}
                        >
                            {link.label}
                            <motion.span
                                style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: '0.5rem', backgroundColor: 'var(--cyanGlow)', transformOrigin: 'left', scaleX: isActive ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </Link>
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
                <motion.li
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
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
                className="border-l border-current h-10 min-h-full p-4 focus:outline-none bg-red-500 text-white" 
                onClick={() => setIsMenuOpen(true)}
            >
                MENU
            </button>

            {isMenuOpen && (
                <motion.div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                        <div className="flex justify-between items-center border-b border-current pb-3">
                            <SiteLogoLink {...logoProps} />
                            <button 
                                aria-label="Close Menu" 
                                className="border-l border-current p-4" 
                                onClick={() => setIsMenuOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex flex-col items-center space-y-6 py-6">
                            <NavLinks links={primaryLinks} />
                            <SocialIcons links={socialLinks} />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
