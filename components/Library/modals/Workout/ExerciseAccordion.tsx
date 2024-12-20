import { useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import {
  Accordion,
  ActionIcon,
  Button,
  Divider,
  Fieldset,
  Group,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core'
import { SetDetail, WorkoutExercise } from '@/types/WorkoutExercise'

interface ExerciseAccordionProps {
  exercises: WorkoutExercise[]
  readOnly?: boolean
  onUpdateExercises: (updatedExercises: WorkoutExercise[]) => void
}

export default function ExerciseAccordion({
  exercises,
  readOnly = false,
  onUpdateExercises,
}: ExerciseAccordionProps) {
  const [localExercises, setLocalExercises] = useState(exercises)

  // Function to generate a summary of sets
  const generateSetSummary = (exercise: WorkoutExercise) => {
    if (!exercise.set_rep_detail.length) {
      return 'No sets defined'
    }

    return exercise.set_rep_detail
      .map((set) => {
        if (exercise.exercise_type === 'Running') {
          if (set.duration && set.pace) {
            return `${set.duration}@${set.pace}`
          }
        }
        const reps = set.reps !== undefined ? set.reps : '?'
        const weight = set.weight !== undefined ? set.weight : '?'
        const rest = set.rest !== undefined ? ` (Rest: ${set.rest}s)` : ''
        return `${reps}x${weight}kg${rest}`
      })
      .filter(Boolean)
      .join(', ')
  }

  // Handler for removing exercise
  const handleRemoveExercise = (id: string) => {
    const updatedExercises = localExercises.filter((ex) => ex.id !== id)
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  // Handler for changing exercise details
  const handleExerciseChange = (id: string, field: keyof WorkoutExercise, value: any) => {
    const updatedExercises = localExercises.map((ex) =>
      ex.id === id ? { ...ex, [field]: value } : ex,
    )
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  // Handler for adding a new exercise
  const handleAddExercise = () => {
    const newExercise: WorkoutExercise = {
      id: String(Date.now()),
      exercise_name: '',
      set_rep_detail: [],
      exercise_type: '',
      workout_id: '',
      exercise_id: '',
      user_id: '',
    }
    const updatedExercises = [...localExercises, newExercise]
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  return (
    <>
      {localExercises.length > 0 ? (
        <Accordion>
          {localExercises.map((exercise) => (
            <Accordion.Item key={exercise.id} value={exercise.id}>
              <Accordion.Control>
                <Group justify='space-between' align='center'>
                  <div>
                    <Text>{exercise.exercise_name || 'New Exercise'}</Text>
                    <Text size='sm' c='dimmed'>
                      {generateSetSummary(exercise)}
                    </Text>
                  </div>
                  {!readOnly && (
                    <Button
                      variant='subtle'
                      color='red'
                      size='xs'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveExercise(exercise.id)
                      }}
                      style={{ alignSelf: 'center' }}
                    >
                      Remove
                    </Button>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {/* Exercise Name */}
                <TextInput
                  label='Exercise Name'
                  value={exercise.exercise_name}
                  readOnly={readOnly}
                  onChange={(e) =>
                    handleExerciseChange(exercise.id, 'exercise_name', e.currentTarget.value)
                  }
                />

                {/* Exercise Type */}
                <TextInput
                  label='Exercise Type'
                  value={exercise.exercise_type}
                  readOnly={readOnly}
                  onChange={(e) =>
                    handleExerciseChange(exercise.id, 'exercise_type', e.currentTarget.value)
                  }
                />

                {/* Number of Sets */}
                <NumberInput
                  label='Number of Sets'
                  placeholder='Enter sets'
                  value={exercise.set_rep_detail.length}
                  min={1}
                  max={10}
                  readOnly={readOnly}
                  onChange={(val) =>
                    handleExerciseChange(
                      exercise.id,
                      'set_rep_detail',
                      Array.from({ length: Number(val) }, (_, index) => ({
                        id: index + 1,
                        reps: '',
                        weight: '',
                        rest: '',
                      })),
                    )
                  }
                />

                {/* Set Details */}
                {exercise.set_rep_detail.length > 0 && (
                  <>
                    <Divider my='sm' label='Set Details' labelPosition='center' />
                    {exercise.set_rep_detail.map((set: SetDetail, index: number) => (
                      <Fieldset
                        key={set.id}
                        style={{
                          marginBottom: '1rem',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '1rem',
                        }}
                      >
                        <Group align='center'>
                          <Text fw={500} size='sm'>
                            Set {index + 1}
                          </Text>
                          {!readOnly && (
                            <ActionIcon
                              color='red'
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleExerciseChange(
                                  exercise.id,
                                  'set_rep_detail',
                                  exercise.set_rep_detail.filter((_, i) => i !== index),
                                )
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          )}
                          {exercise.exercise_type === 'Running' ? (
                            <>
                              <TextInput
                                label='Duration'
                                value={set.duration || ''}
                                readOnly={readOnly}
                                onChange={(e) =>
                                  handleExerciseChange(
                                    exercise.id,
                                    'set_rep_detail',
                                    exercise.set_rep_detail.map((s, i) =>
                                      i === index ? { ...s, duration: e.currentTarget.value } : s,
                                    ),
                                  )
                                }
                              />
                              <TextInput
                                label='Pace'
                                value={set.pace || ''}
                                readOnly={readOnly}
                                onChange={(e) =>
                                  handleExerciseChange(
                                    exercise.id,
                                    'set_rep_detail',
                                    exercise.set_rep_detail.map((s, i) =>
                                      i === index ? { ...s, pace: e.currentTarget.value } : s,
                                    ),
                                  )
                                }
                              />
                            </>
                          ) : (
                            <>
                              <NumberInput
                                label='Reps'
                                value={set.reps !== undefined ? set.reps : 0}
                                readOnly={readOnly}
                                onChange={(val) =>
                                  handleExerciseChange(
                                    exercise.id,
                                    'set_rep_detail',
                                    exercise.set_rep_detail.map((s, i) =>
                                      i === index ? { ...s, reps: val } : s,
                                    ),
                                  )
                                }
                              />
                              <NumberInput
                                label='Weight (kg)'
                                value={set.weight !== undefined ? set.weight : 0}
                                readOnly={readOnly}
                                onChange={(val) =>
                                  handleExerciseChange(
                                    exercise.id,
                                    'set_rep_detail',
                                    exercise.set_rep_detail.map((s, i) =>
                                      i === index ? { ...s, weight: val } : s,
                                    ),
                                  )
                                }
                              />
                              <NumberInput
                                label='Rest (s)'
                                value={set.rest !== undefined ? set.rest : 0}
                                readOnly={readOnly}
                                onChange={(val) =>
                                  handleExerciseChange(
                                    exercise.id,
                                    'set_rep_detail',
                                    exercise.set_rep_detail.map((s, i) =>
                                      i === index ? { ...s, rest: val } : s,
                                    ),
                                  )
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
          ))}
        </Accordion>
      ) : (
        <Text size='sm' c='dimmed'>
          No exercises available
        </Text>
      )}

      {!readOnly && (
        <Button variant='outline' type='button' onClick={handleAddExercise}>
          + Add Exercise
        </Button>
      )}
    </>
  )
}
