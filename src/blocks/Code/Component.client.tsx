'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React from 'react'

import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
}

export const Code: React.FC<Props> = ({ code, language = '' }) => {
  if (!code) return null

  return (
    <div className="glass-section glass-premium relative">
      <Highlight code={code} language={language} theme={themes.vsDark}>
        {({ getLineProps, getTokenProps, tokens }) => (
          <pre className="glass-bg glass-text p-6 border border-glass-border rounded-lg overflow-x-auto backdrop-blur-md text-sm font-mono leading-relaxed">
            {/* Language indicator */}
            {language && (
              <div className="absolute top-3 right-15 glass-badge px-2 py-1 text-xs font-medium rounded">
                {language.toUpperCase()}
              </div>
            )}

            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ className: 'table-row', line })}>
                <span className="table-cell select-none text-right glass-text-secondary opacity-50 pr-4 min-w-[3rem]">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
            <CopyButton code={code} />
          </pre>
        )}
      </Highlight>
    </div>
  )
}
