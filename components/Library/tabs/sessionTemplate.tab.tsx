import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { from } from 'rxjs'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import SessionModal from '@/components/forms/session.modal'
import { SessionTemplateApiService } from '@/services/api/sessionTemplate.api.service'
import { Session, SessionFormData } from '@/types/session.types'

const sessionApiService = new SessionTemplateApiService()

export default function SessionTemplateTab() {
  const [search, setSearch] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create')
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined)

  useEffect(() => {
    const sub = from(sessionApiService.getAllSessions()).subscribe({
      next: (data: Session[]) => setSessions(data),
      error: (err) => console.error('Failed to load sessions:', err),
    })

    return () => sub.unsubscribe()
  }, [])

  // Handler for creating a new session
  const handleAddSession = (newSession: SessionFormData) => {
    const rollbackState = sessions
    from(sessionApiService.createSession(newSession)).subscribe({
      next: (created: Session) => {
        notifications.show({
          title: 'Session created',
          message: `Successfully created session "${created.name}"`,
          color: 'teal',
        })
        setSessions([...sessions, created])
      },
      error: (err) => {
        console.error('Failed to create session:', err)
        notifications.show({
          title: 'Failed to create session',
          message: err.message,
          color: 'red',
        })
        setSessions(rollbackState)
      },
    })
  }

  // Handler for updating an existing session
  const handleUpdateSession = (updatedSession: Session) => {
    const rollbackState = sessions
    from(sessionApiService.updateSession(updatedSession)).subscribe({
      next: (updated: Session) => {
        notifications.show({
          title: 'Session updated',
          message: `Successfully updated session "${updated.name}"`,
          color: 'teal',
        })
        setSessions((prevSessions) => prevSessions.map((s) => (s.id === updated.id ? updated : s)))
      },
      error: (err) => {
        notifications.show({
          title: 'Failed to update session',
          message: err.message,
          color: 'red',
        })
        console.error('Failed to update session:', err)
        setSessions(rollbackState)
      },
    })
  }

  // Open the modal in create mode
  function openCreateModal() {
    setSelectedSession(undefined) // No session selected
    setModalMode('create')
    setModalOpened(true)
  }

  // Open the modal in view mode for a specific session
  function openViewModal(session: Session) {
    setSelectedSession(session)
    setModalMode('view')
    setModalOpened(true)
  }

  function openEditModal(session: Session) {
    setSelectedSession(session)
    setModalMode('edit')
    setModalOpened(true)
  }

  function closeModal() {
    setModalOpened(false)
  }

  const filteredSessions = sessions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Container fluid px={2}>
      {/* Add Session Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        {/* Clicking this button opens the modal in create mode */}
        <Button
          variant='filled'
          color='blue'
          size='md'
          onClick={openCreateModal}
          data-testid='add-session-button'
        >
          + Add Session
        </Button>
        <TextInput
          placeholder='Search sessions'
          size='md'
          leftSection={<IconSearch size={16} stroke={1.5} />}
          w={300}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
      </Group>

      <SessionModal
        opened={modalOpened}
        onClose={closeModal}
        mode={modalMode}
        onSubmit={handleAddSession}
        onUpdate={handleUpdateSession}
        sessionData={modalMode === 'edit' || modalMode === 'view' ? selectedSession : undefined}
        onEditMode={(session: Session) => openEditModal(session)}
      />

      {/* Session Cards */}
      <Grid gutter='xl'>
        {filteredSessions.map((session, index) => (
          <Grid.Col key={session.id} span={4}>
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              h='200px'
              onClick={() => openViewModal(session)} // Opening a card calls openViewModal
              style={{ cursor: 'pointer' }}
              data-testid={`session-card-${String(index + 1)}`}
            >
              <Group justify='space-between' align='center' mb='sm'>
                <Text fw={700} size='lg'>
                  {session.name}
                </Text>
                <Badge color='teal' variant='light' size='lg'>
                  {session.type}
                </Badge>
              </Group>

              {session.description ? (
                <Text size='sm' c='dimmed' mb='sm'>
                  {session.description}
                </Text>
              ) : (
                <Text size='sm' c='dimmed' mb='sm'>
                  No description available
                </Text>
              )}

              <Text size='sm' c='dimmed'>
                <strong>Duration:</strong>{' '}
                {session.duration_minute ? session.duration_minute : 'N/A'} minutes
              </Text>
              <Text size='sm' c='dimmed'>
                <strong>Intensity:</strong> {session.intensity ? session.intensity : 'N/A'}/10
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
