import React from 'react'
import { Container } from '@mantine/core'
import Chat from '../components/chat.component'

const ChatPage: React.FC = () => {
  return (
    <Container size='md' py='xl'>
      <Chat />
    </Container>
  )
}

export default ChatPage
