import React, { useEffect, useRef, useState } from 'react'
import { IconSend, IconTrash } from '@tabler/icons-react'
import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { ChatSessionApiService } from '@/services/api/chat-session.api.service'
import { ChatApiService } from '@/services/api/chat.api.service'

interface Message {
  id: number
  content: string
  isUser: boolean
  timestamp?: Date
}

interface ChatMessageProps {
  message: Message
  isUser: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => (
  <Group align='flex-start' gap='sm' style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
    {!isUser && (
      <Avatar size='md' radius='xl' color='blue'>
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
      <Text color={isUser ? 'white' : 'dark'}>{message.content}</Text>
    </Paper>
    {isUser && (
      <Avatar size='md' radius='xl' color='gray'>
        You
      </Avatar>
    )}
  </Group>
)

const predefinedPrompts = [
  "What's a good workout for beginners?",
  'How can I improve my diet?',
  'Tell me about HIIT workouts.',
  'What are the benefits of yoga?',
  'How do I stay motivated?',
]

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
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const chatApiService = new ChatApiService()
  const chatSessionApiService = new ChatSessionApiService()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const newSessionId = await chatSessionApiService.getSessionId()
        setSessionId(newSessionId)
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            content:
              'Sorry, I encountered an error while starting a new session. Please try again.',
            isUser: false,
            timestamp: new Date(),
          },
        ])
      }
    }
    initializeSession()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId) {
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
    setIsGenerating(true)
    setIsFirstMessageSent(true)

    try {
      const aiText = await chatApiService.sendMessage(userMessage.content, sessionId)
      const aiResponse: Message = {
        id: messages.length + 2,
        content: aiText,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
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
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
    handleSendMessage()
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
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} isUser={message.isUser} />
            ))}
            {isGenerating && (
              <Group align='center' style={{ justifyContent: 'flex-start' }} gap='sm'>
                <Avatar size='md' radius='xl' color='blue'>
                  AI
                </Avatar>
                <Loader size='sm' />
                <Text>Generating response...</Text>
              </Group>
            )}
          </Stack>
        </ScrollArea>

        {!isFirstMessageSent && (
          <Group gap='xs' mb='xs'>
            {predefinedPrompts.map((prompt, index) => (
              <Button key={index} onClick={() => handlePromptClick(prompt)}>
                {prompt}
              </Button>
            ))}
          </Group>
        )}

        {isFirstMessageSent && (
          <Group gap='xs'>
            <TextInput
              placeholder='Type your message...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ flex: 1 }}
              disabled={isGenerating}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isGenerating}
              variant='filled'
            >
              <IconSend size={16} />
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  )
}

export default Chat
