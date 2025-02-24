import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { Link, Action } from '../../atoms';
import ImageBlock from '../../molecules/ImageBlock';

function SiteLogoLink({ title, isTitleVisible, logo }) {
    console.log("LOGO PROP:", logo);

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

function HeaderVariants(props) {
    const { variant = 'variant-a', ...rest } = props;

    console.log("🔍 HeaderVariants is rendering with variant:", variant);

    switch (variant) {
        case 'variant-a':
            return <HeaderVariantA {...rest} />;
        case 'variant-b':
            return <HeaderVariantB {...rest} />;
        case 'variant-c':
            return <HeaderVariantC {...rest} />;
        default:
            return null;
    }
}

function HeaderVariantA(props) {
    const { primaryLinks = [], socialLinks = [], ...logoProps } = props;

    console.log("✅ HeaderVariantA is rendering!");

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
                                {...{
                                    animate: isActive ? { scaleX: 1 } : { scaleX: 0 },
                                    transition: { duration: 0.3 }
                                }}
                                className="absolute left-0 bottom-0 w-full h-0.5 bg-cyanGlow origin-left scale-x-0"
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
                <span className="sr-only">Open Menu</span>
                MENU BUTTON HERE
            </button>

            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col items-center justify-center"
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
