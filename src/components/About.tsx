import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Car, Sparkles, Users } from 'lucide-react';
import { useRef } from 'react';
import joseeImage from '../assets/images/josee-portrait.jpg';

const About = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    const values = [
        {
            icon: <Heart size={20} />,
            title: "Passion pour l'aide",
            description: "J'aime profondément apporter du bien-être."
        },
        {
            icon: <Users size={20} />,
            title: "Aînés en priorité",
            description: "Soins attentifs et adaptés pour nos aînés."
        },
        {
            icon: <Car size={20} />,
            title: "Service à domicile",
            description: "Je me déplace chez vous, tout simplement."
        },
        {
            icon: <Sparkles size={20} />,
            title: "Soins uniques",
            description: "Chaque client mérite une attention spéciale."
        }
    ];

    return (
        <section id="about" className="py-16 md:py-24 relative overflow-hidden" ref={containerRef}>
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] -bottom-[10%] right-[10%]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 md:mb-16"
                >
                    <motion.span
                        className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-xs md:text-sm mb-3 md:mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        👋 Qui suis-je
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mt-1 mb-2">
                        Rencontrez <span className="text-gradient">Josée</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

                    {/* Content Column - Shows FIRST on mobile (order-1 default) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 lg:order-2 text-center lg:text-left"
                    >
                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6 leading-tight">
                            Le bien-être de mes clients, <br className="hidden md:block" />
                            <span className="text-gradient">ma plus grande joie</span>
                        </h3>

                        <div className="space-y-4 mb-8 text-left md:text-left">
                            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                                Bonjour! Je suis <strong>Josée</strong>, podologue passionnée. Ma mission? <strong>Prendre soin des gens</strong>, un pied à la fois!
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                J'ai un cœur particulier pour les <strong>personnes âgées</strong>. Elles méritent tellement d'attention et de soins de qualité! C'est pourquoi j'offre des soins podologiques et de manucure adaptés aux besoins spécifiques de chaque personne.
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                <strong>100% à domicile</strong> — Je me déplace chez vous. Basée à <strong>Saint-Amable</strong>, je couvre un rayon de 30 km.
                            </p>
                        </div>

                        {/* Values Grid - Compact on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass p-4 rounded-xl flex items-center gap-4 text-left group hover:shadow-glow transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                        {value.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{value.title}</h4>
                                        <p className="text-gray-500 text-xs">{value.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="text-center lg:text-left">
                            <motion.a
                                href="#contact"
                                className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold shadow-glow"
                                whileTap={{ scale: 0.98 }}
                            >
                                <Heart size={18} className="fill-white" />
                                <span>Prendre soin de vous</span>
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Image Column - Shows SECOND on mobile */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="order-2 lg:order-1 w-full max-w-lg lg:max-w-none mx-auto"
                    >
                        <div className="relative">
                            {/* Image with parallax */}
                            <motion.div
                                className="relative rounded-[2rem] overflow-hidden shadow-2xl"
                                style={{ y: imageY }}
                            >
                                <img
                                    src={joseeImage}
                                    alt="Josée - Podologue"
                                    className="w-full h-[400px] md:h-[600px] object-cover object-top"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />

                                {/* Mobile Name Badge */}
                                <div className="absolute bottom-6 left-0 right-0 text-center text-white lg:hidden">
                                    <p className="font-serif text-2xl">Josée</p>
                                    <p className="text-white/80 text-sm">Votre podologue dévouée</p>
                                </div>
                            </motion.div>

                            {/* Decorative frame */}
                            <div className="absolute -inset-3 md:-inset-4 rounded-[2.5rem] border-2 border-primary-200/50 -z-10" />

                            {/* Floating badges - visible on Desktop, hidden on mobile for cleaner look */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -right-6 glass p-5 rounded-2xl hidden lg:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-br from-rose-400 to-primary-600 p-3 rounded-xl text-white shadow-glow">
                                        <Heart size={24} className="fill-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-900">Passionnée</p>
                                        <p className="text-sm text-gray-500">par le bien-être</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default About;
