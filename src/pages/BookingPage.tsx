import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MapPin, Home, ArrowRight, Send, User, Mail, Navigation, ChevronDown, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// ============================================================
// SERVICE CATALOG — from Price List PDF
// ============================================================

interface ServiceItem {
    id: string;
    name: string;
    duration: string;
    price: number;
    note?: string;
}

interface ExtraItem {
    id: string;
    name: string;
    price: number;
    duration?: string;
}

interface ServiceCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    services: ServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
    {
        id: 'podologie',
        name: 'Soins podologiques',
        icon: '🦶',
        color: 'primary',
        services: [
            { id: 'podo-gel', name: 'Soin podologique avec application de vernis gel', duration: '2h à 2h30', price: 100 },
            { id: 'podo-premier', name: 'Premier rendez-vous santé des pieds', duration: '2h à 2h30', price: 90 },
            { id: 'podo-suivi', name: 'Suivi santé des pieds', duration: '1h30 à 2h', price: 80 },
        ]
    },
    {
        id: 'pedicure',
        name: 'Pédicure',
        icon: '✨',
        color: 'rose',
        services: [
            { id: 'pedi-gel', name: 'Beauté des pieds — vernis gel', duration: '1h30', price: 60 },
            { id: 'pedi-regulier', name: 'Beauté des pieds — vernis régulier', duration: '1h30', price: 50 },
        ]
    },
    {
        id: 'manucure',
        name: 'Manucure',
        icon: '💅',
        color: 'violet',
        services: [
            { id: 'manu-pose', name: "Pose d'ongle gel X — vernis gel", duration: '2h30 à 3h', price: 70 },
            { id: 'manu-recouvrement', name: 'Beauté des mains — recouvrement vernis gel', duration: '2h à 2h15', price: 60 },
            { id: 'manu-remplissage', name: 'Remplissage — vernis gel', duration: '2h à 2h30', price: 60 },
            { id: 'manu-gel', name: 'Beauté des mains — vernis gel', duration: '1h15 à 1h30', price: 50 },
            { id: 'manu-regulier', name: 'Beauté des mains — vernis régulier', duration: '1h15 à 1h30', price: 40 },
        ]
    }
];

const EXTRAS: ExtraItem[] = [
    { id: 'extra-francais', name: 'Manucure français / babyboomer / nailart', price: 10 },
    { id: 'extra-massage', name: 'Massage (15 min.)', price: 10, duration: '15 min' },
    { id: 'extra-exfoliant', name: 'Bain exfoliant (15 min.)', price: 10, duration: '15 min' },
    { id: 'extra-paraffine', name: 'Paraffine (30 min.)', price: 20, duration: '30 min' },
    { id: 'extra-sel', name: 'Sel marin (15 min.)', price: 10, duration: '15 min' },
    { id: 'extra-retrait', name: 'Retrait de vernis gel (30 min.)', price: 10, duration: '30 min' },
    { id: 'extra-correction', name: 'Correction (30 min.)', price: 12, duration: '30 min' },
];

