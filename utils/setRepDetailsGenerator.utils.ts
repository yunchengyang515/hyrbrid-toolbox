import { DISTANCE_UNIT } from '@/types/units'
import { WorkoutType } from '@/types/workout.types'
import { SetDetail } from '@/types/workoutExercise.types'

const isInvalidNumber = (value: any) => isNaN(value)
const isMismatchedLength = (sets: number, array: any[]) => sets !== array.length

const validateDistance = (value: string) => {
  const distance = value.split(DISTANCE_UNIT)[0]
  if (isInvalidNumber(distance)) {
    throw new Error('Invalid distance format')
  }
  return Number(distance)
}

const validateWeight = (value: string) => {
  if (isInvalidNumber(value)) {
    throw new Error('Invalid weight format')
  }
  return Number(value)
}

const validatePace = (value: string) => {
  const pacePattern = /^(\d{1,2}):([0-5]\d)$/
  if (!pacePattern.test(value)) {
    throw new Error('Invalid pace format')
  }
  return value
}

const validateReps = (value: string) => {
  if (isInvalidNumber(value)) {
    throw new Error('Invalid reps format')
  }
  return Number(value)
}

const createArray = (part: string, sets: number, validator: (value: string) => any) =>
  part.includes(',') ? part.split(',').map(validator) : Array(sets).fill(validator(part))

const handleStrengthInput = (sets: number, repsPart: string, weightsPart?: string): SetDetail[] => {
  const repsArray = createArray(repsPart, sets, validateReps)
  const weightsArray = weightsPart ? createArray(weightsPart, sets, validateWeight) : []

  if (
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
  const distanceArray = createArray(distancePart, sets, validateDistance)
  const paceArray = pacePart ? createArray(pacePart, sets, validatePace) : []

  if (
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

const validateInitialInput = (input: string) => {
  if (!input.includes('x') && !input.includes('@')) {
    throw new Error('Invalid input format')
  }
}

const generateStrengthSetRepDetails = (input: string): SetDetail[] => {
  const [setsPart, repsAndWeightsPart] = input.split('x')
  const sets = Number(setsPart)

  if (isInvalidNumber(sets) || !repsAndWeightsPart) {
    throw new Error('Invalid input format')
  }

  const [repsPart, weightsPart] = repsAndWeightsPart.split('@')
  return handleStrengthInput(sets, repsPart, weightsPart)
}

const generateRunningSetRepDetails = (input: string): SetDetail[] => {
  const [setsPart, repsAndWeightsPart] = input.split('x')
  const [distancePart, pacePart] = repsAndWeightsPart
    ? repsAndWeightsPart.split('@')
    : setsPart.split('@')

  if ((!distancePart || !pacePart) && !repsAndWeightsPart) {
    throw new Error('Invalid input format')
  }
  const sets = Number(setsPart)
  if (isInvalidNumber(sets) || !repsAndWeightsPart) {
    const [distancePart, pacePart] = setsPart.split('@')

    return handleRunningInput(1, distancePart, pacePart)
  }

  return handleRunningInput(sets, distancePart, pacePart)
}

const generateSetRepDetailsFactory = (input: string, workoutType: WorkoutType): SetDetail[] => {
  validateInitialInput(input)

  if (workoutType === WorkoutType.Strength) {
    return generateStrengthSetRepDetails(input)
  } else if (workoutType === WorkoutType.Running) {
    return generateRunningSetRepDetails(input)
  }
  throw new Error('Invalid workout type')
}

export const generateSetRepDetails = generateSetRepDetailsFactory
