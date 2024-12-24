import { IconTrash } from '@tabler/icons-react'
import { ActionIcon, Grid, NumberInput, TextInput } from '@mantine/core'
import { useValidatedState } from '@mantine/hooks'
import { DISTANCE_UNIT, PACE_UNIT, WEIGHT_UNIT } from '@/types/units'
import { SetDetail, WorkoutExercise } from '@/types/workoutExercise.types'

interface SetRepDetailProps {
  workoutExercise: WorkoutExercise
  set: SetDetail
  index: number
  readOnly: boolean
  handleExerciseChange: (id: string, changes: Partial<WorkoutExercise>) => void
}

const validatePace = (pace: string) => {
  const pacePattern = /^(\d{1,2}):([0-5]\d)$/
  return pacePattern.test(pace)
}

export function SetRepDetail({
  workoutExercise,
  set,
  index,
  readOnly,
  handleExerciseChange,
}: SetRepDetailProps) {
  const [{ value: pace, valid: isPaceValid }, setPace] = useValidatedState(
    set.pace || '',
    validatePace,
    true,
  )

  const handlePaceChange = (pace: string) => {
    setPace(pace)
    if (validatePace(pace)) {
      handleExerciseChange(workoutExercise.id, {
        set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
          i === index ? { ...s, pace } : s,
        ),
      })
    }
  }

  if (workoutExercise.exercise_type.toLowerCase() === 'cardio') {
    return (
      <Grid>
        <Grid.Col span={4}>
          <NumberInput
            label={`Distance (${DISTANCE_UNIT})`}
            value={set.distance || ''}
            readOnly={readOnly}
            onChange={(value) =>
              handleExerciseChange(workoutExercise.id, {
                set_rep_detail: workoutExercise.set_rep_detail.map((s, i) =>
                  i === index ? { ...s, distance: Number(value) } : s,
                ),
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label={`Pace (${PACE_UNIT})`}
            value={pace}
            readOnly={readOnly}
            onChange={(e) => handlePaceChange(e.currentTarget.value)}
            error={!isPaceValid && 'Invalid pace format. Please use mm:ss.'}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          {!readOnly && (
            <ActionIcon
              color='red'
              variant='outline'
              size='sm'
              onClick={() =>
                handleExerciseChange(workoutExercise.id, {
                  set_rep_detail: workoutExercise.set_rep_detail.filter((_, i) => i !== index),
                })
              }
              data-testid={`remove-set-button-${workoutExercise.id}-${index}`}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Grid.Col>
      </Grid>
    )
  }
  return (
    <Grid>
      <Grid.Col span={3}>
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
      <Grid.Col span={3}>
        <NumberInput
          label={`Weight (${WEIGHT_UNIT})`}
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
      <Grid.Col span={3}>
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
      <Grid.Col span={3}>
        {!readOnly && (
          <ActionIcon
            color='red'
            variant='outline'
            size='sm'
            onClick={() =>
              handleExerciseChange(workoutExercise.id, {
                set_rep_detail: workoutExercise.set_rep_detail.filter((_, i) => i !== index),
              })
            }
            data-testid={`remove-set-button-${workoutExercise.id}-${index}`}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Grid.Col>
    </Grid>
  )
}
