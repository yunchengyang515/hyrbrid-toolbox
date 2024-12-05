import { useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { mockExercises } from '@/testing/data/MockExercises'
import { Exercise } from '@/types/Exercise'
import ExerciseModal from '../modals/Exercise'

export default function ExercisesTab() {
  const [modalOpened, setModalOpened] = useState(false) // Modal state
  const [exercises, setExercises] = useState(mockExercises)
  const handleAddExercise = (newExercise: Exercise) => {
    setExercises([...exercises, newExercise])
  }

  return (
    <Container fluid px={2}>
      {/* Add Exercise Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        <Button
          variant='filled'
          color='blue'
          size='md'
          onClick={() => setModalOpened(true)} // Open modal on click
        >
          + Add Exercise
        </Button>
        <TextInput
          placeholder='Search exercises'
          size='md'
          leftSection={<IconSearch size={16} stroke={1.5} />}
          w={300} // Limit width for cleaner UI
        />
      </Group>

      <ExerciseModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={handleAddExercise}
      />

      {/* Exercise Cards */}
      <Grid gutter='xl'>
        {mockExercises.map((exercise: Exercise) => (
          <Grid.Col key={exercise.id} span={4}>
            <Card shadow='sm' padding='lg' radius='md' withBorder h='160px'>
              {/* Header Section: Title + Badge */}
              <Group justify='space-between' align='center' mb='sm'>
                <Text fw={700} size='lg'>
                  {exercise.name}
                </Text>
                <Badge color='teal' variant='light' size='lg'>
                  {exercise.type}
                </Badge>
              </Group>

              {/* Description */}
              {exercise.description && (
                <Text size='sm' c='dimmed' mb='sm'>
                  {exercise.description}
                </Text>
              )}

              {/* Equipment */}
              {exercise.equipment && exercise.equipment.length > 0 && (
                <Text size='sm' c='dimmed' mb='sm'>
                  <strong>Equipment:</strong> {exercise.equipment.join(', ')}
                </Text>
              )}

              {/* Video Link */}
              {exercise.video_link && (
                <Text
                  size='sm'
                  c='blue'
                  td='underline'
                  component='a'
                  href={exercise.video_link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Watch Video
                </Text>
              )}
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  )
}
