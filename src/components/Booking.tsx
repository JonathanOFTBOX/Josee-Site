import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

const Booking = () => {
    const benefits = [
        { icon: <Calendar size={18} />, text: "Choisissez votre date et heure" },
        { icon: <Clock size={18} />, text: "Consultation de 30 minutes" },
        { icon: <CheckCircle size={18} />, text: "Confirmation instantanee" },
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
                    className="text-center mb-10 md:mb-14"
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
                    <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
                        Prenez rendez-vous en quelques clics. Choisissez le moment qui vous convient le mieux!
                    </p>
                </motion.div>

                {/* Booking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-transparent to-rose-100/30 -z-10" />

                        <div className="flex flex-col items-center text-center gap-8">
                            {/* Icon */}
                            <motion.div
                                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-glow"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Calendar size={36} />
                            </motion.div>

                            {/* Title */}
                            <div>
                                <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3">
                                    Prendre <span className="text-gradient">rendez-vous</span>
                                </h3>
                                <p className="text-gray-600 max-w-md">
                                    Selectionnez une plage horaire disponible et recevez une confirmation par courriel.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className="flex items-center gap-2 text-gray-700"
                                    >
                                        <div className="text-primary-500">{benefit.icon}</div>
                                        <span className="text-sm font-medium">{benefit.text}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <motion.a
                                href="https://calendly.com/douceurjosee/30min"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-glow inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-5 rounded-full font-semibold shadow-glow text-lg"
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Calendar size={22} />
                                <span>Choisir une date</span>
                                <ArrowUpRight size={20} />
                            </motion.a>

                            <p className="text-gray-400 text-xs">
                                Vous serez redirige vers Calendly pour finaliser votre rendez-vous.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Booking;