// ============================================================
// COMPONENT
// ============================================================

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

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        message: ''
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Service selection state
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleService = (serviceId: string) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            }
            // Remove any other service from same category, then add this one
            const category = SERVICE_CATEGORIES.find(c => c.services.some(s => s.id === serviceId));
            if (!category) return [...prev, serviceId];
            const otherCatServiceIds = category.services.map(s => s.id);
            return [...prev.filter(id => !otherCatServiceIds.includes(id)), serviceId];
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        if (id === 'phone') {
            // Auto-format phone: 514-647-2625
            const digits = value.replace(/\D/g, '').slice(0, 10);
            let formatted = digits;
            if (digits.length > 3 && digits.length <= 6) {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3);
            } else if (digits.length > 6) {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
            }
            setFormData({ ...formData, phone: formatted });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const toggleExtra = (extraId: string) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        );
    };

    // Get all selected service items
    const getSelectedServiceItems = (): ServiceItem[] => {
        const items: ServiceItem[] = [];
        for (const cat of SERVICE_CATEGORIES) {
            for (const s of cat.services) {
                if (selectedServices.includes(s.id)) items.push(s);
            }
        }
        return items;
    };

    const getTotal = () => {
        const servicesTotal = getSelectedServiceItems().reduce((sum, s) => sum + s.price, 0);
        const extrasTotal = selectedExtras.reduce((sum, id) => {
            const extra = EXTRAS.find(e => e.id === id);
            return sum + (extra?.price || 0);
        }, 0);
        return servicesTotal + extrasTotal;
    };

    // Get short service labels for calendar title
    const getServiceLabel = (): string => {
        const labels = selectedServices.map(id => {
            if (id.startsWith('podo')) return 'Podologie';
            if (id.startsWith('pedi')) return 'Pédicure';
            if (id.startsWith('manu')) return 'Manucure';
            return '';
        }).filter(Boolean);
        return labels.join(' et ');
    };

    // Build Calendly URL with prefilled client info
    const buildCalendlyUrl = () => {
        const url = new URL(CALENDLY_BASE);
        const isLocal = location === 'local';
        const locationLabel = isLocal ? 'Local' : 'Domicile';

        // Calendar title: "Service ClientName Location"
        let calendarName = '';
        const serviceLabel = getServiceLabel();
        if (serviceLabel) calendarName += serviceLabel + ' ';
        calendarName += formData.name + ' ' + locationLabel;

        if (calendarName.trim()) url.searchParams.set('name', calendarName.trim());
        if (formData.email) url.searchParams.set('email', formData.email);

        // Build notes
        const noteLines: string[] = [];

        if (isLocal) {
            noteLines.push('** SOIN AU LOCAL **');
        } else {
            noteLines.push('** SOIN A DOMICILE **');
            const fullAddress = [formData.address, formData.city, formData.postalCode].filter(Boolean).join(', ');
            if (fullAddress) noteLines.push('Adresse: ' + fullAddress);
        }

        // Service details
        const serviceItems = getSelectedServiceItems();
        if (serviceItems.length > 0) {
            serviceItems.forEach(s => {
                noteLines.push('Service: ' + s.name + ' (' + s.price + '$)');
            });
        }

        // Extras
        if (selectedExtras.length > 0) {
            const extraLabels = selectedExtras.map(id => {
                const extra = EXTRAS.find(e => e.id === id);
                return extra ? extra.name + ' +' + extra.price + '$' : '';
            }).filter(Boolean);
            noteLines.push('Extras: ' + extraLabels.join(', '));
        }

        // Total
        const total = getTotal();
        if (total > 0) noteLines.push('Total estime: ' + total + '$');

        if (formData.phone) noteLines.push('Telephone: ' + formData.phone);
        if (formData.message) noteLines.push('Notes: ' + formData.message);

        if (noteLines.length > 0) {
            url.searchParams.set('a1', noteLines.join('\n'));
        }

        return url.toString();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedServices.length === 0) return;
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
            setSelectedExtras([]);
            setExpandedCategory(null);
        } else {
            navigate('/');
        }
    };

    const getBackLabel = () => {
        if (step === 'calendly') return 'Modifier mes informations';
        if (step === 'local-form' || step === 'domicile-form') return 'Changer le lieu';
        return 'Retour au site';
    };

    const isLocal = location === 'local';
    const accentGradient = isLocal ? 'from-primary-500 to-primary-600' : 'from-emerald-500 to-teal-600';
    const accentText = isLocal ? 'text-primary-600' : 'text-emerald-600';

    // Color classes per category — matching Services page gradients
    const getCatColors = (catId: string) => {
        switch (catId) {
            case 'podologie': return { bg: 'bg-blue-50', border: 'border-blue-300', selected: 'bg-gradient-to-r from-blue-400 to-indigo-500 border-transparent', selectedText: 'text-white', text: 'text-indigo-700', badge: 'bg-white/30', badgeText: 'text-white' };
            case 'pedicure': return { bg: 'bg-rose-50', border: 'border-rose-300', selected: 'bg-gradient-to-r from-rose-400 to-orange-400 border-transparent', selectedText: 'text-white', text: 'text-rose-700', badge: 'bg-white/30', badgeText: 'text-white' };
            case 'manucure': return { bg: 'bg-purple-50', border: 'border-purple-300', selected: 'bg-gradient-to-r from-purple-400 to-pink-500 border-transparent', selectedText: 'text-white', text: 'text-pink-700', badge: 'bg-white/30', badgeText: 'text-white' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-300', selected: 'bg-gray-100 border-gray-400', selectedText: 'text-gray-900', text: 'text-gray-700', badge: 'bg-gray-500', badgeText: 'text-white' };
        }
    };

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
                                        <p className="text-gray-600 mb-4">229, rue Cardinal<br />Saint-Amable, QC J0L 1N0</p>
                                        <p className="text-gray-500 text-sm mb-4">Espace privé, calme et soigné</p>
                                        <div className="flex items-center gap-2 text-primary-600 font-semibold">
                                            <span>Choisir cette option</span>
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.button>

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
                                        <p className="text-gray-600 mb-4">Je me déplace chez vous<br />dans un rayon de 30 km</p>
                                        <p className="text-gray-500 text-sm mb-4">Confort de votre foyer</p>
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
                        /* ===== STEP 2: Form + Service Selection ===== */
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl w-full pb-8"
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
                                    Choisissez votre soin et remplissez vos informations
                                </p>
                            </div>

                            {/* Google Maps — local only */}
                            {isLocal && (
                                <motion.div
                                    className="glass rounded-3xl overflow-hidden mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div className="w-full h-[180px] md:h-[220px]">
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
                                    <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                                                <MapPin size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">Douceur Mains & Pieds Josée</h3>
                                                <p className="text-gray-500 text-xs">{LOCAL_ADDRESS}</p>
                                            </div>
                                        </div>
                                        <motion.a
                                            href={GOOGLE_MAPS_DIRECTIONS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md text-sm whitespace-nowrap"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Navigation size={14} />
                                            <span>Itinéraire</span>
                                        </motion.a>
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleFormSubmit}>
                                {/* ===== SERVICE SELECTION ===== */}
                                <motion.div
                                    className="glass rounded-3xl p-5 md:p-6 mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                        💆‍♀️ Choisissez votre soin
                                    </h3>

                                    {/* Categories accordion */}
                                    <div className="space-y-3">
                                        {SERVICE_CATEGORIES.map((cat) => {
                                            const colors = getCatColors(cat.id);
                                            const isExpanded = expandedCategory === cat.id;
                                            const hasSelectedInCat = cat.services.some(s => selectedServices.includes(s.id));

                                            return (
                                                <div key={cat.id} className="rounded-2xl border-2 border-gray-100 overflow-hidden">
                                                    {/* Category header */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                                        className={`w-full flex items-center justify-between p-4 transition-all rounded-xl ${
                                                            hasSelectedInCat ? `${colors.selected} shadow-lg` : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{cat.icon}</span>
                                                            <span className={`font-semibold ${hasSelectedInCat ? 'text-white' : 'text-gray-900'}`}>{cat.name}</span>
                                                            {hasSelectedInCat && (
                                                                <span className={`${colors.badge} ${colors.badgeText} text-xs px-2 py-0.5 rounded-full font-medium`}>
                                                                    ✓ Sélectionné
                                                                </span>
                                                            )}
                                                        </div>
                                                        <ChevronDown
                                                            size={20}
                                                            className={`${hasSelectedInCat ? 'text-white/70' : 'text-gray-400'} transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    {/* Services list */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-4 pb-4 space-y-2">
                                                                    {cat.services.map((service) => {
                                                                        const isSelected = selectedServices.includes(service.id);
                                                                        return (
                                                                            <button
                                                                                key={service.id}
                                                                                type="button"
                                                                                onClick={() => toggleService(service.id)}
                                                                                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                                                                                    isSelected
                                                                                        ? `${colors.selected} ${colors.border}`
                                                                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                                                        isSelected
                                                                                            ? `${colors.badge} border-transparent text-white`
                                                                                            : 'border-gray-300'
                                                                                    }`}>
                                                                                        {isSelected && <Check size={14} />}
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                        <p className={`font-medium text-sm ${isSelected ? colors.text : 'text-gray-800'}`}>
                                                                                            {service.name}
                                                                                        </p>
                                                                                        <p className="text-xs text-gray-400">{service.duration}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <span className={`font-bold text-lg flex-shrink-0 ml-3 ${isSelected ? colors.text : 'text-gray-900'}`}>
                                                                                    {service.price}$
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Extras */}
                                    {selectedServices.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-5 pt-5 border-t border-gray-100"
                                        >
                                            <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                                                <Plus size={16} />
                                                Extras optionnels
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {EXTRAS.map((extra) => {
                                                    const isSelected = selectedExtras.includes(extra.id);
                                                    return (
                                                        <button
                                                            key={extra.id}
                                                            type="button"
                                                            onClick={() => toggleExtra(extra.id)}
                                                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left text-sm ${
                                                                isSelected
                                                                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                                                                    : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                                                                    isSelected
                                                                        ? 'bg-primary-500 text-white'
                                                                        : 'border-2 border-gray-300'
                                                                }`}>
                                                                    {isSelected && <Check size={12} />}
                                                                </div>
                                                                <span className="truncate">{extra.name}</span>
                                                            </div>
                                                            <span className={`font-bold flex-shrink-0 ml-2 ${isSelected ? 'text-primary-600' : 'text-gray-500'}`}>
                                                                +{extra.price}$
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Total */}
                                    {selectedServices.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-5 pt-4 border-t-2 border-gray-100 flex items-center justify-between"
                                        >
                                            <span className="text-gray-600 font-medium">Total estimé</span>
                                            <span className="text-3xl font-bold text-gray-900">{getTotal()}$</span>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* ===== CONTACT INFO ===== */}
                                <motion.div
                                    className="glass rounded-3xl p-5 md:p-6 mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                                        📝 Vos informations
                                    </h3>

                                    <div className="space-y-4">
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
                                            <input type="text" id="name" value={formData.name} onChange={handleChange}
                                                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                                                className="input-modern pt-6" required />
                                        </div>

                                        {/* Phone + Email */}
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <motion.label
                                                    htmlFor="phone"
                                                    className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'phone' || formData.phone
                                                        ? `top-2 text-xs ${accentText} font-medium`
                                                        : 'top-4 text-gray-500'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-1"><Phone size={12} /> Téléphone *</span>
                                                </motion.label>
                                                <input type="tel" id="phone" value={formData.phone} onChange={handleChange}
                                                    onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                                                    className="input-modern pt-6" required />
                                            </div>
                                            <div className="relative">
                                                <motion.label
                                                    htmlFor="email"
                                                    className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'email' || formData.email
                                                        ? `top-2 text-xs ${accentText} font-medium`
                                                        : 'top-4 text-gray-500'
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-1"><Mail size={12} /> Courriel *</span>
                                                </motion.label>
                                                <input type="email" id="email" value={formData.email} onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                                                    className="input-modern pt-6" required />
                                            </div>
                                        </div>

                                        {/* Address fields — domicile only */}
                                        {!isLocal && (
                                            <>
                                                <div className="relative">
                                                    <motion.label
                                                        htmlFor="address"
                                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'address' || formData.address
                                                            ? `top-2 text-xs ${accentText} font-medium`
                                                            : 'top-4 text-gray-500'
                                                            }`}
                                                    >
                                                        <span className="flex items-center gap-1"><MapPin size={12} /> Adresse (numéro et rue) *</span>
                                                    </motion.label>
                                                    <input type="text" id="address" value={formData.address} onChange={handleChange}
                                                        onFocus={() => setFocusedField('address')} onBlur={() => setFocusedField(null)}
                                                        className="input-modern pt-6" required />
                                                </div>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="relative">
                                                        <motion.label
                                                            htmlFor="city"
                                                            className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'city' || formData.city
                                                                ? `top-2 text-xs ${accentText} font-medium`
                                                                : 'top-4 text-gray-500'
                                                                }`}
                                                        >Ville *</motion.label>
                                                        <input type="text" id="city" value={formData.city} onChange={handleChange}
                                                            onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)}
                                                            className="input-modern pt-6" required />
                                                    </div>
                                                    <div className="relative">
                                                        <motion.label
                                                            htmlFor="postalCode"
                                                            className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'postalCode' || formData.postalCode
                                                                ? `top-2 text-xs ${accentText} font-medium`
                                                                : 'top-4 text-gray-500'
                                                                }`}
                                                        >Code postal *</motion.label>
                                                        <input type="text" id="postalCode" value={formData.postalCode} onChange={handleChange}
                                                            onFocus={() => setFocusedField('postalCode')} onBlur={() => setFocusedField(null)}
                                                            className="input-modern pt-6" required />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Notes */}
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
                                            <textarea id="message" rows={3} value={formData.message} onChange={handleChange}
                                                onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                                                className="input-modern pt-6 resize-none" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={selectedServices.length === 0}
                                    className={`btn-glow w-full bg-gradient-to-r ${accentGradient} text-white font-semibold py-5 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg disabled:opacity-40 disabled:cursor-not-allowed`}
                                    whileHover={selectedServices.length > 0 ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={selectedServices.length > 0 ? { scale: 0.98 } : {}}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Send size={22} />
                                    <span>{selectedServices.length > 0 ? `Choisir ma date — ${getTotal()}$` : 'Sélectionnez un soin pour continuer'}</span>
                                    {selectedServices.length > 0 && <ArrowRight size={20} />}
                                </motion.button>

                                <p className="text-center text-gray-400 text-xs mt-3">
                                    Ces informations seront transmises automatiquement lors de votre réservation
                                </p>
                            </form>
                        </motion.div>
                    )}

                    {step === 'calendly' && (
                        /* ===== STEP 3: Calendly embed ===== */
                        <motion.div
                            key="calendly"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-[calc(100vh-80px)]"
                        >
                            <div className="text-center mb-4 px-3">
                                <div className={`inline-flex flex-col items-center gap-1 py-2.5 px-5 rounded-2xl text-sm font-medium ${
                                    isLocal ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    <span className="flex items-center gap-1.5">
                                        {isLocal ? <MapPin size={14} /> : <Home size={14} />}
                                        {isLocal ? '📍 Local — 229 rue Cardinal, St-Amable' : '🏠 Domicile'}
                                    </span>
                                    <span className="text-xs opacity-80">
                                        {getServiceLabel()} — {formData.name} — {getTotal()}$
                                    </span>
                                </div>
                            </div>

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
