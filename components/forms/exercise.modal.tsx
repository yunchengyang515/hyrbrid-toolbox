import { useEffect } from 'react'
import { Button, Group, Modal, MultiSelect, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Exercise, ExerciseFormData } from '@/types/exercise.types'

type ExerciseModalMode = 'create' | 'view' | 'edit'
type ExerciseModalProps = {
  opened: boolean
  onClose: () => void
  mode: ExerciseModalMode
  onSubmit: (exerciseData: ExerciseFormData) => void
  onUpdate: (updatedExercise: Exercise) => void
  exerciseData?: Exercise
  onEditMode: (exercise: ExerciseFormData) => void
}

export default function ExerciseModal({
  opened,
  onClose,
  mode,
  onSubmit,
  onUpdate,
  exerciseData,
  onEditMode,
}: ExerciseModalProps) {
  if ((mode === 'view' || mode === 'edit') && !exerciseData) {
    throw new Error(`exerciseData is required for mode "${mode}"`)
  }

  const initialValues: ExerciseFormData =
    mode === 'create'
      ? { name: '', description: '', type: '', equipment: [], video_link: '' }
      : { ...exerciseData! }

  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.trim() !== '' ? null : 'Name is required'),
      type: (value) => (value.trim() !== '' ? null : 'Type is required'),
    },
  })

  useEffect(() => {
    if (mode === 'create') {
      form.reset()
    }
    if (mode === 'edit') {
      form.setValues(initialValues)
    }
  }, [mode])

  useEffect(() => {
    if (!opened) {
      form.reset() // Clear form state
    }
  }, [opened])

  const handleCreateSubmit = form.onSubmit((values) => {
    onSubmit(values)
    onClose()
  })

  const handleEditSubmit = form.onSubmit((values) => {
    const updatedExercise = { ...exerciseData!, ...values, id: exerciseData!.id }
    onUpdate(updatedExercise)
    onClose()
  })

  function isReadOnly() {
    return mode === 'view'
  }

  function getFieldValue(field: keyof ExerciseFormData) {
    if (isReadOnly()) {
      return (exerciseData as any)[field] ?? ''
    }
    return form.values[field]
  }

  function handleChange(field: keyof ExerciseFormData, val: string | string[]) {
    if (isReadOnly()) {
      return
    }
    form.setFieldValue(field, val)
  }

  function getError(field: keyof ExerciseFormData) {
    if (isReadOnly()) {
      return null
    }
    return form.errors[field] || null
  }

  function renderButtons() {
    if (mode === 'view') {
      return (
        <>
          <Button variant='outline' onClick={onClose} data-testid='exercise-modal-close-button'>
            Close
          </Button>
          <Button
            variant='filled'
            onClick={(event) => {
              onEditMode(exerciseData as ExerciseFormData)
              event.preventDefault()
            }}
            data-testid='exercise-modal-edit-button'
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
          <Button variant='filled' type='submit' data-testid={`exercise-modal-${mode}-save-button`}>
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </>
      )
    }

    return null
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Exercise Details'
      closeOnClickOutside={isReadOnly()}
      closeOnEscape={isReadOnly()}
      keepMounted={false}
      withCloseButton={isReadOnly()}
      data-testid='exercise-modal'
    >
      <form onSubmit={mode === 'create' ? handleCreateSubmit : handleEditSubmit}>
        <TextInput
          withAsterisk={!isReadOnly()}
          label='Exercise Name'
          placeholder='Enter exercise name'
          readOnly={isReadOnly()}
          value={getFieldValue('name')}
          onChange={(e) => handleChange('name', e.currentTarget.value)}
          error={getError('name')}
          mb='sm'
          data-testid='exercise-name-input'
        />

        <Textarea
          label='Description'
          placeholder='Enter a brief description (optional)'
          readOnly={isReadOnly()}
          value={getFieldValue('description')}
          onChange={(e) => handleChange('description', e.currentTarget.value)}
          error={getError('description')}
          mb='sm'
          data-testid='exercise-description-input'
        />

        <Select
          withAsterisk={!isReadOnly()}
          label='Type'
          placeholder='Select exercise type'
          data={['Strength', 'Cardio', 'Flexibility', 'Balance', 'Core']}
          readOnly={isReadOnly()}
          value={getFieldValue('type')}
          onChange={(val) => handleChange('type', val as string)}
          error={getError('type')}
          mb='sm'
          data-testid='exercise-type-select'
        />

        <MultiSelect
          label='Equipment'
          placeholder='Select equipment used'
          data={['Dumbbell', 'Barbell', 'Kettlebell', 'Resistance Band', 'Bodyweight']}
          readOnly={isReadOnly()}
          value={getFieldValue('equipment')}
          onChange={(val) => handleChange('equipment', val)}
          error={getError('equipment')}
          mb='sm'
          data-testid='exercise-equipment-select'
        />

        <TextInput
          label='Video Link'
          placeholder='Paste video URL (optional)'
          readOnly={isReadOnly()}
          value={getFieldValue('video_link')}
          onChange={(e) => handleChange('video_link', e.currentTarget.value)}
          error={getError('video_link')}
          mb='sm'
          data-testid='exercise-video-link-input'
        />

        <Group justify='flex-end' mt='lg'>
          {renderButtons()}
        </Group>
      </form>
    </Modal>
  )
}
