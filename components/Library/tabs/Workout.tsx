import { useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import WorkoutModal from '../modals/Workout/Workout'

// Mock Workout Data
const mockWorkouts = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'A high-intensity strength training session.',
    duration_minute: 60,
    intensity: 8,
    type: 'Strength',
  },
  {
    id: '2',
    name: 'Cardio Blast',
    description: 'A quick and intense cardio workout.',
    duration_minute: 30,
    intensity: 7,
    type: 'Cardio',
  },
  {
    id: '3',
    name: 'Core Stability',
    description: 'Focus on core strength and stability.',
    duration_minute: 45,
    intensity: 6,
    type: 'Core',
  },
]

export default function WorkoutsTab() {
  const [search, setSearch] = useState('')
  const [modalOpened, setModalOpened] = useState(false)
  // Filter workouts based on search input
  const filteredWorkouts = mockWorkouts.filter((workout) =>
    workout.name.toLowerCase().includes(search.toLowerCase()),
  )

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

      <WorkoutModal opened={modalOpened} onClose={() => setModalOpened(false)} />
      {/* Workout Cards */}
      <Grid gutter='xl'>
        {filteredWorkouts.map((workout) => (
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
