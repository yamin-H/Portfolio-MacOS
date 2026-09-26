'use client'

import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../../store/windowStore'
import Window from './Window'

import Finder from '@/components/apps/Finder'
import Terminal from '@/components/apps/Terminal'
import Calculator from '@/components/apps/Calculator'
import Safari from '@/components/apps/Safari'
import Notes from '@/components/apps/Notes'
import ResumeViewer from '@/components/apps/ResumeViewer'
import Photos from '@/components/apps/Photos'
import Weather from '@/components/apps/Weather'
import Settings from '@/components/apps/Settings'
import AppStore from '@/components/apps/AppStore'
import AboutView from '@/components/apps/about/AboutView'
import PhilosophyView from '@/components/apps/about/PhilosophyView'
import TechStackView from '@/components/apps/about/TechStackView'
import ContactView from '@/components/apps/about/ContactView'

export default function WindowManager() {
    const { windows, activeWindowId } = useWindowStore()

    const visibleWindows = windows.filter((w) => w.isOpen && !w.isMinimized)

    return (
        <AnimatePresence>
            {visibleWindows.map((win, idx) => {
                const isActive = activeWindowId === win.id
                // Base zIndex 100, active window gets elevated to top
                const zIndex = isActive ? 200 : 100 + idx

                return (
                    <Window
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        initialPosition={win.position}
                        initialSize={win.size}
                        isMinimized={win.isMinimized}
                        hideTitleBar={win.id === 'finder' || win.id === 'files' || win.id === 'terminal' || win.id === 'calculator' || win.id === 'safari' || win.id === 'notes' || win.id === 'resume' || win.id === 'pdf-viewer' || win.id === 'photos' || win.id === 'weather' || win.id === 'settings' || win.id === 'appstore'}
                        zIndex={zIndex}
                    >
                        {win.id === 'finder' || win.id === 'files' ? (
                            <Finder />
                        ) : win.id === 'terminal' ? (
                            <Terminal />
                        ) : win.id === 'calculator' ? (
                            <Calculator />
                        ) : win.id === 'safari' ? (
                            <Safari />
                        ) : win.id === 'notes' ? (
                            <Notes />
                        ) : win.id === 'photos' ? (
                            <Photos />
                        ) : win.id === 'weather' ? (
                            <Weather />
                        ) : win.id === 'settings' ? (
                            <Settings />
                        ) : win.id === 'appstore' ? (
                            <AppStore />
                        ) : win.id === 'resume' || win.id === 'pdf-viewer' ? (
                            <ResumeViewer />
                        ) : win.id === 'about' || win.id === 'about-view' ? (
                            <AboutView />
                        ) : win.id === 'philosophy' ? (
                            <PhilosophyView />
                        ) : win.id === 'techstack' ? (
                            <TechStackView />
                        ) : win.id === 'contact' ? (
                            <ContactView />
                        ) : (
                            <div
                                style={{
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        margin: 0,
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {win.title}
                                </h2>
                                <p
                                    style={{
                                        fontSize: '13px',
                                        color: 'rgba(255, 255, 255, 0.65)',
                                        lineHeight: 1.5,
                                        margin: 0,
                                    }}
                                >
                                    Application content for {win.title} will mount here.
                                </p>
                            </div>
                        )}
                    </Window>
                )
            })}
        </AnimatePresence>
    )
}
