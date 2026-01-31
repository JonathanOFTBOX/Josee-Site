import { motion } from 'framer-motion';
import { Scissors, Sparkles, Home, ShieldCheck, ArrowUpRight, Car } from 'lucide-react';

const services = [
    {
        icon: <Scissors className="w-7 h-7" />,
        title: "Soin Complet des Pieds",
        description: "Coupe et entretien des ongles, amincissement des ongles mycosés ou épaissis, réduction des callosités et cors. Tout directement chez vous.",
        gradient: "from-blue-400 to-indigo-500",
        bgLight: "bg-blue-50",
    },
    {
        icon: <Sparkles className="w-7 h-7" />,
        title: "Manucure",
        description: "Soins des mains et des ongles avec finition soignée. Service adapté à tous, incluant les personnes diabétiques.",
        gradient: "from-purple-400 to-pink-500",
        bgLight: "bg-purple-50",
    },
    {
        icon: <Home className="w-7 h-7" />,
        title: "100% À Domicile",
        description: "Je me déplace directement chez vous avec tout mon équipement professionnel. Confort et commodité garantis.",
        gradient: "from-emerald-400 to-teal-500",
        bgLight: "bg-emerald-50",
    },
    {
        icon: <ShieldCheck className="w-7 h-7" />,
        title: "Soins Diabétiques",
        description: "Protocoles spécialisés et sécuritaires pour la santé des pieds des personnes diabétiques. Instruments stérilisés.",
        gradient: "from-rose-400 to-orange-400",
        bgLight: "bg-rose-50",
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const Services = () => {
    return (
        <section id="services" className="py-24 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/30 w-[400px] h-[400px] -top-[10%] -right-[10%]" />
                <div className="blob bg-rose-100/40 w-[300px] h-[300px] bottom-0 -left-[5%]" style={{ animationDelay: '3s' }} />
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
                        ✨ Nos Services
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mt-2 mb-4">
                        Soins <span className="text-gradient">à domicile</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Des soins professionnels directement chez vous, adaptés à chaque besoin, prodigués avec expertise et douceur.
                    </p>
                </motion.div>

                {/* Services Grid - Bento Style */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative"
                        >
                            {/* Card */}
                            <motion.div
                                className="relative glass p-8 rounded-3xl h-full overflow-hidden"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Gradient border on hover */}
                                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm bg-gradient-to-r ${service.gradient}`}
                                    style={{ margin: '-2px' }}
                                />

                                {/* Icon */}
                                <motion.div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {service.icon}
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gradient transition-all">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                                    {service.description}
                                </p>

                                {/* Learn More Link */}
                                <motion.a
                                    href="#contact"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ x: 4 }}
                                >
                                    Réserver
                                    <ArrowUpRight size={14} />
                                </motion.a>

                                {/* Decorative Corner */}
                                <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${service.bgLight} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Service Area Info */}
                <motion.div
                    className="mt-16 relative"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-100/50 via-transparent to-rose-100/50 -z-10" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
                                        <Car size={24} />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-serif text-gray-900">
                                        Zone de service
                                    </h3>
                                </div>
                                <p className="text-gray-600 max-w-xl">
                                    Basée à <strong>Saint-Amable</strong>, je me déplace dans un rayon de <strong>30 km</strong> pour vous offrir des soins de qualité dans le confort de votre foyer.
                                </p>
                            </div>
                            <motion.a
                                href="#contact"
                                className="btn-glow inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-full font-semibold shadow-glow whitespace-nowrap"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Prendre rendez-vous</span>
                                <ArrowUpRight size={18} />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
