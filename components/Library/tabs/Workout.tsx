import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { from } from 'rxjs'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { WorkoutApiService } from '@/services/api/workout.api.service'
import { Workout, WorkoutFormData } from '@/types/Workout'
import WorkoutModal from '../modals/Workout/Workout'

const workoutApiService = new WorkoutApiService()

export default function WorkoutsTab() {
  const [search, setSearch] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>() // track clicked workout

  useEffect(() => {
    const sub = from(workoutApiService.getAllWorkouts()).subscribe({
      next: (data: Workout[]) => setWorkouts(data),
      error: (err) => console.error('Failed to load workouts:', err),
    })
    return () => sub.unsubscribe()
  }, [])

  const handleAddWorkout = (newWorkout: WorkoutFormData) => {
    const rollbackState = workouts
    from(workoutApiService.createWorkout(newWorkout)).subscribe({
      next: (created: Workout) => {
        setWorkouts([...workouts, created])
      },
      error: (err) => {
        console.error('Failed to create workout:', err)
        setWorkouts(rollbackState)
      },
    })
  }

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    // Update the workouts state after editing
    setWorkouts((prev) => prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w)))
  }

  // Click card to view workout
  const handleCardClick = (workout: Workout) => {
    setSelectedWorkout(workout)
    setModalOpened(true)
  }

  const closeModal = () => {
    setSelectedWorkout(undefined)
    setModalOpened(false)
  }

  return (
    <Container fluid px={2}>
      {/* Add Workout Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        <Button
          variant='filled'
          color='blue'
          size='md'
          onClick={() => {
            setSelectedWorkout(undefined) // no selected workout means create mode
            setModalOpened(true)
          }}
        >
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
        onSubmit={handleAddWorkout}
        onUpdate={handleUpdateWorkout}
        workoutData={selectedWorkout} // if null, create mode; if not null, view mode
      />

      {/* Workout Cards */}
      <Grid gutter='xl'>
        {workouts
          .filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
          .map((workout) => (
            <Grid.Col key={workout.id} span={4}>
              <Card
                shadow='sm'
                padding='lg'
                radius='md'
                withBorder
                h='200px'
                onClick={() => handleCardClick(workout)}
                style={{ cursor: 'pointer' }} // indicate clickable
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
