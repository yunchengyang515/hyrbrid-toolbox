import { Button, Group, Modal, MultiSelect, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Exercise } from '@/types/Exercise'

type ExerciseModalProps = {
  opened: boolean
  onClose: () => void
  onSubmit: (exerciseData: Exercise) => void
  exerciseData?: {
    name: string
    description?: string
    type: string
    equipment: string[]
    video_link?: string
  }
}

export default function ExerciseModal({
  opened,
  onClose,
  onSubmit,
  exerciseData,
}: ExerciseModalProps) {
  const form = useForm({
    initialValues: {
      name: exerciseData?.name || '',
      description: exerciseData?.description || '',
      type: exerciseData?.type || '',
      equipment: exerciseData?.equipment || [],
      video_link: exerciseData?.video_link || '',
    },
    validate: {
      name: (value) => (value.trim() !== '' ? null : 'Name is required'),
      type: (value) => (value.trim() !== '' ? null : 'Type is required'),
    },
  })

  const handleFormSubmit = (values: typeof form.values) => {
    // Mock API call

    // Call parent onSubmit to update state
    onSubmit(values)
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title='Create/Edit Exercise'>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput
          withAsterisk
          label='Exercise Name'
          placeholder='Enter exercise name'
          {...form.getInputProps('name')}
          mb='sm'
        />

        <Textarea
          label='Description'
          placeholder='Enter a brief description (optional)'
          {...form.getInputProps('description')}
          mb='sm'
        />

        <Select
          withAsterisk
          label='Type'
          placeholder='Select exercise type'
          data={['Strength', 'Cardio', 'Flexibility', 'Balance', 'Core']}
          {...form.getInputProps('type')}
          mb='sm'
        />

        <MultiSelect
          label='Equipment'
          placeholder='Select equipment used'
          data={['Dumbbell', 'Barbell', 'Kettlebell', 'Resistance Band', 'Bodyweight']}
          {...form.getInputProps('equipment')}
          mb='sm'
        />

        <TextInput
          label='Video Link'
          placeholder='Paste video URL (optional)'
          {...form.getInputProps('video_link')}
          mb='sm'
        />

        <Group justify='flex-end' mt='lg'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='filled' type='submit'>
            Save
          </Button>
        </Group>
      </form>
    </Modal>
  )
}
