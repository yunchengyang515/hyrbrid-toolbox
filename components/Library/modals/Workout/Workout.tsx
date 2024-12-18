// WorkoutModal.tsx
import { useEffect, useState } from 'react'
import { Button, Group, Modal, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { WorkoutFormData, WorkoutWithExercises } from '@/types/Workout'

interface WorkoutModalProps {
  opened: boolean
  onClose: () => void
  mode: 'create' | 'view' | 'edit'
  onSubmit: (exerciseData: WorkoutFormData) => void // for create mode
  onUpdate: (updatedWorkout: WorkoutWithExercises) => void // for edit mode
  workoutData?: WorkoutWithExercises // required for view and edit modes
  onEditMode: (workout: WorkoutWithExercises) => void // Handler to switch to 'edit' mode
}

export default function WorkoutModal({
  opened,
  onClose,
  mode,
  onSubmit,
  onUpdate,
  onEditMode,
  workoutData,
}: WorkoutModalProps) {
  // Validate props based on mode
  if ((mode === 'view' || mode === 'edit') && !workoutData) {
    throw new Error(`workoutData is required for mode "${mode}"`)
  }

  // Determine initial form values:
  const initialValues: WorkoutFormData =
    mode === 'create'
      ? {
          name: '',
          description: '',
          duration_minute: undefined,
          intensity: 5,
          type: '',
          exercises: [],
        }
      : {
          name: workoutData!.name,
          description: workoutData!.description || '',
          duration_minute: workoutData!.duration_minute,
          intensity: workoutData!.intensity || 5,
          type: workoutData!.type || '',
          exercises: workoutData!.exercises
            ? workoutData!.exercises.map((ex) => ({
                id: ex.id,
                name: ex.name,
                type: ex.type,
                sets: ex.sets || [],
              }))
            : [],
        }

  const form = useForm<WorkoutFormData>({
    initialValues,
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      type: (value) => (value?.trim() === '' ? 'Type is required' : null),
    },
  })

  // Reset form when mode or workoutData changes
  useEffect(() => {
    form.reset()
    // If switching to view mode, reset any active steps or edit modes
    if (mode === 'view') {
      setActiveStep(0)
    }
  }, [mode, workoutData])

  const handleCreateSubmit = form.onSubmit((values) => {
    onSubmit(values)
    onClose()
  })

  const handleEditSubmit = form.onSubmit((values) => {
    onUpdate({ ...workoutData!, ...values })
    onClose()
  })

  const isReadOnly = mode === 'view'
  const isEditMode = mode === 'edit'

  // Helper to get field value depending on mode
  function getFieldValue(field: keyof WorkoutFormData) {
    if (isReadOnly || isEditMode) {
      // View mode (read-only), use workoutData directly
      return (workoutData as any)[field] ?? (typeof initialValues[field] === 'number' ? 0 : '')
    }
    return form.values[field]
  }

  // Helper to handle changes in edit/create mode
  function handleChange(field: keyof WorkoutFormData, val: string | number | undefined) {
    if (isReadOnly) {
      return
    }
    form.setFieldValue(field, val)
  }

  // Determine if we show errors or not
  function getError(field: keyof WorkoutFormData) {
    if (isReadOnly) {
      return null
    }
    return form.errors[field] || null
  }

  // Step one buttons
  function renderWorkoutBasicDataStepButtons() {
    if (mode === 'view') {
      return (
        <>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button variant='outline' onClick={() => setActiveStep(1)}>
            View Exercises
          </Button>
          <Button variant='filled' onClick={() => onEditMode(workoutData as WorkoutWithExercises)}>
            Edit
          </Button>
        </>
      )
    }

    if (mode === 'create' || mode === 'edit') {
      return (
        <>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='filled' onClick={() => setActiveStep(1)}>
            Next
          </Button>
        </>
      )
    }

    return null
  }

  // Step two buttons
  function renderExerciseDetailStepButtons() {
    if (mode === 'view' || mode === 'edit') {
      return (
        <>
          <Button variant='outline' onClick={() => setActiveStep(0)}>
            Back to Details
          </Button>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button variant='filled' onClick={() => onEditMode(workoutData as WorkoutWithExercises)}>
            Edit
          </Button>
        </>
      )
    }

    if (mode === 'create') {
      return (
        <>
          <Button variant='outline' onClick={() => setActiveStep(0)}>
            Back
          </Button>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='filled' type='submit'>
            Create
          </Button>
        </>
      )
    }

    return null
  }

  // Active step state (0: Details, 1: Exercises)
  const [activeStep, setActiveStep] = useState(0)

  return (
    <Modal opened={opened} onClose={onClose} title='Workout Details' size='xl' centered>
      <form onSubmit={mode === 'create' ? handleCreateSubmit : handleEditSubmit}>
        {activeStep === 0 && (
          <Stack gap='md'>
            <TextInput
              label='Workout Name'
              placeholder='Enter workout name'
              withAsterisk={!isReadOnly}
              readOnly={isReadOnly}
              value={getFieldValue('name') as string}
              onChange={(e) => handleChange('name', e.currentTarget.value)}
              error={getError('name')}
            />
            <TextInput
              label='Description'
              placeholder='Enter workout description (optional)'
              readOnly={isReadOnly}
              value={getFieldValue('description') as string}
              onChange={(e) => handleChange('description', e.currentTarget.value)}
              error={getError('description')}
            />
            <NumberInput
              label='Duration (minutes)'
              placeholder='Enter duration in minutes'
              readOnly={isReadOnly}
              value={getFieldValue('duration_minute') as number | undefined}
              onChange={(val) => handleChange('duration_minute', val)}
              error={getError('duration_minute')}
            />
            <NumberInput
              label='Intensity'
              placeholder='Enter intensity (1-10)'
              readOnly={isReadOnly}
              value={getFieldValue('intensity') as number | undefined}
              onChange={(val) => handleChange('intensity', val)}
              error={getError('intensity')}
            />
            <Select
              label='Workout Type'
              placeholder='Select workout type'
              data={['Strength', 'Cardio', 'Core']}
              withAsterisk={!isReadOnly}
              readOnly={isReadOnly}
              value={getFieldValue('type') as string}
              onChange={(val) => handleChange('type', val as string)}
              error={getError('type')}
            />

            <Group mt='md' justify='flex-end'>
              {renderWorkoutBasicDataStepButtons()}
            </Group>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack gap='md'>
            <Text fw={700} size='lg'>
              Exercises
            </Text>
            {workoutData && workoutData.exercises && workoutData.exercises.length > 0 ? (
              workoutData.exercises.map((ex, index) => (
                <Stack
                  key={index}
                  gap='xs'
                  p='xs'
                  style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                >
                  <TextInput label='Exercise Name' value={ex.name} disabled />
                  <TextInput label='Exercise Type' value={ex.type} disabled />
                </Stack>
              ))
            ) : (
              <Text size='sm' color='dimmed'>
                No exercises available
              </Text>
            )}

            <Group mt='md' justify='flex-end'>
              {renderExerciseDetailStepButtons()}
            </Group>
          </Stack>
        )}
      </form>
    </Modal>
  )
}
