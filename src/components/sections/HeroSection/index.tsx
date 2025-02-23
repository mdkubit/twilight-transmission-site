import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { DynamicComponent } from '../../components-registry';
import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import Section from '../Section';
import { Action } from '../../atoms';
import { AnnotatedField } from '@/components/Annotated';
import { Button, HeroSection, Link } from '@/types';

import { motion, HTMLMotionProps } from 'framer-motion';

export default function Component(props: HeroSection) {
    const { type, elementId, colors, backgroundSize, title, subtitle, text, media, actions = [], styles = {} } = props;
    const sectionFlexDirection = styles.self?.flexDirection ?? 'row';
    const sectionAlignItems = styles.self?.alignItems ?? 'center';
    return (
        <Section type={type} elementId={elementId} colors={colors} backgroundSize={backgroundSize} styles={styles.self}>
            <div
                className={classNames('flex', mapFlexDirectionStyles(sectionFlexDirection), mapStyles({ alignItems: sectionAlignItems }), 'space-y-8', {
                    'lg:space-y-0 lg:space-x-8': sectionFlexDirection === 'row',
                    'space-y-reverse lg:space-y-0 lg:space-x-8 lg:space-x-reverse': sectionFlexDirection === 'row-reverse',
                    'space-y-reverse': sectionFlexDirection === 'col-reverse'
                })}
            >
                <div className="flex-1 w-full">
                    <HeroBody {...props} />
                    <HeroActions actions={actions} styles={styles.actions} hasTopMargin={!!(title || subtitle || text)} />
                </div>
                {media && (
                    <div className="flex-1 w-full">
                        <HeroMedia media={media} />
                    </div>
                )}
            </div>
        </Section>
    );
}

function HeroMedia({ media }) {
    return <DynamicComponent {...media} />;
}

// ✅ This fixes TypeScript rejecting className on Framer Motion components
const MotionH2 = motion.h2 as React.FC<HTMLMotionProps<'h2'> & { className?: string }>;
const MotionP = motion.p as React.FC<HTMLMotionProps<'p'> & { className?: string }>;
const MotionDiv = motion.div as React.FC<HTMLMotionProps<'div'> & { className?: string }>;

function HeroBody(props: HeroSection) {
    const { title, subtitle, text, styles = {} } = props;
    return (
        <>
            {title && (
                <AnnotatedField path=".title">
                    <MotionH2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                            opacity: 1, 
                            y: [0, -3, 0], // Smooth floating
                            scale: [1, 1.02, 1] // Slight pulse
                        }}
                        transition={{ 
                            duration: 3, // Make it slower and smoother
                            ease: "easeInOut", 
                            repeat: Infinity, 
                            repeatType: "mirror" 
                        }}
                        whileHover={{ scale: 1.05 }}
                        className={classNames('h1', styles.title ? mapStyles(styles.title) : '')} 
                    >
                        {title.split('').map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.4, ease: "easeOut", delay: index * 0.05 }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </MotionH2>

                </AnnotatedField>
            )}
            {subtitle && (
                <AnnotatedField path=".subtitle">
                    <MotionP
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                        className={classNames('text-xl', 'sm:text-2xl', styles.subtitle ? mapStyles(styles.subtitle) : '')}
                    >
                        {subtitle}
                    </MotionP>
                </AnnotatedField>
            )}
            {text && (
                <AnnotatedField path=".text">
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className={classNames('sb-markdown', 'sm:text-lg', styles.text ? mapStyles(styles.text) : '', { 'mt-6': title || subtitle })}
                    >
                        <Markdown options={{ forceBlock: true, forceWrapper: true }}>
                            {text}
                        </Markdown>
                    </MotionDiv>
                </AnnotatedField>
            )}
        </>
    );
}

function HeroActions(props: { actions: (Button | Link)[]; styles: any; hasTopMargin: boolean }) {
    const { actions = [], styles = {}, hasTopMargin } = props;
    if (actions.length === 0) {
        return null;
    }
    return (
        <div
            className={classNames('overflow-x-hidden', {
                'mt-8': hasTopMargin
            })}
        >
            <div className={classNames('flex', 'flex-wrap', 'items-center', '-mx-2', mapStyles(styles))}>
                {actions.map((action, index) => (
                    <Action key={index} {...action} className="my-2 mx-2 lg:whitespace-nowrap" />
                ))}
            </div>
        </div>
    );
}

function mapFlexDirectionStyles(flexDirection?: 'row' | 'row-reverse' | 'col' | 'col-reverse') {
    switch (flexDirection) {
        case 'row':
            return ['flex-col', 'lg:flex-row'];
        case 'row-reverse':
            return ['flex-col-reverse', 'lg:flex-row-reverse'];
        case 'col':
            return ['flex-col'];
        case 'col-reverse':
            return ['flex-col-reverse'];
        default:
            return null;
    }
}
