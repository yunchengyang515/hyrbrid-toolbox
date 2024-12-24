import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/test-utils'
import { WorkoutExercise } from '@/types/workoutExercise.types'
import { ExerciseApiService } from '../../../../services/api/exercise.api.service'
import { ExerciseAccordion } from './exercise.accordion'

// Mock ExerciseApiService
jest.mock('../../../../services/api/exercise.api.service')

const mockExercises = [
  { id: '1', name: 'Push Up', type: 'Strength' },
  { id: '2', name: 'Running Test', type: 'Cardio' },
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
  expect(screen.getByText('Running Test')).toBeInTheDocument()
  expect(screen.getByText('Squat')).toBeInTheDocument()
})

test('selects an exercise and updates the local workout exercise', async () => {
  renderComponent()
  await act(async () => {
    fireEvent.click(screen.getByTestId('add-exercise-button'))
  })
  const select = screen.getByTestId('exercise-name-select-0')
  await userEvent.click(select)
  await userEvent.click(screen.getByRole('option', { name: 'Running Test' }))
  expect(screen.getByDisplayValue('Running Test')).toBeInTheDocument()
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

test('renders in read-only mode', async () => {
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
  renderComponent({ workoutExercises, readOnly: true })
  expect(screen.getByTestId('exercise-name-select-0')).toHaveAttribute('readonly')
  expect(screen.getByDisplayValue('10')).toHaveAttribute('readonly')
  expect(screen.getByDisplayValue('20')).toHaveAttribute('readonly')
  expect(screen.getByDisplayValue('30')).toHaveAttribute('readonly')
})

test('generates set summary correctly', async () => {
  const workoutExercises: WorkoutExercise[] = [
    {
      id: '1',
      exercise_name: 'Push Up',
      set_rep_detail: [
        { id: 1, reps: 10, weight: 20, rest: 30 },
        { id: 2, reps: 12, weight: 25, rest: 40 },
      ],
      exercise_type: 'Strength',
      workout_id: '',
      exercise_id: '1',
      user_id: '',
    },
  ]
  renderComponent({ workoutExercises })
  expect(screen.getByText('10x20kg (Rest: 30s), 12x25kg (Rest: 40s)')).toBeInTheDocument()
})

test('generates cardio set summary correctly', async () => {
  const workoutExercises: WorkoutExercise[] = [
    {
      id: '1',
      exercise_name: 'Running Test',
      set_rep_detail: [
        { id: 1, distance: 10, pace: '5:30' },
        { id: 2, distance: 10, pace: '6' },
      ],
      exercise_type: 'Cardio',
      workout_id: '',
      exercise_id: '2',
      user_id: '',
    },
  ]
  renderComponent({ workoutExercises })
  expect(screen.getByText('10km@5:30min/km, 10km@6min/km')).toBeInTheDocument()
})
