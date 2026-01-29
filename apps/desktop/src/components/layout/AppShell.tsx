// File: apps/desktop/src/components/layout/AppShell.tsx
import { ReactNode } from 'react';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

interface AppShellProps {
    children: ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white relative selection:bg-neon-cyan/30">

            {/* Background Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

            {/* Main Layout */}
            <SideNav />

            <main className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
                <TopBar />

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full flex flex-col">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
