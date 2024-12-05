import { useState } from 'react'
import {
  Button,
  Flex,
  Group,
  Modal,
  NumberInput,
  Select,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import type { WorkoutFormData } from '@/types/Workout'

export default function WorkoutModal({
  opened,
  onClose,
}: {
  opened: boolean
  onClose: () => void
}) {
  // Default initial values for the form
  const initialFormData: WorkoutFormData = {
    name: '',
    description: '',
    duration_minute: undefined,
    intensity: 5,
    type: '',
  }

  const [activeStep, setActiveStep] = useState(0)
  const [workoutData, setWorkoutData] = useState<WorkoutFormData>(initialFormData)
  const handleChange = (field: keyof WorkoutFormData, value: any) => {
    setWorkoutData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const nextStep = () => setActiveStep((prev) => prev + 1)
  const prevStep = () => setActiveStep((prev) => prev - 1)

  return (
    <Modal opened={opened} onClose={onClose} title='Create/Edit Workout' centered>
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

          <Textarea
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
              setWorkoutData({ ...workoutData, duration_minute: (value as number) || undefined })
            }
          />

          <Flex direction='column' pb={20}>
            <Text size='sm' fw={500}>
              Intensity
            </Text>
            <Slider
              label={`Intensity: ${workoutData.intensity}`}
              min={1}
              max={10}
              step={1}
              value={workoutData.intensity}
              px={13} // Adds padding for a cleaner look
              onChange={(value) => handleChange('intensity', value)}
              marks={[
                { value: 1, label: 'Low' },
                { value: 5, label: 'Moderate' },
                { value: 10, label: 'High' },
              ]}
            />
          </Flex>

          <Select
            label='Workout Type'
            placeholder='Select workout type'
            data={['Strength', 'Cardio', 'Core']}
            value={workoutData.type}
            onChange={(value) => setWorkoutData({ ...workoutData, type: value || '' })}
          />
        </Stack>
      )}

      {/* Step 2 Placeholder */}
      {activeStep === 1 && (
        <Stack gap='md'>
          <p>Step 2 Placeholder: Add Exercises</p>
        </Stack>
      )}

      {/* Navigation Buttons */}
      <Group mt='md' grow>
        {activeStep > 0 && (
          <Button variant='default' onClick={prevStep}>
            Back
          </Button>
        )}
        {activeStep < 1 ? (
          <Button onClick={nextStep}>Next</Button>
        ) : (
          <Button color='blue' onClick={() => console.log('Submit:', workoutData)}>
            Submit
          </Button>
        )}
      </Group>
    </Modal>
  )
}
