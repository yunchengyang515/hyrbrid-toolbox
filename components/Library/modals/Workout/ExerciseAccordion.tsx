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
  onInputChange: (
    exerciseId: string,
    index: number,
    field: keyof SetDetail,
    value: SetDetail[keyof SetDetail],
  ) => void
  onExerciseChange: (exerciseId: string, name: string, type: string) => void
}

export default function ExerciseAccordion({
  exercise,
  mockExercises,
  onRemove,
  onGenerateRows,
  onInputChange,
  onExerciseChange,
}: ExerciseAccordionProps) {
  const exerciseData = mockExercises.find((e) => e.id === exercise.name)

  return (
    <Accordion.Item value={exercise.id}>
      <Accordion.Control>
        <Group justify='space-between' align='center'>
          <Text>{exerciseData?.name || 'New Exercise'}</Text>
          <Button variant='subtle' color='red' onClick={() => onRemove(exercise.id)}>
            Remove
          </Button>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        {/* Select Exercise */}
        <Select
          label='Exercise'
          placeholder='Choose exercise'
          data={mockExercises.map((e) => ({
            value: e.id as string,
            label: e.name,
          }))}
          value={exercise.name}
          onChange={(value) =>
            onExerciseChange(exercise.id, value as string, exerciseData?.type || '')
          }
        />

        {/* Number of Sets */}
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

        {/* Set Details */}
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
                        value={set.duration}
                        onChange={(e) =>
                          onInputChange(exercise.id, index, 'duration', e.target.value)
                        }
                      />
                      <TextInput
                        label='Pace'
                        value={set.pace}
                        onChange={(e) => onInputChange(exercise.id, index, 'pace', e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <TextInput
                        label='Reps'
                        value={set.reps}
                        onChange={(e) => onInputChange(exercise.id, index, 'reps', e.target.value)}
                      />
                      <TextInput
                        label='Weight'
                        value={set.weight}
                        onChange={(e) =>
                          onInputChange(exercise.id, index, 'weight', e.target.value)
                        }
                      />
                      <TextInput
                        label='Rest'
                        value={set.rest}
                        onChange={(e) => onInputChange(exercise.id, index, 'rest', e.target.value)}
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
