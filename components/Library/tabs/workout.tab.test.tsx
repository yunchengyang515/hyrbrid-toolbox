import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { render, userEvent } from '@/test-utils'
import { WorkoutWithExercises } from '@/types/workout.types'
import { WorkoutApiService } from '../../../services/api/workout.api.service'
import WorkoutsTab from './workout.tab'

// Mock WorkoutApiService
jest.mock('../../../services/api/workout.api.service')

const mockWorkouts: WorkoutWithExercises[] = [
  {
    id: '1',
    name: 'Morning Routine',
    description: 'A basic morning workout routine',
    duration_minute: 30,
    intensity: 5,
    type: 'Strength',
    user_id: 'user1',
    exercises: [],
    created_at: new Date().toISOString(),
  },
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(WorkoutApiService.prototype.getAllWorkouts as jest.Mock).mockResolvedValue(mockWorkouts)
  ;(WorkoutApiService.prototype.createWorkout as jest.Mock).mockResolvedValue(mockWorkouts[0])
  ;(WorkoutApiService.prototype.updateWorkout as jest.Mock).mockResolvedValue(mockWorkouts[0])
})

describe('WorkoutsTab', () => {
  test('renders workouts correctly', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    expect(screen.getByText('Morning Routine')).toBeInTheDocument()
  })

  test('opens modal in create mode when Add Workout button is clicked', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await userEvent.click(screen.getByTestId('add-workout-button'))

    await waitFor(() => {
      screen.getByTestId('workout-modal')
    })

    expect(screen.getByTestId('workout-modal')).toBeInTheDocument()
  })

  test('opens modal in view mode when a workout card is clicked', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('workout-modal')
    })

    expect(screen.getByTestId('workout-modal')).toBeInTheDocument()
  })

  test('open modal in view mode should show workout details', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('workout-modal')
      screen.getByTestId('workout-name-input') // ensure the modal is fully loaded
    })
  })

  test('open modal in view mode should show workout details in read only', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('workout-modal')
      screen.getByTestId('workout-name-input') // ensure the modal is fully loaded
    })

    expect(screen.getByTestId('workout-name-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-description-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-duration-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-intensity-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-type-select')).toHaveAttribute('readonly')
  })

  test('opens modal in edit mode when Edit button is clicked in view mode', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('workout-modal')
      screen.getByTestId('workout-name-input')
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-modal-edit-button'))
    })

    expect(screen.getByTestId('edit-next-button')).toBeInTheDocument()
  })

  test('open modal in edit mode should show workout details in editable', async () => {
    await act(async () => {
      render(<WorkoutsTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('workout-modal')
      screen.getByTestId('workout-name-input')
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('workout-modal-edit-button'))
    })

    expect(screen.getByTestId('workout-name-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-description-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-duration-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('workout-intensity-input')).not.toHaveAttribute('readonly')
  })
})
