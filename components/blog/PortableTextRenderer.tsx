"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import urlForImage from "@/lib/sanity.image";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PortableTextRendererProps {
  content: any;
  className?: string;
}

/* -------------------- Code Block -------------------- */
function CodeBlock({
  value,
}: {
  value: { code: string; language?: string; filename?: string };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          {value.filename && (
            <span className="ml-2 font-mono text-xs text-white/50">
              {value.filename}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {value.language && (
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white/50">
              {value.language}
            </span>
          )}

          <button
            onClick={handleCopy}
            className="rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm text-white/90">{value.code}</code>
      </pre>
    </div>
  );
}

/* -------------------- Image Block -------------------- */
function ImageBlock({
  value,
}: {
  value: { asset: any; alt?: string; caption?: string };
}) {
  const imageUrl = urlForImage(value)?.url();
  if (!imageUrl) return null;

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
        <Image src={imageUrl} alt={value.alt || ""} fill className="object-cover" />
      </div>

      {value.caption && (
        <figcaption className="mt-3 text-center text-sm text-white/50">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------- PortableText Components -------------------- */
const components: PortableTextComponents = {
  types: {
    image: ImageBlock,
    code: CodeBlock,

    callout: ({
      value,
    }: {
      value: { type?: string; title?: string; text?: string };
    }) => (
      <div
        className={cn(
          "my-6 rounded-xl border-l-4 p-4",
          value.type === "info" && "border-neon-cyan bg-neon-cyan/10",
          value.type === "warning" && "border-cyber-yellow bg-cyber-yellow/10",
          value.type === "error" && "border-red-500 bg-red-500/10",
          value.type === "success" && "border-green-500 bg-green-500/10",
          !value.type && "border-electric-purple bg-electric-purple/10"
        )}
      >
        {value.title && (
          <h4 className="mb-2 font-semibold text-white">{value.title}</h4>
        )}
        <p className="text-white/80">{value.text}</p>
      </div>
    ),
  },

  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-6 mt-12 text-4xl font-bold text-white">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-10 text-3xl font-bold text-white">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-8 text-2xl font-semibold text-white">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-6 text-xl font-semibold text-white">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-white/80">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-neon-pink pl-6 italic text-white/70">
        {children}
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-white">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-neon-pink">
        {children}
      </code>
    ),

    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href?: string };
    }) => {
      const isExternal = value?.href?.startsWith("http");

      return (
        <Link
          href={value?.href || "#"}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-1 text-neon-cyan underline decoration-neon-cyan/30 underline-offset-2 hover:decoration-neon-cyan"
        >
          {children}
          {isExternal && <ExternalLink className="h-3 w-3" />}
        </Link>
      );
    },

    highlight: ({ children }: { children?: React.ReactNode }) => (
      <mark className="bg-cyber-yellow/20 text-cyber-yellow">{children}</mark>
    ),
  },

  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-white/80">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-white/80">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="pl-2">{children}</li>
    ),
  },
};

/* -------------------- Exported Renderer -------------------- */
export default function PortableTextRenderer({ content }: PortableTextRendererProps) {
  return (
    <div>
      <PortableText value={content} components={components} />
    </div>
  );
}
