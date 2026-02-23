import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type BookingLocation = 'local' | 'domicile' | null;

const BookingPage = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState<BookingLocation>(null);

    const CALENDLY_LOCAL = 'https://calendly.com/douceurjosee/rendez-vous-local?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a';
    const CALENDLY_DOMICILE = 'https://calendly.com/douceurjosee/soin-a-domicile?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-rose-50">
            {/* Header Bar */}
            <div className="glass z-50 shadow-glass flex-shrink-0">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <motion.button
                        onClick={() => location ? setLocation(null) : navigate('/')}
                        className="flex items-center gap-2 text-primary-700 font-medium hover:text-primary-900 transition-colors"
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={20} />
                        <span>{location ? 'Changer le lieu' : 'Retour au site'}</span>
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

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    {!location ? (
                        /* Step 1: Choose location */
                        <motion.div
                            key="choose"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl w-full"
                        >
                            <div className="text-center mb-10">
                                <motion.span
                                    className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-sm mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    📅 Rendez-vous
                                </motion.span>
                                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                                    Où souhaitez-vous recevoir <span className="text-gradient">votre soin</span> ?
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    Choisissez l'option qui vous convient le mieux
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Option: Au local */}
                                <motion.button
                                    onClick={() => setLocation('local')}
                                    className="group glass rounded-3xl p-8 text-left hover:shadow-glow transition-all relative overflow-hidden"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                            <MapPin size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Au local</h3>
                                        <p className="text-gray-600 mb-4">
                                            229, rue Cardinal<br />
                                            Saint-Amable, QC J0L 1N0
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Espace privé, calme et soigné
                                        </p>
                                        <div className="flex items-center gap-2 text-primary-600 font-semibold">
                                            <span>Choisir cette option</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Option: À domicile */}
                                <motion.button
                                    onClick={() => setLocation('domicile')}
                                    className="group glass rounded-3xl p-8 text-left hover:shadow-glow transition-all relative overflow-hidden"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                            <Home size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">À domicile</h3>
                                        <p className="text-gray-600 mb-4">
                                            Je me déplace chez vous<br />
                                            dans un rayon de 30 km
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Confort de votre foyer
                                        </p>
                                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                                            <span>Choisir cette option</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Duration info */}
                            <motion.p
                                className="text-center text-gray-400 text-sm mt-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                ⏱ Durée des soins : entre 1 h 30 et 3 h selon le service choisi
                            </motion.p>
                        </motion.div>
                    ) : (
                        /* Step 2: Calendly embed */
                        <motion.div
                            key="calendly"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-[calc(100vh-80px)]"
                        >
                            {/* Location badge */}
                            <div className="text-center mb-4">
                                <span className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium ${
                                    location === 'local' 
                                        ? 'bg-primary-100 text-primary-700' 
                                        : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {location === 'local' ? <MapPin size={16} /> : <Home size={16} />}
                                    {location === 'local' ? 'Au local — 229, rue Cardinal, Saint-Amable' : 'À domicile — Rayon de 30 km'}
                                </span>
                            </div>

                            {/* Calendly iframe */}
                            <iframe
                                src={location === 'local' ? CALENDLY_LOCAL : CALENDLY_DOMICILE}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title={`Prendre rendez-vous ${location === 'local' ? 'au local' : 'à domicile'}`}
                                style={{ border: 'none', borderRadius: '1rem' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingPage;
