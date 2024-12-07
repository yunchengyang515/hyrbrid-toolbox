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
import { SetDetail } from '@/types/WorkoutExercise'

interface ExerciseAccordionProps {
  exercise: {
    id: string
    name: string
    sets: SetDetail[]
    type: string
  }
  mockExercises: Exercise[]
  onRemove: (id: string) => void
  onGenerateRows: (exerciseId: string, numberOfSets: number, exerciseType: string) => void
  onExerciseChange: (exerciseId: string, name: string, type: string) => void
  onSetDetailChange: (exerciseId: string, index: number, updatedFields: Partial<SetDetail>) => void
}

export default function ExerciseAccordion({
  exercise,
  mockExercises,
  onRemove,
  onGenerateRows,
  onExerciseChange,
  onSetDetailChange,
}: ExerciseAccordionProps) {
  const exerciseData = mockExercises.find((e) => e.id === exercise.name)

  const generateSetSummary = () => {
    if (!exercise.sets.length) {
      return 'No sets defined'
    }

    return exercise.sets
      .map((set) => {
        if (exercise.type === 'Running') {
          if (set.duration && set.pace) {
            return `${set.duration}@${set.pace}`
          }
        } else {
          const base = `${set.reps || '?'}x${set.weight || '?'}kg`
          return set.rest ? `${base} (Rest: ${set.rest}s)` : base
        }
        return null
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
            <Text size='sm' color='dimmed'>
              {generateSetSummary()}
            </Text>
          </div>
          <Button
            variant='subtle'
            color='red'
            size='xs'
            onClick={(e) => {
              e.stopPropagation()
              onRemove(exercise.id)
            }}
            style={{ alignSelf: 'center' }}
          >
            Remove
          </Button>
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
          onChange={(value) =>
            onExerciseChange(exercise.id, value as string, exerciseData?.type || exercise.type)
          }
        />

        <NumberInput
          label='Number of Sets'
          placeholder='Enter sets'
          value={exercise.sets.length}
          onChange={(value) => {
            if (value) {
              onGenerateRows(exercise.id, Number(value), exercise.type)
            }
          }}
          min={1}
          max={10}
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
                        onChange={(e) =>
                          onSetDetailChange(exercise.id, index, { duration: e.target.value })
                        }
                      />
                      <TextInput
                        label='Pace'
                        value={set.pace || ''}
                        onChange={(e) =>
                          onSetDetailChange(exercise.id, index, { pace: e.target.value })
                        }
                      />
                    </>
                  ) : (
                    <>
                      <TextInput
                        label='Reps'
                        value={set.reps || ''}
                        onChange={(e) =>
                          onSetDetailChange(exercise.id, index, { reps: e.target.value })
                        }
                      />
                      <TextInput
                        label='Weight'
                        value={set.weight || ''}
                        onChange={(e) =>
                          onSetDetailChange(exercise.id, index, { weight: e.target.value })
                        }
                      />
                      <TextInput
                        label='Rest'
                        value={set.rest || ''}
                        onChange={(e) =>
                          onSetDetailChange(exercise.id, index, { rest: e.target.value })
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
}
