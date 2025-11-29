import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export const timelineData = [
    {
        title: "About Me",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    I am a passionate developer with a love for building beautiful and functional web applications.
                    I specialize in React, TypeScript, and modern UI libraries like Shadcn UI and Tailwind CSS.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="coding setup"
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
                    />
                    <img
                        src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="coding"
                        className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset]"
                    />
                </div>
            </div>
        ),
    },
    {
        title: "Education",
        content: (
            <div>
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                    Graduated with a degree in Computer Science. Learned the fundamentals of algorithms, data structures, and software engineering.
                </p>
            </div>
        ),
    },
    {
        title: "Connect",
        content: (
            <div className="flex flex-col gap-4">
                <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
                    Find me on social media:
                </p>
                <div className="flex flex-wrap gap-4">
                    <a href="#" className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                        <Github className="w-4 h-4" /> GitHub
                    </a>
                    <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a href="#" className="flex items-center gap-2 px-4 py-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors">
                        <Twitter className="w-4 h-4" /> Twitter
                    </a>
                    <a href="#" className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <Mail className="w-4 h-4" /> Email
                    </a>
                </div>
            </div>
        ),
    },
    {
        title: "Projects",
        content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Project Alpha</h4>
                        <Github className="w-5 h-5 text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        A full-stack web application built with React, Node.js, and PostgreSQL.
                    </p>
                    <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">React</span>
                        <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">Node.js</span>
                    </div>
                </div>
                <div className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">Project Beta</h4>
                        <Github className="w-5 h-5 text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        An AI-powered task management tool using OpenAI API.
                    </p>
                    <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">Python</span>
                        <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-800 rounded">FastAPI</span>
                    </div>
                </div>
            </div>
        ),
    },
];
