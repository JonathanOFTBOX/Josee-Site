import { ExternalLink } from 'lucide-react';

type OftboxCreditProps = {
    variant?: 'dark' | 'light';
    className?: string;
};

const variantClasses = {
    dark: 'border-white/15 bg-white/10 text-primary-100 shadow-primary-950/10 hover:border-primary-300/60 hover:bg-white/15 hover:text-white',
    light: 'border-primary-200/70 bg-white/80 text-primary-800 shadow-primary-100/60 hover:border-primary-400 hover:bg-white hover:text-primary-950',
};

const dotClasses = {
    dark: 'bg-primary-300 shadow-[0_0_14px_rgba(255,255,255,0.65)]',
    light: 'bg-primary-500 shadow-[0_0_14px_rgba(196,149,106,0.45)]',
};

const labelClasses = {
    dark: 'text-primary-200/80',
    light: 'text-primary-600/80',
};

const iconClasses = {
    dark: 'text-primary-200',
    light: 'text-primary-500',
};

export default function OftboxCredit({ variant = 'dark', className = '' }: OftboxCreditProps) {
    return (
        <a
            href="https://oftbox.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-0.5 ${variantClasses[variant]} ${className}`}
            aria-label="Site créé par Oftbox.ca"
        >
            <span className={`h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125 ${dotClasses[variant]}`} />
            <span className={`text-xs uppercase tracking-[0.22em] ${labelClasses[variant]}`}>Site créé par</span>
            <span className="font-semibold">Oftbox.ca</span>
            <ExternalLink size={14} className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${iconClasses[variant]}`} />
        </a>
    );
}
