"use client";

import Image from "next/image";
import { useImage } from "@/hooks/useImage";

/** Indique si la valeur est une clé média (et non une URL/path). */
export function isMediaKey(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return !value.startsWith("/") && !value.startsWith("http://") && !value.startsWith("https://");
}

/** Aperçu quand la section utilise une clé média (médiathèque). */
function SectionImageByKey({
  imageKey,
  alt,
  fallback,
  width,
  height,
  className,
}: {
  imageKey: string;
  alt: string;
  fallback?: string;
  width: number;
  height: number;
  className?: string;
}) {
  const { src, isLoading } = useImage(imageKey, "fr");
  if (isLoading || !src) {
    return (
      <div
        className={`bg-slate-200 animate-pulse ${className || ""}`}
        style={{ width, height }}
      />
    );
  }
  return (
    <Image
      loading="lazy"
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={typeof src === "string" && src.startsWith("/uploads/")}
    />
  );
}

/**
 * Aperçu d'image de section : gère clé média (useImage → /api/media/:key) ou URL/path directe (/images/..., /uploads/...).
 */
export function SectionImagePreview({
  image,
  alt,
  fallback,
  width = 400,
  height = 400,
  className,
}: {
  image: string | null | undefined;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (isMediaKey(image)) {
    return (
      <SectionImageByKey
        imageKey={image!}
        alt={alt}
        fallback={fallback}
        width={width!}
        height={height!}
        className={className}
      />
    );
  }
  const src = image || fallback;
  if (!src) {
    return (
      <div
        className={`bg-slate-200 animate-pulse ${className || ""}`}
        style={{ width, height }}
      />
    );
  }
  return (
    <Image
      loading="lazy"
      src={src}
      alt={alt}
      width={width!}
      height={height!}
      className={className}
      unoptimized={typeof src === "string" && src.startsWith("/uploads/")}
    />
  );
}
