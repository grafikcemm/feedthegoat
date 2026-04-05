import React from 'react';

type AlertVariant = "neutral" | "warning" | "danger" | "recovery";

interface AlertBannerProps {
    variant?: AlertVariant;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

export default function AlertBanner({ 
    variant = "neutral", 
    title, 
    description, 
    icon,
    className = ""
}: AlertBannerProps) {
    let variants = {
        bg: "bg-surface",
        border: "border-border",
        textTitle: "text-text",
        textDesc: "text-text-muted",
        defaultIcon: "i"
    };

    if (variant === "warning") {
        variants = {
            bg: "bg-surface",
            border: "border-accent-amber/50 border-l-[3px]",
            textTitle: "text-accent-amber",
            textDesc: "text-text-muted",
            defaultIcon: "⚠️"
        };
    } else if (variant === "danger") {
         variants = {
            bg: "bg-surface/50",
            border: "border-accent-red/50 border-l-[3px]",
            textTitle: "text-accent-red",
            textDesc: "text-text-muted",
            defaultIcon: "!"
        };
    } else if (variant === "recovery") {
        variants = {
            bg: "bg-surface/30",
            border: "border-accent-green/50 border-l-[3px]",
            textTitle: "text-accent-green",
            textDesc: "text-text-muted",
            defaultIcon: "↑"
        };
    }

    return (
        <div className={`p-4 flex items-start gap-3 border ${variants.bg} ${variants.border} ${className}`}>
            <span className={`${variants.textTitle} font-bold mt-0.5 opacity-90`}>{icon || variants.defaultIcon}</span>
            <div>
                <span className={`text-sm tracking-wide font-bold block ${description ? 'mb-0.5' : ''} ${variants.textTitle}`}>
                  {title}
                </span>
                {description && <p className={`text-xs ${variants.textDesc} leading-relaxed`}>{description}</p>}
            </div>
        </div>
    );
}
