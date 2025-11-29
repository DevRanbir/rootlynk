"use client";
import {
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
    title: string;
    content: React.ReactNode;
}

export interface TimelineHeader {
    title: string;
    description: string;
    image?: string;
}

export interface SocialLink {
    icon: React.ComponentType<any>;
    text: string;
    href: string;
}

export const Timeline = ({
    data,
    header,
    socialLinks,
    onLinkHover
}: {
    data: TimelineEntry[],
    header?: TimelineHeader,
    socialLinks?: SocialLink[],
    onLinkHover?: (text: string | null) => void
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 10%", "end 50%"],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
            ref={containerRef}
        >
            <div className="max-w-7xl mx-auto py-10 px-8 md:px-8 lg:px-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <h2 className="text-5xl md:text-8xl mb-6 text-black dark:text-white max-w-4xl font-bold tracking-tight">
                        {header?.title || "My Journey"}
                    </h2>
                    <p className="text-neutral-700 dark:text-neutral-300 text-lg md:text-2xl max-w-2xl leading-relaxed mb-8">
                        {header?.description || "A timeline of my professional and personal growth."}
                    </p>

                    {socialLinks && socialLinks.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-start items-center">
                            {socialLinks.map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                                    title={item.text}
                                    onMouseEnter={() => onLinkHover?.(item.text)}
                                    onMouseLeave={() => onLinkHover?.(null)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {/* <span className="hidden md:inline text-sm font-medium">{item.text}</span> */}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                {header?.image && (
                    <div className="w-full md:w-1/3">
                        <img
                            src={header.image}
                            alt={header.title}
                            className="rounded-xl shadow-lg object-cover w-full h-48 md:h-64"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                )}
            </div>

            <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-start pt-10 md:pt-10 md:gap-10"
                    >
                        <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                            <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
                            </div>
                            <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 ">
                                {item.title}
                            </h3>
                        </div>

                        <div className="relative pl-20 pr-8 md:pl-4 w-full">
                            <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                                {item.title}
                            </h3>
                            {item.content}{" "}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + "px",
                    }}
                    className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
                >
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
