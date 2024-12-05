import { useState } from 'react'
import { Button, Group, Modal, MultiSelect, Select, Textarea, TextInput } from '@mantine/core'
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
  const [name, setName] = useState(exerciseData?.name || '')
  const [description, setDescription] = useState(exerciseData?.description || '')
  const [type, setType] = useState(exerciseData?.type || '')
  const [equipment, setEquipment] = useState<string[]>(exerciseData?.equipment || [])
  const [videoLink, setVideoLink] = useState(exerciseData?.video_link || '')

  const handleSubmit = () => {
    if (!name || !type) {
      console.log('Please fill out all required fields.')
      return
    }

    onSubmit({ name, description, type, equipment, video_link: videoLink })
    onClose()
  }

  return (
    <Modal opened={opened} onClose={onClose} title='Create/Edit Exercise'>
      {/* Form Fields */}
      <TextInput
        label='Exercise Name'
        placeholder='Enter exercise name'
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        mb='sm'
      />
      <Textarea
        label='Description'
        placeholder='Enter a brief description (optional)'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        mb='sm'
      />
      <Select
        label='Type'
        placeholder='Select exercise type'
        data={['Strength', 'Cardio', 'Flexibility', 'Balance', 'Core']}
        value={type}
        onChange={(value) => setType(value || '')}
        required
        mb='sm'
      />
      <MultiSelect
        label='Equipment'
        placeholder='Select equipment used'
        data={['Dumbbell', 'Barbell', 'Kettlebell', 'Resistance Band', 'Bodyweight']}
        value={equipment}
        onChange={setEquipment}
        mb='sm'
      />
      <TextInput
        label='Video Link'
        placeholder='Paste video URL (optional)'
        value={videoLink}
        onChange={(event) => setVideoLink(event.target.value)}
        mb='sm'
      />

      {/* Submit Button */}
      <Group justify='flex-end' mt='lg'>
        <Button variant='outline' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='filled' onClick={handleSubmit}>
          Save
        </Button>
      </Group>
    </Modal>
  )
}
