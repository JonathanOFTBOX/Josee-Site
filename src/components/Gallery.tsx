import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import real photos from Josée's work
import realNailsRed from '../assets/images/real-nails-red.jpg';
import realNailsPearl from '../assets/images/real-nails-pearl.jpg';
import realNailsRoses from '../assets/images/real-nails-roses.png';
import realNailsPink from '../assets/images/real-nails-pink.png';
import realNailsValentine from '../assets/images/real-nails-valentine.jpg';
import realFootBeforeAfter from '../assets/images/real-foot-before-after.png';
import realFootCallus from '../assets/images/real-foot-callus.png';
import realToenailCare from '../assets/images/real-toenail-care.jpg';
import realSummerReady from '../assets/images/real-summer-ready.jpg';
import realBeachReady from '../assets/images/real-beach-ready.jpg';

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
            id: 1,
            image: realNailsRed,
            title: "Rouge passion avec nail art",
            description: "Rouge bordeaux profond avec accents rose et détails dorés. Design créatif et glamour pour les occasions spéciales!",
            category: 'mains',
            testimonial: {
                name: "Sophie M.",
                text: "Josée a des doigts de fée! Ma manucure était parfaite pour mon mariage. Les petits détails sont tellement élégants! 💕",
                rating: 5
            }
        },
        {
            id: 2,
            image: realNailsPearl,
            title: "Nacré irisé - Élégance pure",
            description: "Finition nacrée avec reflets arc-en-ciel. Ongles en amande parfaitement limés. Sophistiqué et discret!",
            category: 'mains',
            testimonial: {
                name: "Isabelle L.",
                text: "Le fini nacré est magnifique! Ça brille subtilement, parfait pour le bureau et les sorties.",
                rating: 5
            }
        },
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
        {
            id: 5,
            image: realNailsValentine,
            title: "Spécial Saint-Valentin ❤️",
            description: "Design romantique avec coeurs, french rouge et perles. Parfait pour célébrer l'amour! Nail art créatif et unique.",
            category: 'mains',
            testimonial: {
                name: "Émilie B.",
                text: "Mon chum a adoré mes ongles de Saint-Valentin! Josée a créé exactement ce que j'avais en tête. Tellement créative!",
                rating: 5
            }
        },
        // SOINS DES PIEDS
        {
            id: 6,
            image: realFootBeforeAfter,
            title: "Transformation callosités",
            description: "La zone sous le pied est nettement plus lisse, hydratée et confortable en une seule séance!",
            category: 'pieds',
            testimonial: {
                name: "Marie-Claire D.",
                text: "Wow! Je n'en revenais pas de la différence. Mes pieds sont doux comme de la soie maintenant!",
                rating: 5
            }
        },
        {
            id: 7,
            image: realFootCallus,
            title: "Soin complet - Avant/Après",
            description: "Élimination des peaux mortes et callosités. Pieds hydratés et prêts pour l'été. Résultat visible immédiatement!",
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
                name: "Robert G.",
                text: "J'avais honte de mes pieds depuis des années. Maintenant je peux porter des sandales! Merci Josée!",
                rating: 5
            }
        },
        {
            id: 9,
            image: realSummerReady,
            title: "Prête pour l'été! ☀️",
            description: "Transformation complète avant la saison estivale. Pieds parfaits pour les sandales et la plage!",
            category: 'pieds',
            testimonial: {
                name: "Nicole P.",
                text: "Josée m'a préparée pour l'été! Je peux enfin porter mes sandales préférées sans gêne. Service 5 étoiles!",
                rating: 5
            }
        },
        {
            id: 10,
            image: realBeachReady,
            title: "Pieds de plage 🏖️",
            description: "Avant/Après spectaculaire! Ongles soignés et pieds parfaits. Travail minutieux et professionnel.",
            category: 'pieds',
            testimonial: {
                name: "André C.",
                text: "Ma femme n'en revenait pas de la différence! Josée fait vraiment des miracles. Je recommande à 100%!",
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
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedWork(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button - Fixed at top right of modal */}
                                <button
                                    onClick={() => setSelectedWork(null)}
                                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                                    aria-label="Fermer"
                                >
                                    ✕
                                </button>

                                {/* Scrollable content container */}
                                <div className="overflow-y-auto custom-scrollbar">
                                    {/* Image */}
                                    <div className="relative h-64 md:h-72 w-full flex-shrink-0">
                                        <img
                                            src={selectedWork.image}
                                            alt={selectedWork.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-6 left-6 right-6 text-white">
                                            <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{selectedWork.title}</h3>
                                            <p className="text-white/80 text-sm md:text-base">{selectedWork.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial */}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                                            <Quote size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-gray-700 text-lg italic mb-4">
                                                "{selectedWork.testimonial.text}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex">
                                                    {[...Array(selectedWork.testimonial.rating)].map((_, i) => (
                                                        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                                <span className="font-semibold text-gray-900">{selectedWork.testimonial.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                                        <a
                                            href="tel:5142387562"
                                            className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 md:py-4 rounded-full font-semibold text-center hover:shadow-glow transition-all text-sm md:text-base"
                                        >
                                            📞 Appeler Josée
                                        </a>
                                        <a
                                            href="#contact"
                                            onClick={() => setSelectedWork(null)}
                                            className="flex-1 glass py-3 md:py-4 rounded-full font-semibold text-center text-primary-600 hover:shadow-md transition-all text-sm md:text-base"
                                        >
                                            ✉️ Me contacter
                                        </a>
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
