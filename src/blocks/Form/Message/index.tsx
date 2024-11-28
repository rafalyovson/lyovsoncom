import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'

type MessageProps = {
  message: Record<string, any>
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText content={message} />}
    </Width>
  )
}
