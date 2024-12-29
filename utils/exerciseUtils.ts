import { SetDetail } from '@/types/workoutExercise.types'

const isInvalidNumber = (value: any) => isNaN(value)
const isInvalidArray = (array: any[]) => array.some(isInvalidNumber)
const isMismatchedLength = (sets: number, array: any[]) => sets !== array.length

const createArray = (part: string, sets: number) =>
  part.includes(',') ? part.split(',').map(Number) : Array(sets).fill(Number(part))

export const generateSetRepDetails = (input: string): SetDetail[] => {
  const [setsPart, repsAndWeightsPart] = input.split('x')
  const sets = Number(setsPart)

  if (!repsAndWeightsPart) {
    throw new Error('Invalid input format')
  }

  const [repsPart, weightsPart] = repsAndWeightsPart.split('@')
  const repsArray = createArray(repsPart, sets)
  const weightsArray = weightsPart ? createArray(weightsPart, sets) : []

  if (
    isInvalidNumber(sets) ||
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
