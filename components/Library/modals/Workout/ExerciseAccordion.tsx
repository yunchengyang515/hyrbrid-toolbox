// components/ExerciseAccordion.tsx

import {
  Accordion,
  Button,
  Divider,
  Fieldset,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
} from '@mantine/core'
import { Exercise } from '@/types/Exercise'
import { WorkoutExercise } from '@/types/WorkoutExercise'

interface ExerciseAccordionProps {
  exercise: WorkoutExercise
  mockExercises: Exercise[]
  readOnly?: boolean // Added readOnly prop
}

export default function ExerciseAccordion({
  exercise,
  mockExercises,
  readOnly = false, // Default to false
}: ExerciseAccordionProps) {
  console.log('ExerciseAccordion', { exercise, mockExercises, readOnly })
  const exerciseData = mockExercises.find((e) => e.id === exercise.name)

  const generateSetSummary = () => {
    if (!exercise.set_rep_detail.length) {
      return 'No sets defined'
    }

    return exercise.set_rep_detail
      .map((set) => {
        if (exercise.type === 'Running') {
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
    <Accordion.Item value={exercise.id}>
      <Accordion.Control>
        <Group justify='space-between' align='center'>
          <div>
            <Text>{exerciseData?.name || 'New Exercise'}</Text>
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
        <Select
          label='Exercise'
          placeholder='Choose exercise'
          data={mockExercises.map((e) => ({
            value: e.id as string,
            label: e.name,
          }))}
          value={exercise.name}
          disabled={readOnly} // Set to disabled if readOnly
        />

        <NumberInput
          label='Number of Sets'
          placeholder='Enter sets'
          value={exercise.sets.length}
          min={1}
          max={10}
          disabled={readOnly} // Set to disabled if readOnly
        />

        {exercise.sets.length > 0 && (
          <>
            <Divider my='sm' label='Set Details' labelPosition='center' />
            {exercise.sets.map((set, index) => (
              <Fieldset
                key={index}
                style={{
                  marginBottom: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                }}
              >
                <Group justify='flex-start' grow align='center'>
                  <Text fw={500} size='sm'>
                    Set {index + 1}
                  </Text>
                  {exercise.type === 'Running' ? (
                    <>
                      <TextInput
                        label='Duration'
                        value={set.duration || ''}
                        readOnly={readOnly} // Set to readOnly if readOnly
                      />
                      <TextInput
                        label='Pace'
                        value={set.pace || ''}
                        readOnly={readOnly} // Set to readOnly if readOnly
                      />
                    </>
                  ) : (
                    <>
                      <TextInput
                        label='Reps'
                        value={set.reps || ''}
                        readOnly={readOnly} // Set to readOnly if readOnly
                      />
                      <TextInput
                        label='Weight'
                        value={set.weight || ''}
                        readOnly={readOnly} // Set to readOnly if readOnly
                      />
                      <TextInput
                        label='Rest'
                        value={set.rest || ''}
                        readOnly={readOnly} // Set to readOnly if readOnly
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
}
