import React from 'react'
import { Container } from '@mantine/core'
import Chat from '../components/chat.component'

const ChatPage: React.FC = () => {
  return (
    <Container size='xl' py='sm'>
      <Chat />
    </Container>
  )
}

export default ChatPage
