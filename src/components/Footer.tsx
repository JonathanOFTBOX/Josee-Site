import { motion } from 'framer-motion';
import { Facebook, Phone, Mail, MapPin, Heart, ArrowUp, Car } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const quickLinks = [
        { name: 'Accueil', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'À Propos', href: '#about' },
        { name: 'Rendez-vous', href: '/rendez-vous' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <footer className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />

            {/* Animated mesh overlay */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            {/* Blob decorations */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Main Footer Content */}
                <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-primary-700/50">
                    {/* Brand Column */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="font-serif text-2xl text-white mb-4">
                            Douceur <span className="text-primary-300">Mains & Pieds</span> Josée
                        </h3>
                        <p className="text-primary-200/80 max-w-sm mb-6 leading-relaxed">
                            Soins podologiques et manucure professionnels, offerts directement à votre domicile avec douceur et expertise.
                        </p>

                        {/* Contact Quick Info */}
                        <div className="space-y-3">
                            <a
                                href="tel:5142387562"
                                className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-700/50 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                    <Phone size={18} />
                                </div>
                                <span className="font-medium">514-238-7562</span>
                            </a>
                            <a
                                href="mailto:douceurjosee@gmail.com"
                                className="flex items-center gap-3 text-primary-200 hover:text-white transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-700/50 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <span className="font-medium">douceurjosee@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-3 text-primary-200">
                                <div className="w-10 h-10 rounded-xl bg-primary-700/50 flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <span>Saint-Amable et environs (30 km)</span>
                            </div>
                            <div className="flex items-center gap-3 text-primary-200">
                                <div className="w-10 h-10 rounded-xl bg-primary-700/50 flex items-center justify-center">
                                    <Car size={18} />
                                </div>
                                <span>Service 100% à domicile</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h4 className="font-bold mb-6 text-white text-lg">Liens Rapides</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <motion.li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-primary-200/80 hover:text-white transition-colors inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-0.5 bg-primary-400 group-hover:w-4 transition-all duration-300" />
                                        {link.name}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 className="font-bold mb-6 text-white text-lg">Suivez-moi</h4>
                        <div className="flex gap-3 mb-8">
                            <motion.a
                                href="https://www.facebook.com/profile.php?id=61578407608521"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-xl bg-primary-700/50 flex items-center justify-center text-primary-200 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all"
                                whileHover={{ scale: 1.1, y: -3 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Facebook size={22} />
                            </motion.a>
                        </div>

                        <p className="text-primary-300/70 text-sm mb-4">
                            Retrouvez mes avis clients et photos sur Facebook!
                        </p>

                        {/* Back to Top */}
                        <motion.button
                            onClick={scrollToTop}
                            className="flex items-center gap-2 text-primary-200/80 hover:text-white transition-colors group"
                            whileHover={{ y: -2 }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary-700/50 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <ArrowUp size={18} />
                            </div>
                            <span className="text-sm">Retour en haut</span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-300/70">
                    <p className="flex items-center gap-1">
                        © {new Date().getFullYear()} Douceur Mains & Pieds Josée. Tous droits réservés.
                    </p>
                    <p className="flex items-center gap-2">
                        Fait avec <Heart size={14} className="text-rose-400 fill-rose-400" /> à Saint-Amable
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
