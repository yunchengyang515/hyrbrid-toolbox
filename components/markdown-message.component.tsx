import React from 'react'
import { Remarkable } from 'remarkable'
import { TypographyStylesProvider } from '@mantine/core'

interface MarkdownMessageProps {
  content: string
  isUser: boolean
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, isUser }) => {
  const md = new Remarkable()
  const renderedContent = md.render(content)

  return (
    <TypographyStylesProvider>
      <div
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        style={{ color: isUser ? 'white' : 'dark' }}
      />
    </TypographyStylesProvider>
  )
}

export default MarkdownMessage
