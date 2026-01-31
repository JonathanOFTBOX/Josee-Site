import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, Heart, Car, Sparkles, Users } from 'lucide-react';
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
            icon: <Heart size={24} />,
            title: "Passion pour l'aide",
            description: "J'aime profondément aider les gens et leur apporter du bien-être"
        },
        {
            icon: <Users size={24} />,
            title: "Aînés en priorité",
            description: "Les personnes âgées méritent des soins de qualité et de l'attention"
        },
        {
            icon: <Car size={24} />,
            title: "Service à domicile",
            description: "Je me déplace chez vous pour votre confort et commodité"
        },
        {
            icon: <Sparkles size={24} />,
            title: "Soins personnalisés",
            description: "Chaque client est unique et mérite une attention particulière"
        }
    ];

    return (
        <section id="about" className="py-24 relative overflow-hidden" ref={containerRef}>
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/20 w-[500px] h-[500px] -bottom-[20%] right-[10%]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-sm mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        👋 Qui suis-je
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mt-2 mb-4">
                        Rencontrez <span className="text-gradient">Josée</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="order-2 lg:order-1"
                    >
                        <div className="relative">
                            {/* Image with parallax */}
                            <motion.div
                                className="relative rounded-[2rem] overflow-hidden shadow-3d"
                                style={{ y: imageY }}
                            >
                                <motion.img
                                    src={joseeImage}
                                    alt="Josée - Podologue et spécialiste en soins à domicile"
                                    className="w-full h-[600px] object-cover object-top"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.6 }}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-transparent" />
                            </motion.div>

                            {/* Decorative frame */}
                            <div className="absolute -inset-4 rounded-[2.5rem] border-2 border-primary-200/50 -z-10" />

                            {/* Floating badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8 }}
                                className="absolute -bottom-6 -right-6 glass p-5 rounded-2xl hidden md:block"
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

                            {/* Award badge */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6, type: "spring" }}
                                className="absolute -top-4 -left-4 bg-gradient-to-br from-primary-400 to-primary-600 p-4 rounded-2xl shadow-glow floating hidden md:block"
                            >
                                <Award size={28} className="text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 lg:order-2"
                    >
                        <h3 className="text-3xl font-serif text-gray-900 mb-6 leading-tight">
                            Le bien-être de mes clients, <span className="text-gradient">ma plus grande joie</span>
                        </h3>

                        <div className="space-y-4 mb-8">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Bonjour! Je suis <strong>Josée</strong>, podologue passionnée. Ma mission? <strong>Prendre soin des gens</strong>, un pied à la fois!
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                J'ai un cœur particulier pour les <strong>personnes âgées</strong>. Elles méritent tellement d'attention et de soins de qualité! C'est pourquoi j'offre des soins podologiques et de manucure adaptés aux besoins spécifiques de chaque personne, selon leur état de santé.
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                <strong>100% à domicile</strong> — je me déplace directement chez vous avec tout mon équipement professionnel. Basée à <strong>Saint-Amable</strong>, je dessers un rayon de 30 km pour votre commodité.
                            </p>
                        </div>

                        {/* Values Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass p-4 rounded-2xl group hover:shadow-glow transition-all"
                                >
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 mb-3 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        {value.icon}
                                    </motion.div>
                                    <h4 className="font-bold text-gray-900 text-sm mb-1">{value.title}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.a
                            href="#contact"
                            className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold shadow-glow"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Heart size={18} className="fill-white" />
                            <span>Prendre soin de vous</span>
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
