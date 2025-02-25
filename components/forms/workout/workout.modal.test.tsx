import { act, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { WorkoutWithExercises } from '@/types/workout.types'
import { ExerciseApiService } from '../../../services/api/exercise.api.service'
import { WorkoutApiService } from '../../../services/api/workout.api.service'
import WorkoutModal from './workout.modal'

// Mock WorkoutApiService and ExerciseApiService
jest.mock('../../../services/api/workout.api.service')
jest.mock('../../../services/api/exercise.api.service')

const mockOnSubmit = jest.fn()
const mockOnUpdate = jest.fn()
const mockOnClose = jest.fn()
const mockOnEditMode = jest.fn()

const workoutData: WorkoutWithExercises = {
  id: '1',
  created_at: '2023-10-01T00:00:00Z',
  name: 'Test Workout',
  description: 'Test Description',
  duration_minute: 60,
  intensity: 7,
  type: 'Strength',
  user_id: 'user1',
  exercises: [],
}

const workoutDataWithExercises: WorkoutWithExercises = {
  ...workoutData,
  exercises: [
    {
      id: '1',
      exercise_name: 'Push Up',
      exercise_type: 'Strength',
      set_rep_detail: [{ id: 1, reps: 10, weight: 0, rest: 60, exercise_id: '1' }],
      workout_id: '1',
      exercise_id: '1',
      user_id: 'user1',
    },
  ],
}

const mockExercises = [
  { id: '1', name: 'Push Up', type: 'Strength' },
  { id: '2', name: 'Running Test', type: 'Cardio' },
  { id: '3', name: 'Squat', type: 'Strength' },
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(WorkoutApiService.prototype.createWorkout as jest.Mock).mockResolvedValue(workoutData)
  ;(WorkoutApiService.prototype.updateWorkout as jest.Mock).mockResolvedValue(workoutData)
  ;(ExerciseApiService.prototype.getAllExercises as jest.Mock).mockResolvedValue(mockExercises)
})

describe('WorkoutModal', () => {
  test('renders correctly in create mode', () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByLabelText(/Workout Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Workout Name/i)).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('create-next-button')).toBeInTheDocument()
  })

  test('renders correctly in view mode', () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='view'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutData}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByLabelText(/Workout Name/i)).toHaveAttribute('readonly')
    expect(screen.getByTestId('view-exercises-button')).toBeInTheDocument()
    expect(screen.getByTestId('workout-modal-edit-button')).toBeInTheDocument()
  })

  test('renders correctly in edit mode', () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutData}
        onEditMode={mockOnEditMode}
      />,
    )

    expect(screen.getByLabelText(/Workout Name/i)).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('edit-next-button')).toBeInTheDocument()
  })

  test('calls onSubmit handler when form is submitted in create mode', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.change(screen.getByTestId('workout-name-input'), {
        target: { value: 'New Workout' },
      })
    })

    const typeSelect = screen.getByTestId('workout-type-select')
    await userEvent.click(typeSelect)
    await userEvent.click(screen.getByRole('option', { name: 'Cardio' }))
    await userEvent.click(screen.getByTestId('create-next-button'))
    await userEvent.click(screen.getByTestId('create-button'))

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Workout', type: 'cardio' }),
    )
  })

  test('calls onUpdate handler when form is submitted in edit mode', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutData}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.change(screen.getByTestId('workout-name-input'), {
        target: { value: 'Updated Workout' },
      })
    })

    await userEvent.click(screen.getByTestId('edit-next-button'))
    await userEvent.click(screen.getByTestId('edit-save-button'))

    expect(mockOnUpdate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Workout' }))
  })

  test('calls onEditMode handler when Edit button is clicked in view mode', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='view'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutData}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-modal-edit-button'))
    })

    expect(mockOnEditMode).toHaveBeenCalledWith(workoutData)
  })

  test('renders exercises correctly in edit mode', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutDataWithExercises}
        onEditMode={mockOnEditMode}
      />,
    )

    await userEvent.click(screen.getByTestId('edit-next-button'))
    expect(screen.getByTestId('accordion-item-exercise-name-0')).toHaveTextContent('Push Up')
    expect(screen.getByText(/10x0kg \(Rest: 60s\)/i)).toBeInTheDocument()
  })

  test('selects an exercise and updates the local workout exercise', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    await act(async () => {
      fireEvent.click(screen.getByTestId('create-next-button'))
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('add-exercise-button'))
    })

    const select = screen.getByTestId('exercise-name-select-0')
    await userEvent.click(select)
    await userEvent.type(select, 'Running Test')

    expect(screen.getByRole('option', { name: 'Running Test' })).toBeVisible()
    expect(screen.queryByRole('option', { name: 'Push Up' })).toBeNull()
    expect(screen.queryByRole('option', { name: 'Squat' })).toBeNull()

    await userEvent.click(screen.getByRole('option', { name: 'Running Test' }))
    expect(screen.getByDisplayValue('Running Test')).toBeInTheDocument()
  })

  test('resets to step 1 and clears state when modal is reopened', async () => {
    const { rerender } = render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        onEditMode={mockOnEditMode}
      />,
    )

    // Go to step 2
    await act(async () => {
      fireEvent.click(screen.getByTestId('create-next-button'))
    })
    expect(screen.getByText('Exercises')).toBeInTheDocument()

    // Close the modal
    await act(async () => {
      fireEvent.click(screen.getByTestId('create-cancel-button'))
    })

    // Reopen the modal with different workout
    rerender(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='edit'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutDataWithExercises}
        onEditMode={mockOnEditMode}
      />,
    )

    // Verify it resets to step 1 and clears state
    expect(screen.getByLabelText(/Workout Name/i)).toBeInTheDocument()
    expect(screen.queryByText('Exercises')).not.toBeInTheDocument()
    expect(screen.getByTestId('workout-name-input')).toHaveValue(workoutDataWithExercises.name)
  })

  test('disables Save button when form is invalid', async () => {
    render(
      <WorkoutModal
        opened
        onClose={mockOnClose}
        mode='create'
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        workoutData={workoutData}
        onEditMode={mockOnEditMode}
      />,
    )

    // Make the form invalid by clearing the workout name
    await act(async () => {
      fireEvent.change(screen.getByTestId('workout-name-input'), {
        target: { value: '' },
      })
    })

    // Go to step 2
    await act(async () => {
      fireEvent.click(screen.getByTestId('create-next-button'))
    })

    // Ensure the Create button is disabled
    expect(screen.getByTestId('create-button')).toBeDisabled()
  })
})
