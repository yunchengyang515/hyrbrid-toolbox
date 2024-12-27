import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { Exercise } from '@/types/exercise.types'
import ExerciseModal from './exercise.modal'

const mockOnSubmit = jest.fn()
const mockOnUpdate = jest.fn()
const mockOnClose = jest.fn()
const mockOnEditMode = jest.fn()

const exerciseData: Exercise = {
  id: '1',
  name: 'Test Exercise',
  description: 'Test Description',
  type: 'Strength',
  equipment: ['Dumbbell'],
  video_link: 'http://example.com',
  user_id: 'user1',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ExerciseModal', () => {
  test('renders correctly in create mode', () => {
    render(
      <ExerciseModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByLabelText(/Exercise Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Exercise Name/i)).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-modal-create-save-button')).toBeInTheDocument()
  })

  test('renders correctly in view mode', () => {
    render(
      <ExerciseModal
        opened
        onClose={mockOnClose}
        mode='view'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        exerciseData={exerciseData}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByLabelText(/Exercise Name/i)).toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-modal-close-button')).toBeInTheDocument()
    expect(screen.getByTestId('exercise-modal-edit-button')).toBeInTheDocument()
  })

  test('renders correctly in edit mode', () => {
    render(
      <ExerciseModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        exerciseData={exerciseData}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByTestId('exercise-name-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-video-link-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-modal-edit-save-button')).toBeInTheDocument()
  })

  test('calls onSubmit handler when form is submitted in create mode', async () => {
    render(
      <ExerciseModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.change(screen.getByTestId('exercise-name-input'), {
        target: { value: 'New Exercise' },
      })
    })

    const typeSelect = screen.getByTestId('exercise-type-select')
    await userEvent.click(typeSelect)
    await userEvent.click(screen.getByRole('option', { name: 'Cardio' }))
    await userEvent.click(screen.getByTestId('exercise-modal-create-save-button'))

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Exercise', type: 'Cardio' }),
    )
  })

  test('calls onUpdate handler when form is submitted in edit mode', async () => {
    render(
      <ExerciseModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        exerciseData={exerciseData}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.change(screen.getByTestId('exercise-name-input'), {
        target: { value: 'Updated Exercise' },
      })
    })

    await userEvent.click(screen.getByTestId('exercise-modal-edit-save-button'))

    expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Exercise' }))
  })
})
