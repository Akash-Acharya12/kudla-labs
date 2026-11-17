'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-slate-200">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // It's a code block
          const lines = part.slice(3, -3).trim().split('\n');
          let language = 'code';
          let code = part.slice(3, -3);

          if (lines.length > 0 && lines[0].trim() && !lines[0].includes(' ') && !lines[0].includes('(')) {
            language = lines[0].trim();
            code = lines.slice(1).join('\n');
          }

          return <CodeBlock key={index} code={code} language={language} />;
        }

        // It's regular markdown text (headings, bold, lists, paragraphs)
        return <FormattedMarkdownSection key={index} text={part} />;
      })}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-[#071322]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono uppercase text-cyan-400">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs text-cyan-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FormattedMarkdownSection({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1 pl-5">
            {currentList.items.map((it, i) => (
              <li key={i} className="list-disc text-sm text-slate-300">
                {formatInline(it)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1 pl-5">
            {currentList.items.map((it, i) => (
              <li key={i} className="list-decimal text-sm text-slate-300">
                {formatInline(it)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="mt-4 text-base font-bold text-cyan-300">
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${index}`} className="mt-5 text-lg font-bold text-cyan-200">
          {formatInline(trimmed.slice(3))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={`h1-${index}`} className="mt-6 text-xl font-extrabold text-white">
          {formatInline(trimmed.slice(2))}
        </h1>
      );
      return;
    }

    // Unordered lists (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.slice(2));
      return;
    }

    // Ordered lists (e.g. 1. )
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberedMatch[2]);
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-2 border-l-2 border-cyan-400/50 bg-white/5 py-1.5 pl-3 text-xs italic text-slate-300"
        >
          {formatInline(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${index}`} className="my-1.5 text-sm text-slate-200">
        {formatInline(trimmed)}
      </p>
    );
  });

  flushList();

  return <>{elements}</>;
}

function formatInline(str: string): React.ReactNode {
  // Replace bold **bold**
  // Replace inline `code`
  const tokens = str.split(/(\*\*.*?\*\*|`.*?`)/g);

  return (
    <>
      {tokens.map((token, i) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-white">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith('`') && token.endsWith('`')) {
          return (
            <code
              key={i}
              className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-cyan-200"
            >
              {token.slice(1, -1)}
            </code>
          );
        }
        return token;
      })}
    </>
  );
}
