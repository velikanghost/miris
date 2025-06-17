'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Activity, Moon, Sun, Menu, X, Github } from 'lucide-react'

interface HeaderProps {
  onThemeToggle?: () => void
  isDarkMode?: boolean
}

export default function Header({ onThemeToggle, isDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="full-width-bg sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-accent via-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-xl blur opacity-60"></div>
            </div>

            <div>
              <h1 className="text-2xl font-display text-gradient">Miris</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-muted-foreground">
                  Refreshed every 2 seconds
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onThemeToggle}
              className="hidden sm:flex h-9 w-9 p-0"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* GitHub Link */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex h-9 w-9 p-0"
              asChild
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50">
            <div className="flex flex-col gap-4 pt-4">
              <a
                href="#analytics"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </a>
              <a
                href="#protocols"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Protocols
              </a>
              <a
                href="#flows"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cross-Chain Flows
              </a>
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onThemeToggle}
                  className="flex items-center gap-2 h-9 px-3"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-4 w-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 h-9 px-3"
                  asChild
                >
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
