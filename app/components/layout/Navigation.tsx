'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path 
      ? 'header-link-active' 
      : 'header-link hover:text-footer-text-secondary';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="header-nav shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/images/tastemongers-logo-wide-fullspread-3x1-v1.png" 
                alt="TasteMongers Logo" 
                width={180}
                height={60}
                className="h-auto navbar-logo"
              />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <Link href="/blog" className={`py-2 px-4 font-semibold ${isActive('/blog')}`}>
              Blog
            </Link>
            <Link href="/ratings" className={`py-2 px-4 font-semibold ${isActive('/ratings')}`}>
              Ratings
            </Link>
            <Link href="/about" className={`py-2 px-4 font-semibold ${isActive('/about')}`}>
              About
            </Link>
          </div>
          
          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-foreground p-2 focus:outline-none mr-2"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <ThemeToggle />
          </div>
          
          {/* Desktop Theme Toggle */}
          <div className="hidden md:flex items-center">
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/blog" 
                className={`py-2 px-4 font-semibold rounded-md ${isActive('/blog')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/ratings" 
                className={`py-2 px-4 font-semibold rounded-md ${isActive('/ratings')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ratings
              </Link>
              <Link 
                href="/about" 
                className={`py-2 px-4 font-semibold rounded-md ${isActive('/about')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 