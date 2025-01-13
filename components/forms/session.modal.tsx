import { useEffect } from 'react'
import { Button, Group, Modal, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Session, SessionFormData } from '@/types/session.types'

type SessionModalMode = 'create' | 'view' | 'edit'
type SessionModalProps = {
  opened: boolean
  onClose: () => void
  mode: SessionModalMode
  onSubmit: (sessionData: SessionFormData) => void
  onUpdate: (updatedSession: Session) => void
  sessionData?: Session
  onEditMode: (session: Session) => void
}

export default function SessionModal({
  opened,
  onClose,
  mode,
  onSubmit,
  onUpdate,
  sessionData,
  onEditMode,
}: SessionModalProps) {
  if ((mode === 'view' || mode === 'edit') && !sessionData) {
    throw new Error(`sessionData is required for mode "${mode}"`)
  }

  const initialValues: SessionFormData =
    mode === 'create'
      ? {
          name: '',
          description: '',
          duration_minute: 0,
          intensity: 0,
          type: '',
          is_template: false,
        }
      : { ...sessionData! }

  const form = useForm({
    initialValues,
    validate: {
      name: (value) => (value.trim() !== '' ? null : 'Name is required'),
      type: (value) => (value?.trim() !== '' ? null : 'Type is required'),
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
    const updatedSession = { ...sessionData!, ...values, id: sessionData!.id }
    onUpdate(updatedSession)
    onClose()
  })

  function isReadOnly() {
    return mode === 'view'
  }

  function getFieldValue(field: keyof SessionFormData) {
    if (isReadOnly()) {
      return (sessionData as any)[field] ?? ''
    }
    return form.values[field]
  }

  function handleChange(field: keyof SessionFormData, val: any) {
    if (isReadOnly()) {
      return
    }
    form.setFieldValue(field, val)
  }

  function getError(field: keyof SessionFormData) {
    if (isReadOnly()) {
      return null
    }
    return form.errors[field] || null
  }

  function renderButtons() {
    if (mode === 'view') {
      return (
        <>
          <Button variant='outline' onClick={onClose} data-testid='session-modal-close-button'>
            Close
          </Button>
          <Button
            variant='filled'
            onClick={(event) => {
              onEditMode(sessionData as Session)
              event.preventDefault()
            }}
            data-testid='session-modal-edit-button'
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
          <Button variant='filled' type='submit' data-testid={`session-modal-${mode}-save-button`}>
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
      title='Session Details'
      closeOnClickOutside={isReadOnly()}
      closeOnEscape={isReadOnly()}
      keepMounted={false}
      withCloseButton={isReadOnly()}
      data-testid='session-modal'
    >
      <form onSubmit={mode === 'create' ? handleCreateSubmit : handleEditSubmit}>
        <TextInput
          withAsterisk={!isReadOnly()}
          label='Session Name'
          placeholder='Enter session name'
          readOnly={isReadOnly()}
          value={getFieldValue('name')}
          onChange={(e) => handleChange('name', e.currentTarget.value)}
          error={getError('name')}
          mb='sm'
          data-testid='session-name-input'
        />

        <Textarea
          label='Description'
          placeholder='Enter a brief description (optional)'
          readOnly={isReadOnly()}
          value={getFieldValue('description')}
          onChange={(e) => handleChange('description', e.currentTarget.value)}
          error={getError('description')}
          mb='sm'
          data-testid='session-description-input'
        />

        <NumberInput
          label='Duration (minutes)'
          placeholder='Enter duration in minutes'
          readOnly={isReadOnly()}
          value={getFieldValue('duration_minute')}
          onChange={(val) => handleChange('duration_minute', val)}
          error={getError('duration_minute')}
          mb='sm'
          data-testid='session-duration-input'
        />

        <NumberInput
          label='Intensity'
          placeholder='Enter intensity level'
          readOnly={isReadOnly()}
          value={getFieldValue('intensity')}
          onChange={(val) => handleChange('intensity', val)}
          error={getError('intensity')}
          mb='sm'
          data-testid='session-intensity-input'
        />

        <Select
          withAsterisk={!isReadOnly()}
          label='Type'
          placeholder='Select session type'
          data={['Yoga', 'HIIT', 'Strength', 'Cardio', 'Pilates']}
          readOnly={isReadOnly()}
          value={getFieldValue('type')}
          onChange={(val) => handleChange('type', val as string)}
          error={getError('type')}
          mb='sm'
          data-testid='session-type-select'
        />

        <Group justify='flex-end' mt='lg'>
          {renderButtons()}
        </Group>
      </form>
    </Modal>
  )
}
