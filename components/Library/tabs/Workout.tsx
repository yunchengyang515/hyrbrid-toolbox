// WorkoutsTab.tsx
import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { from } from 'rxjs'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { WorkoutApiService } from '@/services/api/workout.api.service'
import { WorkoutFormData, WorkoutWithExercises } from '@/types/Workout'
import WorkoutModal from '../modals/Workout/Workout'

const workoutApiService = new WorkoutApiService()

export default function WorkoutsTab() {
  const [search, setSearch] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create')
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutWithExercises | undefined>(
    undefined,
  )

  useEffect(() => {
    const sub = from(workoutApiService.getAllWorkouts()).subscribe({
      next: (data: WorkoutWithExercises[]) => setWorkouts(data),
      error: (err) => console.error('Failed to load workouts:', err),
    })

    return () => sub.unsubscribe()
  }, [])

  // Handler for creating a new workout
  const handleAddWorkout = (newWorkout: WorkoutFormData) => {
    const rollbackState = workouts
    from(workoutApiService.createWorkout(newWorkout)).subscribe({
      next: (created: WorkoutWithExercises) => {
        setWorkouts([...workouts, created])
      },
      error: (err) => {
        console.error('Failed to create workout:', err)
        setWorkouts(rollbackState)
      },
    })
  }

  // Handler for updating an existing workout
  const handleUpdateWorkout = (updatedWorkout: WorkoutWithExercises) => {
    setWorkouts((prevWorkouts) =>
      prevWorkouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w)),
    )
  }

  // Open the modal in create mode
  function openCreateModal() {
    setSelectedWorkout(undefined) // No workout selected
    setModalMode('create')
    setModalOpened(true)
  }

  // Open the modal in view mode for a specific workout
  function openViewModal(workout: WorkoutWithExercises) {
    setSelectedWorkout(workout)
    setModalMode('view')
    setModalOpened(true)
  }

  function openEditModal(workout: WorkoutWithExercises) {
    if (selectedWorkout) {
      setSelectedWorkout(workout)
      setModalMode('edit')
    }
  }

  function closeModal() {
    setModalOpened(false)
  }

  const filteredWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Container fluid px={2}>
      {/* Add Workout Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        {/* Clicking this button opens the modal in create mode */}
        <Button variant='filled' color='blue' size='md' onClick={openCreateModal}>
          + Add Workout
        </Button>
        <TextInput
          placeholder='Search workouts'
          size='md'
          leftSection={<IconSearch size={16} stroke={1.5} />}
          w={300}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
      </Group>

      <WorkoutModal
        opened={modalOpened}
        onClose={closeModal}
        mode={modalMode}
        onSubmit={handleAddWorkout}
        onUpdate={handleUpdateWorkout}
        workoutData={modalMode === 'edit' || modalMode === 'view' ? selectedWorkout : undefined}
        onEditMode={(workout: WorkoutWithExercises) => openEditModal(workout)}
      />

      {/* Workout Cards */}
      <Grid gutter='xl'>
        {filteredWorkouts.map((workout) => (
          <Grid.Col key={workout.id} span={4}>
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              h='200px'
              onClick={() => openViewModal(workout)} // Opening a card calls openViewModal
              style={{ cursor: 'pointer' }}
            >
              <Group justify='space-between' align='center' mb='sm'>
                <Text fw={700} size='lg'>
                  {workout.name}
                </Text>
                <Badge color='teal' variant='light' size='lg'>
                  {workout.type}
                </Badge>
              </Group>

              {workout.description && (
                <Text size='sm' c='dimmed' mb='sm'>
                  {workout.description}
                </Text>
              )}

              <Text size='sm' c='dimmed'>
                <strong>Duration:</strong> {workout.duration_minute} minutes
              </Text>
              <Text size='sm' c='dimmed'>
                <strong>Intensity:</strong> {workout.intensity}/10
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
