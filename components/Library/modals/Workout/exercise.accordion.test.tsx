import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { WorkoutExercise } from '@/types/WorkoutExercise'
import { ExerciseApiService } from '../../../../services/api/exercise.api.service'
import { ExerciseAccordion } from './ExerciseAccordion'

// Mock ExerciseApiService
jest.mock('../../../../services/api/exercise.api.service')

const mockExercises = [
  { id: '1', name: 'Push Up', type: 'Strength' },
  { id: '2', name: 'Running', type: 'Cardio' },
  { id: '3', name: 'Squat', type: 'Strength' },
]

beforeEach(() => {
  ;(ExerciseApiService.prototype.getAllExercises as jest.Mock).mockResolvedValue(mockExercises)
})

afterEach(cleanup)

const renderComponent = (props?: Partial<typeof ExerciseAccordion>) => {
  const defaultProps = {
    workoutExercises: [],
    readOnly: false,
    onUpdateExercises: jest.fn(),
  }
  return render(<ExerciseAccordion {...defaultProps} {...props} />)
}

test('renders ExerciseAccordion component', async () => {
  renderComponent()
  expect(screen.getByText('No exercises available')).toBeInTheDocument()
})

test('adds a new exercise', async () => {
  renderComponent()
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-exercise-button'))
  })
  expect(screen.getByText('New Exercise')).toBeInTheDocument()
})

test('autocomplete data uses data from api service', async () => {
  renderComponent()
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-exercise-button'))
  })
  expect(screen.getByText('Push Up')).toBeInTheDocument()
  expect(screen.getByText('Running')).toBeInTheDocument()
  expect(screen.getByText('Squat')).toBeInTheDocument()
})

test('selects an exercise and updates the local workout exercise', async () => {
  renderComponent()
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-exercise-button'))
  })
  const autocomplete = screen.getByTestId('exercise-name-select-0')
  await userEvent.click(autocomplete)
  await userEvent.click(screen.getByRole('option', { name: 'Running' }))
  expect(screen.getByDisplayValue('Running')).toBeInTheDocument()
})

test('generates sets for a workout exercise', async () => {
  const workoutExercises: WorkoutExercise[] = [
    {
      id: '1',
      exercise_name: 'Push Up',
      set_rep_detail: [],
      exercise_type: 'Strength',
      workout_id: '',
      exercise_id: '1',
      user_id: '',
    },
  ]
  renderComponent({ workoutExercises })
  await act(async () => {
    fireEvent.change(screen.getByTestId('number-of-sets-input-1'), { target: { value: '3' } })
  })
  expect(screen.getByText('Set 1')).toBeInTheDocument()
  expect(screen.getByText('Set 2')).toBeInTheDocument()
  expect(screen.getByText('Set 3')).toBeInTheDocument()
})

test('removes a set from a workout exercise', async () => {
  const workoutExercises: WorkoutExercise[] = [
    {
      id: '1',
      exercise_name: 'Push Up',
      set_rep_detail: [{ id: 1, reps: 10, weight: 20, rest: 30 }],
      exercise_type: 'Strength',
      workout_id: '',
      exercise_id: '1',
      user_id: '',
    },
  ]
  renderComponent({ workoutExercises })
  await act(async () => {
    fireEvent.click(screen.getByTestId('remove-set-button-1-0'))
  })
  expect(screen.queryByText('Set 1')).not.toBeInTheDocument()
})
