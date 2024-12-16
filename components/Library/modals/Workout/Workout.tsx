import { useState } from 'react'
import {
  Accordion,
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { mockExercises } from '@/testing/data/MockExercises'
import { WorkoutFormData } from '@/types/Workout'
import { SetDetail } from '@/types/WorkoutExercise'
import ExerciseAccordion from './ExerciseAccordion'

export default function WorkoutModal({
  opened,
  onClose,
  onSubmit,
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (exerciseData: WorkoutFormData) => void
}) {
  const [activeStep, setActiveStep] = useState(0)

  const form = useForm<WorkoutFormData>({
    initialValues: {
      name: '',
      description: '',
      duration_minute: undefined,
      intensity: 5,
      type: '',
      exercises: [],
    },
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      type: (value) => (value?.trim() === '' ? 'Type is required' : null),
    },
  })

  const handleAddExercise = () => {
    const newExercise = {
      id: String(Date.now()),
      name: '',
      sets: [] as SetDetail[],
      type: '',
    }
    form.setFieldValue('exercises', [...form.values.exercises, newExercise])
  }

  const handleRemoveExercise = (id: string) => {
    form.setFieldValue(
      'exercises',
      form.values.exercises.filter((exercise) => exercise.id !== id),
    )
  }

  const handleExerciseChange = (exerciseId: string, name: string, type: string) => {
    form.setFieldValue(
      'exercises',
      form.values.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, name, type } : exercise,
      ),
    )
  }

  const handleGenerateRows = (exerciseId: string, numberOfSets: number, exerciseType: string) => {
    form.setFieldValue(
      'exercises',
      form.values.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: Array.from({ length: numberOfSets }, (_, index) => ({
                id: index + 1,
                ...(exerciseType === 'Running'
                  ? { duration: '', pace: '' }
                  : { reps: '', weight: '', rest: '' }),
              })),
            }
          : exercise,
      ),
    )
  }

  const handleSetDetailChange = (
    exerciseId: string,
    setIndex: number,
    updatedFields: Partial<SetDetail>,
  ) => {
    form.setFieldValue(
      'exercises',
      form.values.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) =>
                i === setIndex ? { ...set, ...updatedFields } : set,
              ),
            }
          : exercise,
      ),
    )
  }

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values)
    onClose()
  })
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Create/Edit Workout'
      size='xl'
      centered
      closeOnClickOutside={false} // Temporarily disable outside click to ensure no accidental closes
    >
      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <Stack gap='md'>
            <TextInput
              label='Workout Name'
              placeholder='Enter workout name'
              required
              {...form.getInputProps('name')}
            />
            <TextInput
              label='Description'
              placeholder='Enter workout description (optional)'
              {...form.getInputProps('description')}
            />
            <NumberInput
              label='Duration (minutes)'
              placeholder='Enter duration in minutes'
              {...form.getInputProps('duration_minute')}
            />
            <Select
              label='Workout Type'
              placeholder='Select workout type'
              data={['Strength', 'Cardio', 'Core']}
              {...form.getInputProps('type')}
              required
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Flex direction='column' gap='md'>
            <Accordion>
              {form.values.exercises.map((exercise) => (
                <ExerciseAccordion
                  key={exercise.id}
                  exercise={exercise}
                  mockExercises={mockExercises}
                  onRemove={handleRemoveExercise}
                  onGenerateRows={handleGenerateRows}
                  onExerciseChange={handleExerciseChange}
                  onSetDetailChange={handleSetDetailChange}
                />
              ))}
            </Accordion>
            <Button variant='outline' type='button' onClick={handleAddExercise}>
              + Add Exercise
            </Button>
          </Flex>
        )}

        <Group mt='md' grow>
          {activeStep === 0 && (
            <Button variant='filled' type='button' onClick={() => setActiveStep(1)}>
              Next
            </Button>
          )}
          {activeStep > 0 && (
            <>
              <Button type='button' variant='outline' onClick={() => setActiveStep(0)}>
                Back
              </Button>
              <Button variant='filled' type='submit'>
                Submit
              </Button>
            </>
          )}
        </Group>
      </form>
    </Modal>
  )
}
