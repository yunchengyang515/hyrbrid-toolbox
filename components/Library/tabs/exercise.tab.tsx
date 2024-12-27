import { useEffect, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { from } from 'rxjs'
import { Badge, Button, Card, Container, Grid, Group, Text, TextInput } from '@mantine/core'
import { ExerciseApiService } from '@/services/api/exercise.api.service'
import { Exercise, ExerciseFormData } from '@/types/exercise.types'
import ExerciseModal from '../forms/exercise.modal'

export default function ExercisesTab() {
  const exerciseApiService = new ExerciseApiService()
  const [modalOpened, setModalOpened] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | undefined>(undefined)

  const handleAddExercise = (newExercise: ExerciseFormData) => {
    const rollbackState = exercises

    from(exerciseApiService.createExercise(newExercise)).subscribe({
      next: (newExercise: Exercise) => {
        console.log('Exercise created', newExercise)
        setExercises([...exercises, newExercise])
      },
      error: (err) => {
        console.error('Failed to create exercise', err)
        setExercises(rollbackState)
      },
    })
  }

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    const rollbackState = exercises

    from(exerciseApiService.updateExercise(updatedExercise)).subscribe({
      next: (updated: Exercise) => {
        setExercises((prevExercises) =>
          prevExercises.map((exercise) => (exercise.id === updated.id ? updated : exercise)),
        )
      },
      error: (err) => {
        console.error('Failed to update exercise', err)
        setExercises(rollbackState)
      },
    })
  }

  useEffect(() => {
    const sub = from(exerciseApiService.getAllExercises()).subscribe({
      next: (data) => setExercises(data),
      error: (err) => console.error('Failed to load exercises', err),
    })
    return () => sub.unsubscribe()
  }, [])

  function openCreateModal() {
    setSelectedExercise(undefined)
    setModalMode('create')
    setModalOpened(true)
  }

  function openViewModal(exercise: Exercise) {
    setSelectedExercise(exercise)
    setModalMode('view')
    setModalOpened(true)
  }

  function openEditModal(exercise: Exercise) {
    setSelectedExercise(exercise)
    setModalMode('edit')
    setModalOpened(true)
  }

  function closeModal() {
    setModalOpened(false)
  }

  return (
    <Container fluid px={2}>
      {/* Add Exercise Button and Search Bar */}
      <Group justify='flex-start' align='center' mb='xl' wrap='wrap' gap='sm'>
        <Button
          variant='filled'
          color='blue'
          size='md'
          onClick={openCreateModal}
          data-testid='add-exercise-button'
        >
          + Add Exercise
        </Button>
        <TextInput
          placeholder='Search exercises'
          size='md'
          leftSection={<IconSearch size={16} stroke={1.5} />}
          w={300}
        />
      </Group>

      <ExerciseModal
        opened={modalOpened}
        onClose={closeModal}
        mode={modalMode}
        onSubmit={handleAddExercise}
        onUpdate={handleUpdateExercise}
        exerciseData={modalMode === 'edit' || modalMode === 'view' ? selectedExercise : undefined}
        onEditMode={(exercise: ExerciseFormData) => openEditModal(exercise as Exercise)}
      />

      {/* Exercise Cards */}
      <Grid gutter='xl'>
        {exercises.map((exercise: Exercise, index) => (
          <Grid.Col key={exercise.id} span={4}>
            <Card
              shadow='sm'
              padding='lg'
              radius='md'
              withBorder
              h='160px'
              onClick={() => openViewModal(exercise)}
              style={{ cursor: 'pointer' }}
              data-testid={`exercise-card-${String(index + 1)}`}
              key={exercise.id}
            >
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
