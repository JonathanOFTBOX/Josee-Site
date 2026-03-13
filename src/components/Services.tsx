import { motion } from 'framer-motion';
import { ArrowUpRight, Car } from 'lucide-react';


const services = [
    {
        emoji: '🦶',
        title: "Soins de pieds (type podologique)",
        subtitle: "Axés sur la santé, le confort et la prévention",
        description: "Soins professionnels visant le nettoyage en profondeur, la coupe et l'entretien sécuritaire des ongles, ainsi que la diminution des callosités sans râpe métallique ni rabot. Chaque soin est personnalisé selon la condition de santé, incluant l'entretien des ongles incarnés ou d'aspect mycosique. Recommandé pour les personnes ayant des besoins spécifiques, des inconforts ou des conditions particulières. L'option vernis est offerte lorsque l'état des ongles le permet.",
        duration: "1 h 30 à 2 h 30, selon le service choisi",
        gradient: "from-blue-400 to-indigo-500",
        bgLight: "bg-blue-50",
    },
    {
        emoji: '💅',
        title: "Manucure",
        subtitle: "Beauté et soin des mains",
        description: "Soin comprenant l'entretien des ongles et des cuticules, suivi de l'application de vernis régulier ou de vernis gel, sur ongles naturels ou sur prothèses. Le soin se termine par une hydratation des mains accompagnée d'un léger massage, pour un moment de détente et de mise en beauté.",
        duration: "1 h 30 à 3 h, selon le service choisi",
        gradient: "from-purple-400 to-pink-500",
        bgLight: "bg-purple-50",
    },
    {
        emoji: '✨',
        title: "Pédicure (soin esthétique)",
        subtitle: "Axée sur la détente et la mise en beauté",
        description: "Soin de bien-être comprenant la préparation et le nettoyage des pieds, un bain aux cristaux marins, l'exfoliation, le soin des ongles et des cuticules, ainsi que l'application de vernis régulier ou de vernis gel. Le soin se termine par une hydratation et un léger massage.",
        duration: "environ 1 h 30",
        gradient: "from-rose-400 to-orange-400",
        bgLight: "bg-rose-50",
    },
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
                        Soins <span className="text-gradient">professionnels</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Des soins professionnels adaptés à votre condition, offerts avec rigueur et bienveillance. Matériel stérilisé ou à usage unique pour des soins sécuritaires. En espace privé, calme et soigné, ou à votre domicile.
                    </p>
                </motion.div>

                {/* Services Grid - Bento Style */}
                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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

                                {/* Emoji in white circle - top left decorative */}
                                <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/80 flex items-end justify-end pb-5 pr-5 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                    <span className="text-3xl">{service.emoji}</span>
                                </div>

                                {/* Spacer for the circle */}
                                <div className="h-10 mb-4" />

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gradient transition-all">
                                    {service.title}
                                </h3>
                                {service.subtitle && (
                                    <p className="text-primary-600 font-medium text-sm mb-3 italic">
                                        {service.subtitle}
                                    </p>
                                )}
                                <p className="text-gray-600 leading-relaxed text-sm mb-3">
                                    {service.description}
                                </p>
                                {service.duration && (
                                    <p className="text-gray-500 text-xs mb-4">
                                        ⏱ Durée : {service.duration}
                                    </p>
                                )}

                                {/* Learn More Link */}
                                <motion.a
                                    href="/rendez-vous"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ x: 4 }}
                                >
                                    Réserver
                                    <ArrowUpRight size={14} />
                                </motion.a>


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
                                    Je vous accueille dans mon local situé au <strong>229, rue Cardinal à Saint-Amable</strong>, ou je me déplace à votre domicile dans un rayon de <strong>30 km</strong>.
                                </p>
                            </div>
                            <motion.a
                                href="/rendez-vous"
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
