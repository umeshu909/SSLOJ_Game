"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  label?: string;
  fallbackHref: string;
};

const BackButton = ({ label = "Retour", fallbackHref }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    const currentUrl = window.location.href;
    router.back();

    // Si après 300ms on est toujours sur la même page, on redirige
    setTimeout(() => {
      if (window.location.href === currentUrl) {
        router.push(fallbackHref);
      }
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 text-sm text-white px-3 py-1 rounded hover:bg-white/10 transition"
    >
      <ArrowLeft className="w-4 h-4" /> {label}
    </button>
  );
};

export default BackButton;