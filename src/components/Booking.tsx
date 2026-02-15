import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Sparkles } from 'lucide-react';

const Booking = () => {
    const benefits = [
        { icon: <Calendar size={18} />, text: "Choisissez votre date et heure" },
        { icon: <Sparkles size={18} />, text: "Soins des pieds, ongles et manucure" },
        { icon: <CheckCircle size={18} />, text: "Confirmation instantanee par courriel" },
    ];

    return (
        <section id="booking" className="py-16 md:py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-rose-50" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/30 w-[400px] h-[400px] -top-[10%] right-[5%]" />
                <div className="blob bg-rose-100/20 w-[300px] h-[300px] bottom-[10%] -left-[5%]" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 md:mb-12"
                >
                    <motion.span
                        className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-xs md:text-sm mb-3 md:mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        Rendez-vous en ligne
                    </motion.span>
                    <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mt-1 mb-3">
                        Reservez <span className="text-gradient">votre soin</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-6">
                        Prenez rendez-vous en quelques clics directement ici!
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-4">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="flex items-center gap-2 text-gray-700 justify-center"
                            >
                                <div className="text-primary-500">{benefit.icon}</div>
                                <span className="text-sm font-medium">{benefit.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Calendly Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass rounded-3xl overflow-hidden shadow-xl">
                        <iframe
                            src="https://calendly.com/douceurjosee/30min?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a"
                            width="100%"
                            height="700"
                            frameBorder="0"
                            title="Prendre rendez-vous avec Josee"
                            style={{ minHeight: '650px', border: 'none' }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Booking;
