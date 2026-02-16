import { motion } from 'framer-motion';
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-rose-50 overflow-hidden">
            {/* Header Bar */}
            <div className="glass z-50 shadow-glass flex-shrink-0">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <motion.button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-primary-700 font-medium hover:text-primary-900 transition-colors"
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={20} />
                        <span>Retour au site</span>
                    </motion.button>

                    <span className="font-serif text-lg text-primary-800 hidden sm:block">
                        Douceur <span className="text-gradient">Mains & Pieds</span> Josée
                    </span>

                    <motion.a
                        href="tel:5142387562"
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-glow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Phone size={16} />
                        <span className="hidden sm:inline">514-238-7562</span>
                    </motion.a>
                </div>
            </div>

            {/* Calendly Embed - Takes all remaining height */}
            <div className="flex-1 overflow-hidden">
                <iframe
                    src="https://calendly.com/douceurjosee/30min?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Prendre rendez-vous avec Josee"
                    style={{ border: 'none' }}
                />
            </div>
        </div>
    );
};

export default BookingPage;
