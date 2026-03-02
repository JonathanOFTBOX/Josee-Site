import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Accueil', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Galerie', href: '#gallery' },
        { name: 'À Propos', href: '#about' },
        { name: 'Rendez-vous', href: '/rendez-vous' },
        { name: 'Contact', href: '#contact' },
    ];

    const scrollToSection = useCallback((targetId: string) => {
        if (targetId === '' || targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(targetId);
            if (element) {
                const navHeight = 80;
                const top = element.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            setIsOpen(false);

            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => scrollToSection(targetId), 300);
            } else {
                // Wait for menu close animation before scrolling
                setTimeout(() => scrollToSection(targetId), 350);
            }
        } else {
            setIsOpen(false);
            navigate(href);
        }
    };

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed w-full z-50 ${isOpen
                ? 'bg-white py-3 shadow-md'
                : `transition-all duration-500 ${scrolled
                    ? 'glass py-3 shadow-glass'
                    : 'bg-transparent py-5'
                }`
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo with animation */}
                <motion.a
                    href="#"
                    onClick={(e) => handleNavClick(e, '#home')}
                    className="font-serif text-2xl font-semibold text-primary-800 tracking-tight"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <span className="relative">
                        Douceur <span className="text-gradient">Mains & Pieds</span> Josée
                        <motion.span
                            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: scrolled ? '100%' : '0%' }}
                            transition={{ duration: 0.4 }}
                        />
                    </span>
                </motion.a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="animated-underline text-primary-800 hover:text-primary-500 transition-colors font-medium py-2"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            whileHover={{ y: -2 }}
                        >
                            {link.name}
                        </motion.a>
                    ))}
                    <motion.a
                        href="tel:5142387562"
                        className="btn-glow flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-full transition-all shadow-glow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Phone size={18} className="animate-bounce-gentle" />
                        <span className="font-semibold">514-238-7562</span>
                    </motion.a>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className="md:hidden text-primary-800 p-2 rounded-xl glass relative z-[70]"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu de navigation"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'menu'}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Menu - Full Screen Overlay - NO ANIMATIONS */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 w-full h-full bg-white z-[60] flex flex-col">
                    {/* Spacer for navbar height */}
                    <div className="h-20 flex-shrink-0" />

                    <div className="flex flex-col p-6 space-y-2 flex-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-primary-800 text-lg font-medium p-3 rounded-xl hover:bg-primary-50/50 transition-colors border-b border-gray-100"
                                onClick={(e) => handleNavClick(e, link.href)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="tel:5142387562"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-4 rounded-2xl mt-6 shadow-glow"
                        >
                            <Phone size={18} />
                            <span className="font-semibold">514-238-7562</span>
                        </a>
                    </div>
                </div>
            )}
        </motion.nav>
    );
};

export default Navbar;
