import { useEffect, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  ComboboxItem,
  Divider,
  Fieldset,
  Grid,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core'
import { ExerciseApiService } from '@/services/api/exercise.api.service'
import { Exercise } from '@/types/Exercise'
import { SetDetail, WorkoutExercise } from '@/types/WorkoutExercise'

interface ExerciseAccordionProps {
  workoutExercises: WorkoutExercise[]
  readOnly?: boolean
  onUpdateExercises: (updatedExercises: WorkoutExercise[]) => void
}

export function ExerciseAccordion({
  workoutExercises,
  readOnly = false,
  onUpdateExercises,
}: ExerciseAccordionProps) {
  const [localExercises, setLocalExercises] = useState(workoutExercises)
  const [allExercises, setAllExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const fetchExercises = async () => {
      const apiService = new ExerciseApiService()
      const exercises = await apiService.getAllExercises()
      setAllExercises(exercises)
    }
    fetchExercises()
  }, [])

  // Function to generate a summary of sets
  const generateSetSummary = (workoutExercise: WorkoutExercise) => {
    if (!workoutExercise.set_rep_detail.length) {
      return 'No sets defined'
    }

    return workoutExercise.set_rep_detail
      .map((set) => {
        if (workoutExercise.exercise_type === 'Cardio') {
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

  // Handler for removing workout exercise
  const handleRemoveExercise = (id: string) => {
    const updatedExercises = localExercises.filter((ex) => ex.id !== id)
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  // Handler for changing workout exercise details
  const handleExerciseChange = (id: string, changes: Partial<WorkoutExercise>) => {
    const updatedExercises = localExercises.map((ex) => (ex.id === id ? { ...ex, ...changes } : ex))
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  // Handler for adding a new workout exercise
  const handleAddExercise = () => {
    const newExercise: Partial<WorkoutExercise> = {
      id: String(Date.now()),
      exercise_name: 'New Exercise',
      set_rep_detail: [],
      exercise_type: '',
      workout_id: '',
      exercise_id: '',
      user_id: '',
    }
    const updatedExercises = [...localExercises, newExercise as WorkoutExercise]
    setLocalExercises(updatedExercises)
    onUpdateExercises(updatedExercises)
  }

  const handleExerciseSelect = (workoutExerciseId: string, option: ComboboxItem) => {
    const selectedExercise = allExercises.find((ex) => ex.id === option.value)
    if (selectedExercise) {
      handleExerciseChange(workoutExerciseId, {
        exercise_id: selectedExercise.id,
        exercise_name: selectedExercise.name,
        exercise_type: selectedExercise.type,
      })
    }
  }

  const renderSetDetails = (workoutExercise: WorkoutExercise, set: SetDetail, index: number) => {
    if (workoutExercise.exercise_type.toLowerCase() === 'cardio') {
      return (
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label='Duration'
              value={set.duration || ''}
              readOnly={readOnly}
              onChange={(e) =>
                handleExerciseChange(workoutExercise.id, {
                  set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
                    i === index ? { ...s, duration: e.currentTarget.value } : s,
                  ),
                })
              }
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label='Pace'
              value={set.pace || ''}
              readOnly={readOnly}
              onChange={(e) =>
                handleExerciseChange(workoutExercise.id, {
                  set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
                    i === index ? { ...s, pace: e.currentTarget.value } : s,
                  ),
                })
              }
            />
          </Grid.Col>
        </Grid>
      )
    }
    return (
      <Grid>
        <Grid.Col span={4}>
          <NumberInput
            label='Reps'
            value={set.reps !== undefined ? set.reps : 0}
            readOnly={readOnly}
            onChange={(val) =>
              handleExerciseChange(workoutExercise.id, {
                set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
                  i === index ? { ...s, reps: Number(val) } : s,
                ),
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label='Weight (kg)'
            value={set.weight !== undefined ? set.weight : 0}
            readOnly={readOnly}
            onChange={(val) =>
              handleExerciseChange(workoutExercise.id, {
                set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
                  i === index ? { ...s, weight: Number(val) } : s,
                ),
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            label='Rest (seconds)'
            value={set.rest !== undefined ? set.rest : 0}
            readOnly={readOnly}
            onChange={(value) =>
              handleExerciseChange(workoutExercise.id, {
                set_rep_detail: workoutExercise.set_rep_detail.map((setDetail, setIndex) =>
                  setIndex === index ? { ...setDetail, rest: Number(value) } : setDetail,
                ),
              })
            }
          />
        </Grid.Col>
      </Grid>
    )
  }

  const renderRemoveButton = (workoutExercise: WorkoutExercise) => {
    if (!readOnly) {
      return (
        <Button
          variant='subtle'
          color='red'
          size='xs'
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveExercise(workoutExercise.id)
          }}
          style={{ alignSelf: 'center' }}
        >
          Remove
        </Button>
      )
    }
    return null
  }

  return (
    <>
      {localExercises.length > 0 ? (
        <Accordion>
          {localExercises.map((localWorkoutExercise, index) => (
            <Accordion.Item key={localWorkoutExercise.id} value={localWorkoutExercise.id}>
              <Accordion.Control>
                <Group justify='space-between' align='center'>
                  <div>
                    <Text data-testid={`accordion-item-exercise-name-${index}`}>
                      {localWorkoutExercise.exercise_name || 'New Exercise'}
                    </Text>
                    <Text size='sm' c='dimmed'>
                      {generateSetSummary(localWorkoutExercise)}
                    </Text>
                  </div>
                  {renderRemoveButton(localWorkoutExercise)}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {/* Exercise Name */}
                <Select
                  label='Exercise Name'
                  placeholder='Pick an exercise'
                  data={allExercises.map((ex) => ({ value: ex.id, label: ex.name }))}
                  value={localWorkoutExercise.exercise_id}
                  readOnly={readOnly}
                  searchable
                  onChange={(_value, option) => {
                    handleExerciseSelect(localWorkoutExercise.id, option)
                  }}
                  data-testid={`exercise-name-select-${index}`}
                />

                {/* Number of Sets */}
                <NumberInput
                  label='Number of Sets'
                  placeholder='Enter sets'
                  value={localWorkoutExercise.set_rep_detail.length}
                  min={1}
                  max={10}
                  readOnly={readOnly}
                  onChange={(val) =>
                    handleExerciseChange(localWorkoutExercise.id, {
                      set_rep_detail: Array.from({ length: Number(val) }, (_, index) => ({
                        id: index + 1,
                      })),
                    })
                  }
                  data-testid={`number-of-sets-input-${localWorkoutExercise.id}`}
                />

                {/* Set Details */}
                {localWorkoutExercise.set_rep_detail.length > 0 && (
                  <>
                    <Divider my='sm' label='Set Details' labelPosition='center' />
                    {localWorkoutExercise.set_rep_detail.map((set: SetDetail, index: number) => (
                      <Box key={set.id} mb='1rem'>
                        <Grid align='center'>
                          <Grid.Col span={11}>
                            <Fieldset
                              style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '1rem',
                              }}
                            >
                              <Grid align='center'>
                                <Grid.Col span={1}>
                                  <Text fw={500} size='sm'>
                                    Set {index + 1}
                                  </Text>
                                </Grid.Col>
                                <Grid.Col span={11}>
                                  {renderSetDetails(localWorkoutExercise, set, index)}
                                </Grid.Col>
                              </Grid>
                            </Fieldset>
                          </Grid.Col>
                          <Grid.Col span={1}>
                            {!readOnly && (
                              <ActionIcon
                                color='red'
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  handleExerciseChange(localWorkoutExercise.id, {
                                    set_rep_detail: localWorkoutExercise.set_rep_detail.filter(
                                      (_, i) => i !== index,
                                    ),
                                  })
                                }
                                data-testid={`remove-set-button-${localWorkoutExercise.id}-${index}`}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            )}
                          </Grid.Col>
                        </Grid>
                      </Box>
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
        <Button
          variant='outline'
          type='button'
          onClick={handleAddExercise}
          data-testid='add-exercise-button'
        >
          + Add Exercise
        </Button>
      )}
    </>
  )
}
