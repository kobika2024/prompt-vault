'use client'

import { useState } from 'react'
import { Copy, Check, Terminal } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface PromptBlockProps {
  text: string
  title?: string
}

export default function PromptBlock({ text, title = 'Prompt' }: PromptBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Detect if the prompt contains code blocks
  const hasCodeBlock = text.includes('```')

  return (
    <div className="rounded-xl border border-sky-900/40 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d1526] border-b border-sky-900/40">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-sky-500" />
          <span className="text-xs font-mono text-sky-400/80">{title}</span>
          <div className="flex gap-1 ml-2">
            <div className="w-2 h-2 rounded-full bg-red-500/60" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all
            bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-400/40
            text-sky-400 hover:text-sky-300"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-[#0b1220]">
        {hasCodeBlock ? (
          <SyntaxHighlighter
            language="markdown"
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
            }}
            wrapLongLines
          >
            {text}
          </SyntaxHighlighter>
        ) : (
          <pre className="p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
            {text}
          </pre>
        )}
      </div>
    </div>
  )
}
