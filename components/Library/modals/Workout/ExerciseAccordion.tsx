// components/ExerciseAccordion.tsx

import {
  Accordion,
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
  exercise: WorkoutExercise
  readOnly?: boolean // Added readOnly prop
}

export default function ExerciseAccordion({
  exercise,
  readOnly = false, // Default to false
}: ExerciseAccordionProps) {
  // Accessing exercise name and type directly
  const exerciseName = exercise.exercise_name
  const exerciseType = exercise.exercise_type

  // Function to generate a summary of sets
  const generateSetSummary = () => {
    if (!exercise.set_rep_detail.length) {
      return 'No sets defined'
    }

    return exercise.set_rep_detail
      .map((set) => {
        if (exerciseType === 'Running') {
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

  return (
    <Accordion>
      <Accordion.Item value={exercise.id}>
        <Accordion.Control>
          <Group justify='space-between' align='center'>
            <div>
              <Text>{exerciseName || 'New Exercise'}</Text>
              <Text size='sm' c='dimmed'>
                {generateSetSummary()}
              </Text>
            </div>
            {!readOnly && (
              <Button
                variant='subtle'
                color='red'
                size='xs'
                onClick={(e) => {
                  e.stopPropagation()
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
          <TextInput label='Exercise Name' value={exerciseName} readOnly={readOnly} />

          {/* Exercise Type */}
          <TextInput label='Exercise Type' value={exerciseType} readOnly={readOnly} />

          {/* Number of Sets */}
          <NumberInput
            label='Number of Sets'
            placeholder='Enter sets'
            value={exercise.set_rep_detail.length}
            min={1}
            max={10}
            readOnly={readOnly}
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
                    {exerciseType === 'Running' ? (
                      <>
                        <TextInput
                          label='Duration'
                          value={set.duration || ''}
                          readOnly={readOnly}
                        />
                        <TextInput label='Pace' value={set.pace || ''} readOnly={readOnly} />
                      </>
                    ) : (
                      <>
                        <NumberInput
                          label='Reps'
                          value={set.reps !== undefined ? set.reps : 0}
                          readOnly={readOnly}
                        />
                        <NumberInput
                          label='Weight (kg)'
                          value={set.weight !== undefined ? set.weight : 0}
                          readOnly={readOnly}
                        />
                        <NumberInput
                          label='Rest (s)'
                          value={set.rest !== undefined ? set.rest : 0}
                          readOnly={readOnly}
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
    </Accordion>
  )
}
