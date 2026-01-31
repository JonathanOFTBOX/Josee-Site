import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Heart, Shield, MapPin, Phone } from 'lucide-react';
import { useRef } from 'react';
import heroImage from '../assets/images/hero-foot-care.png';

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Floating badges data
    const badges = [
        { icon: <Heart size={14} />, text: "Soins doux", delay: 0 },
        { icon: <MapPin size={14} />, text: "À domicile", delay: 0.2 },
        { icon: <Shield size={14} />, text: "Certifiée", delay: 0.4 },
    ];

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-8"
        >
            {/* Animated Gradient Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="blob bg-primary-200/40 w-[400px] md:w-[600px] h-[400px] md:h-[600px] -top-[20%] -left-[10%]" />
                <div className="blob bg-rose-200/50 w-[300px] md:w-[500px] h-[300px] md:h-[500px] top-[20%] -right-[15%]" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-4 z-10"
            >
                {/* Mobile: Image first, then content */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">

                    {/* Hero Image - Shows first on mobile */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative order-1 md:order-2 w-full"
                    >
                        <motion.div
                            className="relative z-10 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl"
                        >
                            <img
                                src={heroImage}
                                alt="Soin des pieds relaxant à domicile"
                                className="w-full h-[250px] sm:h-[350px] md:h-[500px] object-cover"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Text Content - Shows second on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center md:text-left order-2 md:order-1"
                    >
                        {/* Floating Badges */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                            {badges.map((badge, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: badge.delay + 0.3, duration: 0.5 }}
                                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full glass text-primary-700 text-xs font-medium"
                                >
                                    {badge.icon}
                                    {badge.text}
                                </motion.span>
                            ))}
                        </div>

                        {/* Main Headline */}
                        <motion.h1
                            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-900 leading-tight mb-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Vos pieds méritent{' '}
                            <span className="text-gradient italic">l'excellence</span>
                        </motion.h1>

                        <motion.p
                            className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 max-w-lg mx-auto md:mx-0 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Soins podologiques et manucure <strong>à votre domicile</strong>.
                            Service personnalisé à Saint-Amable et environs (30 km).
                        </motion.p>

                        {/* CTA Buttons - Stacked on mobile */}
                        <motion.div
                            className="flex flex-col gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            {/* Primary CTA - Call */}
                            <motion.a
                                href="tel:5142387562"
                                className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-full shadow-lg font-semibold text-base"
                                whileTap={{ scale: 0.98 }}
                            >
                                <Phone size={20} />
                                <span>Appeler: 514-238-7562</span>
                            </motion.a>

                            {/* Secondary CTA */}
                            <motion.a
                                href="#services"
                                className="flex items-center justify-center gap-2 glass text-primary-800 px-6 py-3 rounded-full font-medium"
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Découvrir nos soins</span>
                                <ArrowRight size={18} />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator - Hidden on mobile */}
            <motion.div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
            >
                <motion.div
                    className="w-6 h-10 rounded-full border-2 border-primary-300 flex justify-center p-2"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-1.5 bg-primary-500 rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
