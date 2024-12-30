import { WorkoutType } from '@/types/workout.types'
import { SetDetail } from '@/types/workoutExercise.types'

const isInvalidNumber = (value: any) => isNaN(value)
const isInvalidArray = (array: any[]) => array.some(isInvalidNumber)
const isMismatchedLength = (sets: number, array: any[]) => sets !== array.length

const createArray = (part: string, sets: number) =>
  part.includes(',') ? part.split(',').map(Number) : Array(sets).fill(Number(part))

const handleStrengthInput = (sets: number, repsPart: string, weightsPart?: string): SetDetail[] => {
  const repsArray = createArray(repsPart, sets)
  const weightsArray = weightsPart ? createArray(weightsPart, sets) : []

  if (
    isInvalidArray(repsArray) ||
    (weightsArray.length && isInvalidArray(weightsArray)) ||
    isMismatchedLength(sets, repsArray) ||
    (weightsArray.length && isMismatchedLength(sets, weightsArray))
  ) {
    throw new Error('Invalid input format')
  }

  return Array.from({ length: sets }, (_, index) => ({
    id: index + 1,
    reps: repsArray[index],
    weight: weightsArray[index] || undefined,
  }))
}

const handleRunningInput = (sets: number, distancePart: string, pacePart?: string): SetDetail[] => {
  const distanceArray = createArray(distancePart, sets)
  const paceArray = pacePart ? createArray(pacePart, sets) : []

  if (
    isInvalidArray(distanceArray) ||
    (paceArray.length && isInvalidArray(paceArray)) ||
    isMismatchedLength(sets, distanceArray) ||
    (paceArray.length && isMismatchedLength(sets, paceArray))
  ) {
    throw new Error('Invalid input format')
  }

  return Array.from({ length: sets }, (_, index) => ({
    id: index + 1,
    distance: distanceArray[index],
    pace: paceArray[index] || undefined,
  }))
}

const handleSingleRunningInput = (distancePart: string, pacePart: string): SetDetail[] => {
  const distance = Number(distancePart)
  const pace = pacePart

  if (isInvalidNumber(distance)) {
    throw new Error('Invalid input format')
  }

  return [
    {
      id: 1,
      distance,
      pace,
    },
  ]
}

const generateSetRepDetailsFactory = (input: string, workoutType: WorkoutType): SetDetail[] => {
  const [setsPart, repsAndWeightsPart] = input.split('x')
  const sets = Number(setsPart)

  if (workoutType === WorkoutType.Running && !repsAndWeightsPart) {
    const [distancePart, pacePart] = setsPart.split('@')
    return handleSingleRunningInput(distancePart, pacePart)
  }

  if (isInvalidNumber(sets) || !repsAndWeightsPart) {
    throw new Error('Invalid input format')
  }

  const [repsOrDistancePart, weightsOrPacePart] = repsAndWeightsPart.split('@')

  if (workoutType === WorkoutType.Strength) {
    return handleStrengthInput(sets, repsOrDistancePart, weightsOrPacePart)
  } else if (workoutType === WorkoutType.Running) {
    return handleRunningInput(sets, repsOrDistancePart, weightsOrPacePart)
  }
  throw new Error('Invalid workout type')
}

export const generateSetRepDetails = generateSetRepDetailsFactory
