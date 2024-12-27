import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { render, userEvent } from '@/test-utils'
import { Exercise } from '@/types/exercise.types'
import { ExerciseApiService } from '../../../services/api/exercise.api.service'
import ExercisesTab from './exercise.tab'

// Mock ExerciseApiService
jest.mock('../../../services/api/exercise.api.service')

const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push Up',
    description: 'A basic push up exercise',
    type: 'Strength',
    equipment: ['Bodyweight'],
    video_link: 'http://example.com/pushup',
    user_id: 'user1',
  },
]

beforeEach(() => {
  jest.clearAllMocks()
  ;(ExerciseApiService.prototype.getAllExercises as jest.Mock).mockResolvedValue(mockExercises)
  ;(ExerciseApiService.prototype.createExercise as jest.Mock).mockResolvedValue(mockExercises[0])
  ;(ExerciseApiService.prototype.updateExercise as jest.Mock).mockResolvedValue(mockExercises[0])
})

describe('ExercisesTab', () => {
  test('renders exercises correctly', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    expect(screen.getByText('Push Up')).toBeInTheDocument()
  })

  test('opens modal in create mode when Add Exercise button is clicked', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await userEvent.click(screen.getByTestId('add-exercise-button'))

    expect(screen.getByTestId('exercise-modal')).toBeInTheDocument()
  })

  test('opens modal in view mode when an exercise card is clicked', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('exercise-card-1'))
    })

    expect(screen.getByTestId('exercise-modal')).toBeInTheDocument()
  })

  test('open modal in view mode should show exercise details', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('exercise-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('exercise-modal')
      screen.getByTestId('exercise-name-input') // ensure the modal is fully loaded
    })
  })

  test('open modal in view mode should show exercise details in read only', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('exercise-card-1'))
    })

    await waitFor(() => {
      screen.getByTestId('exercise-modal')
      screen.getByTestId('exercise-name-input') // ensure the modal is fully loaded
    })

    expect(screen.getByTestId('exercise-name-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-description-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-video-link-input')).toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-type-select')).toHaveAttribute('readonly')
  })

  test('opens modal in edit mode when Edit button is clicked in view mode', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Push Up'))
    })

    await waitFor(() => {
      screen.getByTestId('exercise-modal')
      screen.getByTestId('exercise-name-input')
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('exercise-modal-edit-button'))
    })

    expect(screen.getByTestId('exercise-modal-edit-save-button')).toBeInTheDocument()
  })

  test('open modal in edit mode should show exercise details in editable', async () => {
    await act(async () => {
      render(<ExercisesTab />)
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Push Up'))
    })

    await waitFor(() => {
      screen.getByTestId('exercise-modal')
      screen.getByTestId('exercise-name-input')
    })

    await act(async () => {
      fireEvent.click(screen.getByTestId('exercise-modal-edit-button'))
    })

    expect(screen.getByTestId('exercise-name-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-description-input')).not.toHaveAttribute('readonly')
    expect(screen.getByTestId('exercise-video-link-input')).not.toHaveAttribute('readonly')
  })
})
