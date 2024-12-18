import { useState } from 'react'
import { from } from 'rxjs'
import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { WorkoutApiService } from '@/services/api/workout.api.service'
import { Workout, WorkoutFormData } from '@/types/Workout'

const workoutApiService = new WorkoutApiService()

interface WorkoutModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (exerciseData: WorkoutFormData) => void // for create mode
  onUpdate: (updatedWorkout: Workout) => void // for edit mode
  workoutData?: Workout // null means create mode, workout means view mode
}

export default function WorkoutModal({
  opened,
  onClose,
  onSubmit,
  onUpdate,
  workoutData,
}: WorkoutModalProps) {
  const isCreateMode = !workoutData
  const isViewMode = workoutData && !isCreateMode // If workoutData is defined, start in view mode
  const [editMode, setEditMode] = useState(false)

  // Determine initial form values:
  const initialValues: WorkoutFormData = isCreateMode
    ? {
        name: '',
        description: '',
        duration_minute: undefined,
        intensity: 5,
        type: '',
        exercises: [], // ignored for now
      }
    : {
        name: workoutData!.name,
        description: workoutData!.description || '',
        duration_minute: workoutData!.duration_minute,
        intensity: workoutData!.intensity || 5,
        type: workoutData!.type || '',
        exercises: [], // ignored for now
      }

  const form = useForm<WorkoutFormData>({
    initialValues,
    validate: {
      name: (value) => (value.trim() === '' ? 'Name is required' : null),
      type: (value) => (value?.trim() === '' ? 'Type is required' : null),
    },
  })

  const handleCreateSubmit = form.onSubmit((values) => {
    onSubmit(values) // create the workout
    onClose()
  })

  const handleEditSubmit = form.onSubmit((values) => {
    // call API to update
    from(workoutApiService.updateWorkout(workoutData!.id!, values)).subscribe({
      next: (updated: Workout) => {
        onUpdate(updated)
        setEditMode(false) // revert to view mode
      },
      error: (err) => console.error('Failed to update workout:', err),
    })
  })

  const disableFields = isViewMode && !editMode // In view mode and not editing -> fields disabled

  return (
    <Modal opened={opened} onClose={onClose} title='Workout Details' size='xl' centered>
      <form onSubmit={isCreateMode ? handleCreateSubmit : handleEditSubmit}>
        <Stack gap='md'>
          <TextInput
            label='Workout Name'
            placeholder='Enter workout name'
            required
            {...form.getInputProps('name')}
            disabled={disableFields}
          />
          <TextInput
            label='Description'
            placeholder='Enter workout description (optional)'
            {...form.getInputProps('description')}
            disabled={disableFields}
          />
          <NumberInput
            label='Duration (minutes)'
            placeholder='Enter duration in minutes'
            {...form.getInputProps('duration_minute')}
            disabled={disableFields}
          />
          <Select
            label='Workout Type'
            placeholder='Select workout type'
            data={['Strength', 'Cardio', 'Core']}
            {...form.getInputProps('type')}
            required
            disabled={disableFields}
          />
        </Stack>

        <Group mt='md' justify='flex-end'>
          {/* If in view mode and not editing, show Edit button */}
          {isViewMode && !editMode && (
            <>
              <Button variant='outline' onClick={onClose}>
                Close
              </Button>
              <Button variant='filled' onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </>
          )}

          {/* If editing, show Save/Cancel */}
          {isViewMode && editMode && (
            <>
              <Button variant='outline' onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button variant='filled' type='submit'>
                Save
              </Button>
            </>
          )}

          {/* If create mode, just show save */}
          {isCreateMode && (
            <>
              <Button variant='outline' onClick={onClose}>
                Cancel
              </Button>
              <Button variant='filled' type='submit'>
                Create
              </Button>
            </>
          )}
        </Group>
      </form>
    </Modal>
  )
}
