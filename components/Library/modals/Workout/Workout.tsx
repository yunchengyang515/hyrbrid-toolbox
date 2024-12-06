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
import { mockExercises } from '@/testing/data/MockExercises'
import { WorkoutFormData } from '@/types/Workout'
import { SetDetail } from '@/types/WorkoutExercise'
import ExerciseAccordion from './ExerciseAccordion' // Import the modularized component

export default function WorkoutModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  const initialFormData: WorkoutFormData = {
    name: '',
    description: '',
    duration_minute: undefined,
    intensity: 5,
    type: '',
  }

  const [activeStep, setActiveStep] = useState(0)
  const [workoutData, setWorkoutData] = useState<WorkoutFormData>(initialFormData)
  const [exercises, setExercises] = useState<
    { id: string; name: string; sets: SetDetail[]; type: string }[]
  >([])

  const handleAddExercise = () => {
    setExercises([...exercises, { id: String(Date.now()), name: '', sets: [], type: '' }])
  }

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id))
  }

  const handleExerciseChange = (exerciseId: string, name: string, type: string) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === exerciseId ? { ...exercise, name, type } : exercise)),
    )
  }

  const handleGenerateRows = (exerciseId: string, numberOfSets: number, exerciseType: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
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

  const handleInputChange = (
    exerciseId: string,
    index: number,
    field: keyof SetDetail,
    value: SetDetail[keyof SetDetail],
  ) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set, i) => (i === index ? { ...set, [field]: value } : set)),
            }
          : exercise,
      ),
    )
  }

  const handleSubmit = () => {
    const workoutPayload = { ...workoutData, exercises }
    console.log('Submit Workout:', workoutPayload)
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title='Create/Edit Workout' size='xl' centered>
      {/* Step 1: Workout Details */}
      {activeStep === 0 && (
        <Stack gap='md'>
          <TextInput
            label='Workout Name'
            placeholder='Enter workout name'
            required
            value={workoutData.name}
            onChange={(e) => setWorkoutData({ ...workoutData, name: e.currentTarget.value })}
          />
          <TextInput
            label='Description'
            placeholder='Enter workout description (optional)'
            value={workoutData.description}
            onChange={(e) => setWorkoutData({ ...workoutData, description: e.currentTarget.value })}
          />
          <NumberInput
            label='Duration (minutes)'
            placeholder='Enter duration in minutes'
            value={workoutData.duration_minute}
            onChange={(value) =>
              setWorkoutData({
                ...workoutData,
                duration_minute: Number(value) || undefined,
              })
            }
          />
          <Select
            label='Workout Type'
            placeholder='Select workout type'
            data={['Strength', 'Cardio', 'Core']}
            value={workoutData.type}
            onChange={(value) => setWorkoutData({ ...workoutData, type: value || '' })}
          />
        </Stack>
      )}

      {/* Step 2: Add Exercises */}
      {activeStep === 1 && (
        <Flex direction='column' gap='md'>
          <Accordion>
            {exercises.map((exercise) => (
              <ExerciseAccordion
                key={exercise.id}
                exercise={exercise}
                mockExercises={mockExercises}
                onRemove={handleRemoveExercise}
                onGenerateRows={handleGenerateRows}
                onInputChange={handleInputChange}
                onExerciseChange={handleExerciseChange}
              />
            ))}
          </Accordion>
          <Button variant='outline' onClick={handleAddExercise}>
            + Add Exercise
          </Button>
        </Flex>
      )}

      {/* Navigation Buttons */}
      <Group mt='md' grow>
        {activeStep > 0 && <Button onClick={() => setActiveStep((prev) => prev - 1)}>Back</Button>}
        {activeStep === 0 ? (
          <Button onClick={() => setActiveStep((prev) => prev + 1)}>Next</Button>
        ) : (
          <Button color='blue' onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Group>
    </Modal>
  )
}
