import { motion } from 'framer-motion';
import { Calendar, Sparkles, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
    const navigate = useNavigate();

    const benefits = [
        { icon: <Calendar size={18} />, text: "Choisissez votre date et heure" },
        { icon: <Sparkles size={18} />, text: "Soins des pieds, ongles et manucure" },
        { icon: <CheckCircle size={18} />, text: "Confirmation par courriel" },
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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden text-center">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-transparent to-rose-100/30 -z-10" />

                        {/* Icon */}
                        <motion.div
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-glow mx-auto mb-6"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Calendar size={36} />
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                            Prendre <span className="text-gradient">rendez-vous</span>
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto mb-8">
                            Reservez votre soin en quelques clics. Choisissez la date et l'heure qui vous conviennent!
                        </p>

                        {/* Benefits */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
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

                        {/* CTA Button */}
                        <motion.button
                            onClick={() => navigate('/rendez-vous')}
                            className="btn-glow inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-5 rounded-full font-semibold shadow-glow text-lg"
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Calendar size={22} />
                            <span>Choisir une date</span>
                            <ArrowUpRight size={20} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Booking;
