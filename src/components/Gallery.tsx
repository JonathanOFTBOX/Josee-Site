import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import real photos from Josée's work
import realNailsRoses from '../assets/images/real-nails-roses.png';
import realNailsPink from '../assets/images/real-nails-pink.png';
import realFootBeforeAfter from '../assets/images/real-foot-before-after.png';
import realFootCallus from '../assets/images/real-foot-callus.png';
import realToenailCare from '../assets/images/real-toenail-care.jpg';
import photoNailsMariage from '../assets/images/photo-nails-mariage.jpg';
import photoNailsRougeCoeur from '../assets/images/photo-nails-rouge-coeur.jpg';
import photoJosee1 from '../assets/images/photo-josee-1.jpg';


interface WorkItem {
    id: number;
    image: string;
    title: string;
    description: string;
    category: string;
    testimonial: {
        name: string;
        text: string;
        rating: number;
    };
}

const Gallery = () => {
    const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedWork) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedWork]);

    const categories = [
        { id: 'all', label: 'Tous les soins' },
        { id: 'pieds', label: 'Soins des pieds' },
        { id: 'mains', label: 'Soins des mains' },
    ];

    const workItems: WorkItem[] = [
        // MANUCURES
        {
            id: 3,
            image: realNailsRoses,
            title: "Roses peintes à la main 🌹",
            description: "Base blanc brillant avec roses peintes à la main. Nail art floral délicat et romantique. Une vraie oeuvre d'art!",
            category: 'mains',
            testimonial: {
                name: "Marie-Josée T.",
                text: "Les roses sont incroyables! Josée a un talent artistique fou. Tout le monde me demande où je fais faire mes ongles!",
                rating: 5
            }
        },
        {
            id: 4,
            image: realNailsPink,
            title: "Rose bonbon - Barbie vibes 💖",
            description: "Rose vif éclatant avec finition brillante parfaite. Couleur pop et énergique pour un look fun et féminin!",
            category: 'mains',
            testimonial: {
                name: "Chloé R.",
                text: "J'adore ce rose! C'est exactement la couleur que je voulais. Josée a vraiment le compas dans l'oeil!",
                rating: 5
            }
        },
        // SOINS DES PIEDS
        {
            id: 6,
            image: realFootCallus,
            title: "Transformation callosités",
            description: "Élimination des peaux mortes et callosités. Pieds hydratés et prêts pour l'été. Résultat visible immédiatement!",
            category: 'pieds',
            testimonial: {
                name: "Marie-Claire D.",
                text: "Wow! Je n'en revenais pas de la différence. Mes pieds sont doux comme de la soie maintenant!",
                rating: 5
            }
        },
        {
            id: 7,
            image: realFootBeforeAfter,
            title: "Soin complet - Avant/Après",
            description: "Résultat visible : pied apaisé, ongles soignés. Soin idéal pour l'hygiène podale et la prévention diabétique.",
            category: 'pieds',
            testimonial: {
                name: "Jean-Pierre B.",
                text: "Je marchais sur des cailloux avant! Maintenant mes pieds sont comme neufs. Très professionnelle.",
                rating: 5
            }
        },
        {
            id: 8,
            image: realToenailCare,
            title: "Soins des ongles d'orteils",
            description: "Traitement spécialisé pour ongles problématiques. Josée traite avec douceur même les cas les plus difficiles!",
            category: 'pieds',
            testimonial: {
                name: "Line G.",
                text: "J'avais honte de mes pieds depuis des années. Maintenant je peux porter des sandales! Merci Josée!",
                rating: 5
            }
        },
        {
            id: 9,
            image: photoNailsMariage,
            title: "Élégance rose et paillettes ✨",
            description: "Une manucure soignée dans des tons rose pâle et nude, rehaussée de paillettes argentées et de petits cristaux pour une touche élégante et raffinée. La finition est brillante et impeccable.",
            category: 'mains',
            testimonial: {
                name: "Catherine L.",
                text: "Josée a fait de mes mains une véritable oeuvre d'art! Les paillettes sont subtiles et élégantes, parfait pour mon événement!",
                rating: 5
            }
        },
        {
            id: 10,
            image: photoNailsRougeCoeur,
            title: "Rouge passion et cœurs ❤️",
            description: "Vernis rouge éclatant avec petits cœurs blancs délicats. Un look audacieux et romantique, appliqué avec précision.",
            category: 'mains',
            testimonial: {
                name: "Valérie S.",
                text: "J'adore mes ongles! Le rouge est parfait et les petits cœurs sont tellement mignons. Josée a le souci du détail!",
                rating: 5
            }
        },
        {
            id: 11,
            image: photoJosee1,
            title: "Nacré doux - Deux mains 🤍",
            description: "Manucure nacrée aux reflets doux et lumineux. Finition impeccable sur ongles naturels, élégance discrète pour toutes les occasions.",
            category: 'mains',
            testimonial: {
                name: "Diane M.",
                text: "Le fini nacré est absolument magnifique! Josée prend le temps de bien faire les choses. Je me sens choyée à chaque visite.",
                rating: 5
            }
        },

    ];

    const filteredItems = activeCategory === 'all'
        ? workItems
        : workItems.filter(item => item.category === activeCategory);

    return (
        <section id="gallery" className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-primary-50/30">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="blob bg-primary-100/30 w-[400px] h-[400px] top-[10%] -left-[10%]" />
                <div className="blob bg-rose-100/20 w-[300px] h-[300px] bottom-[20%] right-[5%]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.span
                        className="inline-block py-2 px-4 rounded-full glass text-primary-600 font-medium tracking-wider uppercase text-sm mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        ✨ Mes réalisations
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mt-2 mb-4">
                        Galerie des <span className="text-gradient">soins</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Découvrez le vrai travail de Josée à travers ces photos et témoignages de clients satisfaits
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-3 rounded-full font-medium transition-all ${activeCategory === cat.id
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                                : 'glass text-gray-700 hover:shadow-md'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {cat.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                onClick={() => setSelectedWork(item)}
                                className="group cursor-pointer"
                            >
                                <div className="glass rounded-3xl overflow-hidden hover:shadow-glow transition-all duration-300">
                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <motion.div
                                                className="bg-white/90 px-6 py-3 rounded-full font-semibold text-primary-600 shadow-lg"
                                                initial={{ y: 20 }}
                                                whileHover={{ y: 0 }}
                                            >
                                                Voir le témoignage
                                            </motion.div>
                                        </div>

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="glass px-3 py-1 rounded-full text-xs font-medium text-primary-700">
                                                {categories.find(c => c.id === item.category)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mt-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                            ))}
                                            <span className="text-xs text-gray-500 ml-2">- {item.testimonial.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Modal for testimonial */}
                <AnimatePresence>
                    {selectedWork && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pt-20 sm:pt-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedWork(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button - Always visible, sticky at top right */}
                                <button
                                    onClick={() => setSelectedWork(null)}
                                    className="absolute top-4 sm:top-3 right-3 z-50 w-11 h-11 min-w-[44px] min-h-[44px] bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors shadow-xl ring-2 ring-white/40 text-lg font-bold"
                                    aria-label="Fermer"
                                >
                                    ✕
                                </button>

                                {/* Scrollable content container */}
                                <div className="overflow-y-auto custom-scrollbar flex-1 bg-white">
                                    {/* Image */}
                                    <div className="relative h-56 md:h-72 w-full flex-shrink-0">
                                        <img
                                            src={selectedWork.image}
                                            alt={selectedWork.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pt-20">
                                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium mb-3 border border-white/30">
                                                {categories.find(c => c.id === selectedWork.category)?.label}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{selectedWork.title}</h3>
                                            <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-3">{selectedWork.description}</p>
                                        </div>
                                    </div>

                                    {/* Testimonial & Content */}
                                    <div className="p-5 md:p-8">
                                        <div className="bg-primary-50/50 rounded-2xl p-5 mb-6 border border-primary-100">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-md text-white">
                                                    <Quote size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1 mb-2">
                                                        {[...Array(selectedWork.testimonial.rating)].map((_, i) => (
                                                            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-700 text-lg italic mb-3 leading-relaxed">
                                                        "{selectedWork.testimonial.text}"
                                                    </p>
                                                    <div className="font-semibold text-gray-900 border-t border-primary-200/50 pt-2 inline-block">
                                                        — {selectedWork.testimonial.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                            <a
                                                href="tel:5142387562"
                                                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <span>📞</span> Appeler Josée
                                            </a>
                                            <a
                                                href="/rendez-vous"
                                                className="flex-1 bg-white border-2 border-primary-100 text-primary-700 py-4 px-6 rounded-xl font-bold text-center hover:bg-primary-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                <span>📅</span> Prendre Rendez-vous
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Gallery;
