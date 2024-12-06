import { useState } from 'react'
import {
  Accordion,
  Button,
  Divider,
  Fieldset,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { mockExercises } from '@/testing/data/MockExercises'
import { WorkoutFormData } from '@/types/Workout'
import { SetDetail } from '@/types/WorkoutExercise'

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
    {
      id: string
      name: string
      sets: SetDetail[]
      type: string
    }[]
  >([])

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: String(Date.now()),
        name: '',
        sets: [],
        type: '',
      },
    ])
  }

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
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

  const handleSubmit = () => {
    const workoutPayload = {
      ...workoutData,
      exercises,
    }
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
            onChange={(e) =>
              setWorkoutData({
                ...workoutData,
                description: e.currentTarget.value,
              })
            }
          />

          <NumberInput
            label='Duration (minutes)'
            placeholder='Enter duration in minutes'
            value={workoutData.duration_minute}
            onChange={(value) =>
              setWorkoutData({
                ...workoutData,
                duration_minute: value as number,
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
        <Flex gap='md' direction='column'>
          <Accordion>
            {exercises.map((exercise) => {
              const exerciseName =
                mockExercises.find((e) => e.id === exercise.name)?.name || 'New Exercise'
              return (
                <Accordion.Item key={exercise.id} value={exercise.id}>
                  <Accordion.Control>
                    <Flex justify='space-between' align='center'>
                      <Text>{exerciseName}</Text>
                      <Button
                        variant='subtle'
                        color='red'
                        onClick={() => handleRemoveExercise(exercise.id)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Select
                      label='Exercise'
                      placeholder='Choose exercise'
                      data={mockExercises.map((e) => ({
                        value: e.id as string,
                        label: e.name,
                      }))}
                      value={exercise.name}
                      onChange={(value) =>
                        setExercises((prev) =>
                          prev.map((ex) =>
                            ex.id === exercise.id ? { ...ex, name: value as string } : ex,
                          ),
                        )
                      }
                    />
                    <NumberInput
                      label='Number of Sets'
                      placeholder='Enter sets'
                      onChange={(value) =>
                        handleGenerateRows(exercise.id, Number(value) || 1, exercise.type)
                      }
                    />
                    {exercise.sets.length > 0 && (
                      <>
                        <Divider my='sm' label='Set Details' labelPosition='center' />
                        {exercise.sets.map((set, index) => (
                          <Fieldset
                            key={index}
                            style={{
                              marginBottom: '1rem', // Adds space between fieldsets
                              border: '1px solid #ccc',
                              borderRadius: '8px',
                              padding: '1rem',
                            }}
                          >
                            <Group justify='flex-start' grow align='center'>
                              {/* Set Number as a Label */}
                              <Text fw={500} size='sm'>
                                Set {index + 1}
                              </Text>
                              {exercise.type === 'Running' ? (
                                <>
                                  <TextInput
                                    label='Duration'
                                    value={set.duration}
                                    onChange={(e) =>
                                      handleInputChange(
                                        exercise.id,
                                        index,
                                        'duration',
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <TextInput
                                    label='Pace'
                                    value={set.pace}
                                    onChange={(e) =>
                                      handleInputChange(exercise.id, index, 'pace', e.target.value)
                                    }
                                  />
                                </>
                              ) : (
                                <>
                                  <TextInput
                                    label='Reps'
                                    value={set.reps}
                                    onChange={(e) =>
                                      handleInputChange(exercise.id, index, 'reps', e.target.value)
                                    }
                                  />
                                  <TextInput
                                    label='Weight'
                                    value={set.weight}
                                    onChange={(e) =>
                                      handleInputChange(
                                        exercise.id,
                                        index,
                                        'weight',
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <TextInput
                                    label='Rest'
                                    value={set.rest}
                                    onChange={(e) =>
                                      handleInputChange(exercise.id, index, 'rest', e.target.value)
                                    }
                                  />
                                </>
                              )}
                            </Group>
                          </Fieldset>
                        ))}
                      </>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
          <Button variant='outline' onClick={handleAddExercise}>
            + Add Exercise
          </Button>
        </Flex>
      )}

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
