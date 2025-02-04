import React, { useEffect, useRef, useState } from 'react'
import { IconSend, IconTrash } from '@tabler/icons-react'
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'

interface Message {
  id: number
  content: string
  isUser: boolean
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
  isUser: boolean
  isStreaming?: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, isStreaming }) => (
  <Group align='flex-start' gap='sm' style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
    {!isUser && (
      <Avatar size='md' radius='xl' src={null} color='blue'>
        AI
      </Avatar>
    )}
    <Paper
      p='md'
      radius='md'
      bg={isUser ? 'blue.5' : 'gray.0'}
      style={{
        maxWidth: '70%',
        marginLeft: isUser ? 'auto' : '0',
      }}
    >
      <Text color={isUser ? 'white' : 'dark'}>
        {message.content}
        {isStreaming && <span className='cursor'>|</span>}
      </Text>
    </Paper>
    {isUser && (
      <Avatar size='md' radius='xl' src={null} color='gray'>
        You
      </Avatar>
    )}
  </Group>
)

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi! I'm Dylan, your AI fitness coach. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      return
    }

    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsStreaming(true)

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        body: JSON.stringify({ message: inputValue }),
      })

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiMessageContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }

        const chunk = decoder.decode(value)
        aiMessageContent += chunk

        // Update the message in real-time as chunks arrive
        setMessages((prev) => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]

          if (!lastMessage.isUser) {
            lastMessage.content = aiMessageContent
          } else {
            newMessages.push({
              id: prev.length + 1,
              content: aiMessageContent,
              isUser: false,
              timestamp: new Date(),
            })
          }

          return newMessages
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Paper radius='md' p='md' withBorder style={{ height: '600px' }}>
      <Stack gap='xs' style={{ height: '100%' }}>
        <Group style={{ justifyContent: 'space-between' }} mb='md'>
          <Text size='xl' fw={700}>
            Talk to Dylan AI 🤖
          </Text>
          <ActionIcon
            color='red'
            variant='subtle'
            onClick={() => setMessages([messages[0]])}
            title='Clear chat'
          >
            <IconTrash size={20} />
          </ActionIcon>
        </Group>

        <ScrollArea style={{ flex: 1 }} viewportRef={scrollAreaRef}>
          <Stack gap='lg'>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isUser={message.isUser}
                isStreaming={isStreaming && index === messages.length - 1 && !message.isUser}
              />
            ))}
          </Stack>
        </ScrollArea>

        <Group gap='xs'>
          <TextInput
            placeholder='Type your message...'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1 }}
            disabled={isStreaming}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isStreaming}
            variant='filled'
          >
            <IconSend size={16} />
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}

export default Chat
