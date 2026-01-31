import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, Car } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        message: ''
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: "Téléphone",
            description: "Appelez ou textez pour un RDV rapide.",
            value: "514-238-7562",
            href: "tel:5142387562",
            gradient: "from-blue-400 to-indigo-500"
        },
        {
            icon: <Car size={24} />,
            title: "Service à domicile",
            description: "Je me déplace chez vous avec tout mon équipement.",
            value: "100% mobile",
            href: null,
            gradient: "from-emerald-400 to-teal-500"
        },
        {
            icon: <MapPin size={24} />,
            title: "Zone de service",
            description: "Basée à Saint-Amable",
            value: "Rayon de 30 km",
            href: null,
            gradient: "from-purple-400 to-pink-500"
        },
        {
            icon: <Clock size={24} />,
            title: "Disponibilités",
            description: "Sur rendez-vous seulement",
            value: "Horaire flexible",
            href: null,
            gradient: "from-amber-400 to-orange-500"
        }
    ];

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/30 w-[500px] h-[500px] top-[10%] -left-[15%]" />
                <div className="blob bg-rose-100/40 w-[400px] h-[400px] bottom-[5%] -right-[10%]" style={{ animationDelay: '2s' }} />
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
                        💬 Contact
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mt-2 mb-4">
                        Prenez <span className="text-gradient">rendez-vous</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Prêt pour un soin à domicile ? Contactez-moi par téléphone ou remplissez le formulaire ci-dessous.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <motion.div
                                    className="glass p-5 rounded-2xl flex items-start gap-4 relative overflow-hidden"
                                    whileHover={{ y: -3, scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* Gradient background on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                    <motion.div
                                        className={`flex-shrink-0 bg-gradient-to-br ${info.gradient} p-3 rounded-xl text-white shadow-lg`}
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                    >
                                        {info.icon}
                                    </motion.div>
                                    <div className="relative z-10">
                                        <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                                        <p className="text-gray-600 text-sm mb-1">{info.description}</p>
                                        {info.href ? (
                                            <a
                                                href={info.href}
                                                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors inline-flex items-center gap-1"
                                            >
                                                {info.value}
                                            </a>
                                        ) : (
                                            <p className="text-primary-600 font-semibold">{info.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* Quick CTA */}
                        <motion.a
                            href="tel:5142387562"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="btn-glow flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-glow w-full"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Phone size={20} />
                            <span>514-238-7562</span>
                        </motion.a>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="glass rounded-3xl p-8 md:p-10 relative overflow-hidden">
                            <h3 className="text-2xl font-serif text-gray-900 mb-8">
                                Demande de <span className="text-gradient">rendez-vous</span>
                            </h3>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name Input */}
                                    <div className="relative">
                                        <motion.label
                                            htmlFor="name"
                                            className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name
                                                    ? 'top-2 text-xs text-primary-600 font-medium'
                                                    : 'top-4 text-gray-500'
                                                }`}
                                        >
                                            Nom complet
                                        </motion.label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-modern pt-6"
                                        />
                                    </div>

                                    {/* Phone Input */}
                                    <div className="relative">
                                        <motion.label
                                            htmlFor="phone"
                                            className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'phone' || formData.phone
                                                    ? 'top-2 text-xs text-primary-600 font-medium'
                                                    : 'top-4 text-gray-500'
                                                }`}
                                        >
                                            Téléphone
                                        </motion.label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('phone')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-modern pt-6"
                                        />
                                    </div>
                                </div>

                                {/* Address Input */}
                                <div className="relative">
                                    <motion.label
                                        htmlFor="address"
                                        className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'address' || formData.address
                                                ? 'top-2 text-xs text-primary-600 font-medium'
                                                : 'top-4 text-gray-500'
                                            }`}
                                    >
                                        Votre adresse (pour le service à domicile)
                                    </motion.label>
                                    <input
                                        type="text"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('address')}
                                        onBlur={() => setFocusedField(null)}
                                        className="input-modern pt-6"
                                    />
                                </div>

                                {/* Message Textarea */}
                                <div className="relative">
                                    <motion.label
                                        htmlFor="message"
                                        className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message
                                                ? 'top-2 text-xs text-primary-600 font-medium'
                                                : 'top-4 text-gray-500'
                                            }`}
                                    >
                                        Type de soin souhaité / Message
                                    </motion.label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        className="input-modern pt-6 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="button"
                                    className="btn-glow w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-4 rounded-2xl shadow-glow flex items-center justify-center gap-3"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Send size={20} />
                                    <span>Envoyer ma demande</span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
