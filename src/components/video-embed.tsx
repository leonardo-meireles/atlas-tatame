"use client";

import { useState } from "react";
import type { Video } from "@/lib/types";
import { youtubeThumb, youtubeEmbed, youtubeWatch } from "@/lib/video";

/**
 * Embed leve de vídeo (facade). Mostra a thumbnail estática + botão de play; só
 * carrega o iframe do YouTube ao clicar — zero iframe pesado no load (perf no mapa).
 * Privacy-enhanced (nocookie).
 */
export function VideoEmbed({ video, compact = false }: { video: Video; compact?: boolean }) {
  const [tocando, setTocando] = useState(false);

  return (
    <figure className="overflow-hidden rounded-[10px] border border-[var(--mat-line)] bg-[var(--mat)]">
      <div className="relative aspect-video w-full">
        {tocando ? (
          <iframe
            src={youtubeEmbed(video.youtubeId, true)}
            title={`Vídeo: ${video.titulo}`}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            onClick={() => setTocando(true)}
            className="group absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Tocar vídeo: ${video.titulo}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={youtubeThumb(video.youtubeId)}
              alt={video.titulo}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-[oklch(0_0_0/0.28)] transition-colors group-hover:bg-[oklch(0_0_0/0.14)]" />
            <span className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--clay)] shadow-lg transition-transform duration-200 group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--paper)" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {!compact && (
        <figcaption className="flex items-center justify-between gap-[var(--space-sm)] px-[var(--space-sm)] py-[6px] text-[0.72rem] text-[var(--on-mat-soft)]">
          <span className="truncate font-medium text-[var(--on-mat)]">{video.titulo}</span>
          <a
            href={youtubeWatch(video.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 underline-offset-2 hover:text-[var(--on-mat)] hover:underline"
          >
            {video.canal ?? "YouTube"} ↗
          </a>
        </figcaption>
      )}
    </figure>
  );
}
