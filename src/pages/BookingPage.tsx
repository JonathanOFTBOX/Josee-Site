import { motion } from 'framer-motion';
import { ArrowLeft, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-rose-50">
            {/* Header Bar */}
            <div className="glass sticky top-0 z-50 shadow-glass">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
                        Douceur <span className="text-gradient">Mains & Pieds</span> Josee
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

            {/* Page Title */}
            <div className="container mx-auto px-4 pt-8 pb-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
                        Prendre <span className="text-gradient">rendez-vous</span>
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Choisissez la date et l'heure qui vous conviennent pour votre soin a domicile.
                    </p>
                </motion.div>
            </div>

            {/* Calendly Embed */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="container mx-auto px-4 pb-12"
            >
                <div className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-xl">
                    <iframe
                        src="https://calendly.com/douceurjosee/30min?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a"
                        width="100%"
                        height="750"
                        frameBorder="0"
                        title="Prendre rendez-vous avec Josee"
                        style={{ minHeight: '700px', border: 'none' }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default BookingPage;
