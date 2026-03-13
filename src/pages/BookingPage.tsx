import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Home, ArrowRight, Send, User, Mail, Navigation, Sparkles, Hand, Footprints } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SERVICE_OPTIONS = [
    { id: 'pieds', label: 'Soins de pieds', icon: Footprints },
    { id: 'manucure', label: 'Manucure', icon: Hand },
    { id: 'pedicure', label: 'Pédicure', icon: Sparkles },
];

type BookingLocation = 'local' | 'domicile' | null;
type BookingStep = 'choose' | 'local-form' | 'domicile-form' | 'calendly';

const CALENDLY_BASE = 'https://calendly.com/douceurjosee/rendez-vous-local?hide_gdpr_banner=1&background_color=fdf8f4&text_color=1a1a1a&primary_color=c4956a';

const LOCAL_ADDRESS = '229, rue Cardinal, Saint-Amable, QC J0L 1N0';
const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2822.0!2d-73.3008!3d45.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc904c0a1234567%3A0x0!2s229+Rue+Cardinal%2C+Saint-Amable%2C+QC+J0L+1N0!5e0!3m2!1sfr!2sca!4v1';
const GOOGLE_MAPS_DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=229+rue+Cardinal,+Saint-Amable,+QC+J0L+1N0';

const BookingPage = () => {
    const navigate = useNavigate();
    const [location, setLocation] = useState<BookingLocation>(null);
    const [step, setStep] = useState<BookingStep>('choose');

    // Form state (shared for both local and domicile)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        message: ''
    });
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const toggleService = (serviceId: string) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(s => s !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Build Calendly URL with prefilled client info
    const buildCalendlyUrl = () => {
        const url = new URL(CALENDLY_BASE);

        // Build a rich name for the calendar title: "Service ClientName Location"
        // Example: "Manucure Nathalie Mercier Local" or "Pédicure Jonathan Gorce Domicile"
        const isLocal = location === 'local';
        const locationLabel = isLocal ? 'Local' : 'Domicile';

        let calendarName = '';

        // Add service names (short versions for calendar title)
        if (selectedServices.length > 0) {
            const shortLabels = selectedServices.map(id => {
                if (id === 'pieds') return 'Podologie';
                if (id === 'manucure') return 'Manucure';
                if (id === 'pedicure') return 'Pédicure';
                return id;
            });
            calendarName += shortLabels.join(' et ') + ' ';
        }

        // Add client name
        calendarName += formData.name;

        // Add location
        calendarName += ' ' + locationLabel;

        if (calendarName.trim()) url.searchParams.set('name', calendarName.trim());
        if (formData.email) url.searchParams.set('email', formData.email);

        // Build notes with all extra info for Josée
        const noteLines: string[] = [];

        if (isLocal) {
            noteLines.push('** SOIN AU LOCAL **');
        } else {
            noteLines.push('** SOIN A DOMICILE **');
            const fullAddress = [formData.address, formData.city, formData.postalCode].filter(Boolean).join(', ');
            if (fullAddress) {
                noteLines.push('Adresse: ' + fullAddress);
            }
        }

        // Selected services
        if (selectedServices.length > 0) {
            const serviceLabels = selectedServices.map(id =>
                SERVICE_OPTIONS.find(s => s.id === id)?.label || id
            );
            noteLines.push('Soin(s): ' + serviceLabels.join(', '));
        }

        if (formData.phone) {
            noteLines.push('Telephone: ' + formData.phone);
        }

        if (formData.message) {
            noteLines.push('Notes: ' + formData.message);
        }

        // a1 = first custom question answer (the "notes" textarea in Calendly)
        if (noteLines.length > 0) {
            url.searchParams.set('a1', noteLines.join('\n'));
        }

        return url.toString();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // No email sent — just go straight to Calendly with prefilled data
        setStep('calendly');
    };

    const handleChooseLocal = () => {
        setLocation('local');
        setStep('local-form');
    };

    const handleChooseDomicile = () => {
        setLocation('domicile');
        setStep('domicile-form');
    };

    const handleBack = () => {
        if (step === 'calendly') {
            setStep(location === 'local' ? 'local-form' : 'domicile-form');
        } else if (step === 'local-form' || step === 'domicile-form') {
            setStep('choose');
            setLocation(null);
            setFormData({ name: '', phone: '', email: '', address: '', city: '', postalCode: '', message: '' });
            setSelectedServices([]);
        } else {
            navigate('/');
        }
    };

    const getBackLabel = () => {
        if (step === 'calendly') return 'Modifier mes informations';
        if (step === 'local-form' || step === 'domicile-form') return 'Changer le lieu';
        return 'Retour au site';
    };

    // Accent colors based on location
    const isLocal = location === 'local';
    const accentGradient = isLocal ? 'from-primary-500 to-primary-600' : 'from-emerald-500 to-teal-600';
    const accentText = isLocal ? 'text-primary-600' : 'text-emerald-600';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-rose-50">
            {/* Header Bar */}
            <div className="glass z-50 shadow-glass flex-shrink-0">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <motion.button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-primary-700 font-medium hover:text-primary-900 transition-colors"
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={20} />
                        <span>{getBackLabel()}</span>
                    </motion.button>

                    <span className="font-serif text-lg text-primary-800 hidden sm:block">
                        Douceur <span className="text-gradient">Mains & Pieds</span> Josée
                    </span>

                    <motion.a
                        href="tel:5142387562"
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-glow"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Phone size={16} />
                        <span className="hidden sm:inline">514-238-7562</span>
                    </motion.a>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-start justify-center p-4 pt-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {step === 'choose' && (
                        /* ===== STEP 1: Choose location ===== */
                        <motion.div
                            key="choose"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl w-full"
                        >
                            <div className="text-center mb-10">
                                <motion.span
                                    className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-sm mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    📅 Rendez-vous
                                </motion.span>
                                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                                    Où souhaitez-vous recevoir <span className="text-gradient">votre soin</span> ?
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    Choisissez l'option qui vous convient le mieux
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Option: Au local */}
                                <motion.button
                                    onClick={handleChooseLocal}
                                    className="group glass rounded-3xl p-8 text-left hover:shadow-glow transition-all relative overflow-hidden"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                            <MapPin size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Au local</h3>
                                        <p className="text-gray-600 mb-4">
                                            229, rue Cardinal<br />
                                            Saint-Amable, QC J0L 1N0
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Espace privé, calme et soigné
                                        </p>
                                        <div className="flex items-center gap-2 text-primary-600 font-semibold">
                                            <span>Choisir cette option</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Option: À domicile */}
                                <motion.button
                                    onClick={handleChooseDomicile}
                                    className="group glass rounded-3xl p-8 text-left hover:shadow-glow transition-all relative overflow-hidden"
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white mb-6 shadow-lg">
                                            <Home size={28} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">À domicile</h3>
                                        <p className="text-gray-600 mb-4">
                                            Je me déplace chez vous<br />
                                            dans un rayon de 30 km
                                        </p>
                                        <p className="text-gray-500 text-sm mb-4">
                                            Confort de votre foyer
                                        </p>
                                        <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                                            <span>Choisir cette option</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>
                            </div>

                            <motion.p
                                className="text-center text-gray-400 text-sm mt-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                ⏱ Durée des soins : entre 1 h 30 et 3 h selon le service choisi
                            </motion.p>
                        </motion.div>
                    )}

                    {(step === 'local-form' || step === 'domicile-form') && (
                        /* ===== STEP 2: Contact form (local or domicile) ===== */
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl w-full"
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isLocal ? 'from-primary-400 to-primary-600' : 'from-emerald-400 to-teal-600'} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {isLocal ? <MapPin size={28} /> : <Home size={28} />}
                                </motion.div>
                                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">
                                    Soin <span className="text-gradient">{isLocal ? 'au local' : 'à domicile'}</span>
                                </h2>
                                <p className="text-gray-500">
                                    Remplissez vos informations, puis choisissez votre date de rendez-vous
                                </p>
                            </div>

                            {/* Google Maps card — only for local */}
                            {isLocal && (
                                <motion.div
                                    className="glass rounded-3xl overflow-hidden mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div className="w-full h-[200px] md:h-[250px]">
                                        <iframe
                                            src={GOOGLE_MAPS_EMBED}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 'none' }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="229 rue Cardinal, Saint-Amable"
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Douceur Mains & Pieds Josée</h3>
                                                <p className="text-gray-500 text-sm">{LOCAL_ADDRESS}</p>
                                            </div>
                                        </div>
                                        <motion.a
                                            href={GOOGLE_MAPS_DIRECTIONS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-5 rounded-xl shadow-md text-sm whitespace-nowrap"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Navigation size={16} />
                                            <span>Itinéraire</span>
                                        </motion.a>
                                    </div>
                                </motion.div>
                            )}

                            {/* Contact Form Card */}
                            <motion.div
                                className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: isLocal ? 0.3 : 0.2 }}
                            >
                                <form className="space-y-5" onSubmit={handleFormSubmit}>
                                    {/* Name */}
                                    <div className="relative">
                                        <motion.label
                                            htmlFor="name"
                                            className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'name' || formData.name
                                                ? `top-2 text-xs ${accentText} font-medium`
                                                : 'top-4 text-gray-500'
                                                }`}
                                        >
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                Nom complet *
                                            </span>
                                        </motion.label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-modern pt-6"
                                            required
                                        />
                                    </div>

                                    {/* Phone + Email row */}
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="relative">
                                            <motion.label
                                                htmlFor="phone"
                                                className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'phone' || formData.phone
                                                    ? `top-2 text-xs ${accentText} font-medium`
                                                    : 'top-4 text-gray-500'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    <Phone size={12} />
                                                    Téléphone *
                                                </span>
                                            </motion.label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('phone')}
                                                onBlur={() => setFocusedField(null)}
                                                className="input-modern pt-6"
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <motion.label
                                                htmlFor="email"
                                                className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'email' || formData.email
                                                    ? `top-2 text-xs ${accentText} font-medium`
                                                    : 'top-4 text-gray-500'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-1">
                                                    <Mail size={12} />
                                                    Courriel *
                                                </span>
                                            </motion.label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="input-modern pt-6"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address fields — only for domicile */}
                                    {!isLocal && (
                                        <>
                                            {/* Street address */}
                                            <div className="relative">
                                                <motion.label
                                                    htmlFor="address"
                                                    className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'address' || formData.address
                                                        ? `top-2 text-xs ${accentText} font-medium`
                                                        : 'top-4 text-gray-500'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        Adresse (numéro et rue) *
                                                    </span>
                                                </motion.label>
                                                <input
                                                    type="text"
                                                    id="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('address')}
                                                    onBlur={() => setFocusedField(null)}
                                                    className="input-modern pt-6"
                                                    required
                                                />
                                            </div>

                                            {/* City + Postal Code row */}
                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <div className="relative">
                                                    <motion.label
                                                        htmlFor="city"
                                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'city' || formData.city
                                                            ? `top-2 text-xs ${accentText} font-medium`
                                                            : 'top-4 text-gray-500'
                                                            }`}
                                                    >
                                                        Ville *
                                                    </motion.label>
                                                    <input
                                                        type="text"
                                                        id="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('city')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="input-modern pt-6"
                                                        required
                                                    />
                                                </div>

                                                <div className="relative">
                                                    <motion.label
                                                        htmlFor="postalCode"
                                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'postalCode' || formData.postalCode
                                                            ? `top-2 text-xs ${accentText} font-medium`
                                                            : 'top-4 text-gray-500'
                                                            }`}
                                                    >
                                                        Code postal *
                                                    </motion.label>
                                                    <input
                                                        type="text"
                                                        id="postalCode"
                                                        value={formData.postalCode}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('postalCode')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="input-modern pt-6"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Service Selection */}
                                    <div>
                                        <p className={`text-sm font-medium mb-3 ${accentText}`}>
                                            Type de soin souhaité *
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {SERVICE_OPTIONS.map((service) => {
                                                const isSelected = selectedServices.includes(service.id);
                                                const Icon = service.icon;
                                                return (
                                                    <motion.button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() => toggleService(service.id)}
                                                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                                                            isSelected
                                                                ? isLocal
                                                                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                                                                    : 'border-emerald-400 bg-emerald-50 text-emerald-700'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                        }`}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                            isSelected
                                                                ? isLocal
                                                                    ? 'bg-primary-500 text-white'
                                                                    : 'bg-emerald-500 text-white'
                                                                : 'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            <Icon size={20} />
                                                        </div>
                                                        <span className="font-medium text-sm">{service.label}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Notes (optional) */}
                                    <div className="relative">
                                        <motion.label
                                            htmlFor="message"
                                            className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'message' || formData.message
                                                ? `top-2 text-xs ${accentText} font-medium`
                                                : 'top-4 text-gray-500'
                                                }`}
                                        >
                                            Notes ou précisions
                                        </motion.label>
                                        <textarea
                                            id="message"
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="input-modern pt-6 resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        className={`btn-glow w-full bg-gradient-to-r ${accentGradient} text-white font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3`}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Send size={20} />
                                        <span>Choisir ma date de rendez-vous</span>
                                        <ArrowRight size={18} />
                                    </motion.button>
                                </form>

                                <p className="text-center text-gray-400 text-xs mt-4">
                                    Ces informations seront transmises automatiquement lors de votre réservation
                                </p>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 'calendly' && (
                        /* ===== STEP 3: Calendly embed with prefilled data ===== */
                        <motion.div
                            key="calendly"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-[calc(100vh-80px)]"
                        >
                            {/* Location badge */}
                            <div className="text-center mb-4">
                                <span className={`inline-flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium ${
                                    isLocal
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {isLocal ? <MapPin size={16} /> : <Home size={16} />}
                                    {isLocal
                                        ? 'Au local — 229, rue Cardinal, Saint-Amable'
                                        : `À domicile — ${formData.name || 'Rayon de 30 km'}`
                                    }
                                </span>
                            </div>

                            {/* Calendly iframe — URL includes prefilled name, email and notes */}
                            <iframe
                                src={buildCalendlyUrl()}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                title={`Prendre rendez-vous ${isLocal ? 'au local' : 'à domicile'}`}
                                style={{ border: 'none', borderRadius: '1rem' }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookingPage;
