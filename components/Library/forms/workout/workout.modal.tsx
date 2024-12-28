// WorkoutModal.tsx
import { useEffect, useState } from 'react'
import { Button, Group, Modal, NumberInput, Select, Stack, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { WorkoutFormData, WorkoutWithExercises } from '@/types/workout.types'
import { WorkoutExercise } from '@/types/workoutExercise.types'
import { ExerciseAccordion } from './exercise.accordion'

type WorkoutModalMode = 'create' | 'view' | 'edit'
interface WorkoutModalProps {
  opened: boolean
  onClose: () => void
  mode: WorkoutModalMode
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
          exercises: workoutData!.exercises || [],
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
    if (mode === 'create') {
      form.reset()
    }
    if (mode === 'view') {
      setActiveStep(0)
    }
    if (mode === 'edit') {
      form.setValues(initialValues)
    }
  }, [mode])

  useEffect(() => {
    if (!opened) {
      form.reset() // Clear form state
      setActiveStep(0) // Reset to the first step
    }
  }, [opened])

  const handleCreateSubmit = form.onSubmit((values) => {
    onSubmit(values)
    onClose()
  })

  const handleEditSubmit = form.onSubmit((values) => {
    const updatedWorkout = { ...workoutData!, ...values }
    onUpdate(updatedWorkout)
    onClose()
  })

  const isReadOnly = mode === 'view'
  const isEditMode = mode === 'edit'

  // Helper to get field value depending on mode
  function getFieldValue(field: keyof WorkoutFormData) {
    if (isReadOnly) {
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

  // Helper to get exercises data depending on mode
  function getExercisesData() {
    if (isReadOnly || isEditMode) {
      return workoutData?.exercises || []
    }
    return form.values.exercises
  }

  // Step one buttons
  function renderWorkoutBasicDataStepButtons() {
    if (mode === 'view') {
      return (
        <>
          <Button
            variant='outline'
            onClick={() => setActiveStep(1)}
            data-testid='view-exercises-button'
          >
            View Exercises
          </Button>
          <Button
            variant='filled'
            onClick={() => onEditMode(workoutData as WorkoutWithExercises)}
            data-testid='workout-modal-edit-button'
          >
            Edit
          </Button>
        </>
      )
    }

    if (mode === 'create' || mode === 'edit') {
      return (
        <>
          <Button variant='outline' onClick={onClose} data-testid={`${mode}-cancel-button`}>
            Cancel
          </Button>
          <Button
            variant='filled'
            onClick={() => setActiveStep(1)}
            data-testid={`${mode}-next-button`}
          >
            Next
          </Button>
        </>
      )
    }

    return null
  }

  // Step two buttons
  function renderExerciseDetailStepButtons() {
    if (mode === 'view') {
      return (
        <>
          <Button variant='outline' onClick={() => setActiveStep(0)} data-testid='back-button'>
            Back to Details
          </Button>
          <Button
            variant='filled'
            type='button'
            onClick={(event) => {
              onEditMode(workoutData as WorkoutWithExercises)
              event.preventDefault()
            }}
            data-testid='workout-modal-edit-button'
          >
            Edit
          </Button>
        </>
      )
    }

    if (mode === 'edit') {
      return (
        <>
          <Button variant='outline' onClick={() => setActiveStep(0)} data-testid='back-button'>
            Back to Details
          </Button>
          <Button variant='outline' onClick={onClose} data-testid='edit-cancel-button'>
            Cancel
          </Button>
          <Button
            variant='filled'
            type='submit'
            disabled={!form.isValid()}
            data-testid='edit-save-button'
          >
            Save
          </Button>
        </>
      )
    }

    if (mode === 'create') {
      return (
        <>
          <Button variant='outline' onClick={() => setActiveStep(0)} data-testid='back-button'>
            Back
          </Button>
          <Button variant='outline' onClick={onClose} data-testid='create-cancel-button'>
            Cancel
          </Button>
          <Button
            variant='filled'
            type='submit'
            disabled={!form.isValid()}
            data-testid='create-button'
          >
            Create
          </Button>
        </>
      )
    }

    return null
  }

  // Active step state (0: Details, 1: Exercises)
  const [activeStep, setActiveStep] = useState(0)

  // Handler for updating exercises
  function handleUpdateExercises(updatedExercises: WorkoutExercise[]) {
    form.setFieldValue('exercises', updatedExercises)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Workout Details'
      size='xl'
      centered
      closeOnClickOutside={isReadOnly}
      closeOnEscape={isReadOnly}
      fullScreen
      withCloseButton={isReadOnly}
      data-testid='workout-modal'
    >
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
              data-testid='workout-name-input'
            />
            <TextInput
              label='Description'
              placeholder='Enter workout description (optional)'
              readOnly={isReadOnly}
              value={getFieldValue('description') as string}
              onChange={(e) => handleChange('description', e.currentTarget.value)}
              error={getError('description')}
              data-testid='workout-description-input'
            />
            <NumberInput
              label='Duration (minutes)'
              placeholder='Enter duration in minutes'
              readOnly={isReadOnly}
              value={getFieldValue('duration_minute') as number | undefined}
              onChange={(val) => handleChange('duration_minute', val)}
              error={getError('duration_minute')}
              data-testid='workout-duration-input'
            />
            <NumberInput
              label='Intensity'
              placeholder='Enter intensity (1-10)'
              readOnly={isReadOnly}
              value={getFieldValue('intensity') as number | undefined}
              onChange={(val) => handleChange('intensity', val)}
              error={getError('intensity')}
              data-testid='workout-intensity-input'
            />
            <Select
              label='Workout Type'
              placeholder='Select workout type'
              data={[
                { label: 'Strength', value: 'strength' },
                { label: 'Cardio', value: 'cardio' },
                { label: 'Core', value: 'core' },
              ]}
              withAsterisk={!isReadOnly}
              readOnly={isReadOnly}
              value={getFieldValue('type') as string}
              onChange={(val) => handleChange('type', val as string)}
              error={getError('type')}
              data-testid='workout-type-select'
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
            <ExerciseAccordion
              workoutExercises={getExercisesData()}
              readOnly={isReadOnly}
              onUpdateExercises={handleUpdateExercises}
            />

            <Group mt='md' justify='flex-end'>
              {renderExerciseDetailStepButtons()}
            </Group>
          </Stack>
        )}
      </form>
    </Modal>
  )
}
