import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, ArrowRight, Heart, Shield, MapPin } from 'lucide-react';
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
        { icon: <Heart size={16} />, text: "Soins doux", delay: 0 },
        { icon: <MapPin size={16} />, text: "À domicile", delay: 0.2 },
        { icon: <Shield size={16} />, text: "Certifiée", delay: 0.4 },
    ];

    return (
        <section
            id="home"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Animated Gradient Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="blob bg-primary-200/40 w-[600px] h-[600px] -top-[20%] -left-[10%]" />
                <div className="blob bg-rose-200/50 w-[500px] h-[500px] top-[20%] -right-[15%]" style={{ animationDelay: '2s' }} />
                <div className="blob bg-primary-100/60 w-[400px] h-[400px] -bottom-[10%] left-[20%]" style={{ animationDelay: '4s' }} />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #8b6f64 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-12 items-center"
            >
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-left"
                >
                    {/* Floating Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {badges.map((badge, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: badge.delay + 0.5, duration: 0.5 }}
                                className="inline-flex items-center gap-2 py-2 px-4 rounded-full glass text-primary-700 text-sm font-medium"
                            >
                                {badge.icon}
                                {badge.text}
                            </motion.span>
                        ))}
                    </div>

                    {/* Main Headline with Gradient */}
                    <motion.h1
                        className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary-900 leading-tight mb-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Vos pieds méritent <br />
                        <span className="relative">
                            <span className="text-gradient italic">l'excellence</span>
                            <motion.svg
                                viewBox="0 0 200 12"
                                className="absolute -bottom-2 left-0 w-full"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                            >
                                <motion.path
                                    d="M0,6 Q50,12 100,6 T200,6"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#a18072" />
                                        <stop offset="100%" stopColor="#d2bab0" />
                                    </linearGradient>
                                </defs>
                            </motion.svg>
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Soins podologiques et manucure professionnels <strong>directement à votre domicile</strong>. Service personnalisé dans la région de Saint-Amable et environs (30 km).
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.a
                            href="#contact"
                            className="btn-glow flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full shadow-glow-lg font-semibold"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Calendar size={20} />
                            <span>Prendre Rendez-vous</span>
                            <motion.div
                                className="w-2 h-2 rounded-full bg-white"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.a>
                        <motion.a
                            href="#services"
                            className="group flex items-center justify-center gap-2 glass text-primary-800 px-8 py-4 rounded-full font-medium hover:bg-white/80 transition-all"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>Découvrir nos soins</span>
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </motion.a>
                    </motion.div>
                </motion.div>

                {/* Hero Image with Modern Styling */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Main Image Card */}
                    <motion.div
                        className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-3d"
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent z-10" />

                        <img
                            src={heroImage}
                            alt="Soin des pieds relaxant à domicile"
                            className="w-full h-[550px] object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator - moved outside the main container */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
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
