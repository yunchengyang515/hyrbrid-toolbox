import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { from } from 'rxjs'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { WorkoutApiService } from '@/services/api/workout.api.service'
import { Workout, WorkoutFormData } from '@/types/Workout'
import WorkoutModal from '../modals/Workout/Workout'

// Mock Workout Data

const workoutApiService = new WorkoutApiService()

export default function WorkoutsTab() {
  const [search, setSearch] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  // Filter workouts based on search input

  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    // Convert the Promise returned by getAllWorkouts() to an Observable using from()
    const sub = from(workoutApiService.getAllWorkouts()).subscribe({
      next: (data: Workout[]) => setWorkouts(data),
      error: (err) => console.error('Failed to load workouts:', err),
    })

    // Cleanup subscription on unmount
    return () => sub.unsubscribe()
  }, [])

  const handleAddWorkout = (newWorkout: WorkoutFormData) => {
    const rollbackState = workouts

    from(workoutApiService.createWorkout(newWorkout)).subscribe({
      next: (newWorkout: Workout) => {
        console.log('Workout created:', newWorkout)
        setWorkouts([...workouts, newWorkout])
      },
      error: (err) => {
        console.error('Failed to create workout:', err)
        setWorkouts(rollbackState)
      },
    })
  }
  return (
    <Container fluid px={2}>
      {/* Add Workout Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        <Button variant='filled' color='blue' size='md' onClick={() => setModalOpened(true)}>
          + Add Workout
        </Button>
        <TextInput
          placeholder='Search workouts'
          size='md'
          leftSection={<IconSearch size={16} stroke={1.5} />}
          w={300} // Limit width for cleaner UI
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
      </Group>

      <WorkoutModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={handleAddWorkout}
      />
      {/* Workout Cards */}
      <Grid gutter='xl'>
        {workouts.map((workout) => (
          <Grid.Col key={workout.id} span={4}>
            <Card shadow='sm' padding='lg' radius='md' withBorder h='200px'>
              {/* Header Section: Title + Badge */}
              <Group justify='space-between' align='center' mb='sm'>
                <Text fw={700} size='lg'>
                  {workout.name}
                </Text>
                <Badge color='teal' variant='light' size='lg'>
                  {workout.type}
                </Badge>
              </Group>

              {/* Description */}
              {workout.description && (
                <Text size='sm' c='dimmed' mb='sm'>
                  {workout.description}
                </Text>
              )}

              {/* Duration and Intensity */}
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
