import { WorkoutType } from '@/types/workout.types'
import { generateSetRepDetails } from './setRepDetailsGenerator.utils'

describe('generateSetRepDetails', () => {
  describe('Strength workout type', () => {
    it('should generate correct set_rep_detail array for input "5x5"', () => {
      const input = '5x5'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 5 },
        { id: 2, reps: 5 },
        { id: 3, reps: 5 },
        { id: 4, reps: 5 },
        { id: 5, reps: 5 },
      ])
    })

    it('should generate correct set_rep_detail array for input "3x10"', () => {
      const input = '3x10'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 10 },
        { id: 2, reps: 10 },
        { id: 3, reps: 10 },
      ])
    })

    it('should generate correct set_rep_detail array for input "5x1,2,3,4,5"', () => {
      const input = '5x1,2,3,4,5'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 1 },
        { id: 2, reps: 2 },
        { id: 3, reps: 3 },
        { id: 4, reps: 4 },
        { id: 5, reps: 5 },
      ])
    })

    it('should generate correct set rep details for input with single weights', () => {
      const input = '3x10@100'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 10, weight: 100 },
        { id: 2, reps: 10, weight: 100 },
        { id: 3, reps: 10, weight: 100 },
      ])
    })

    it('should generate correct set rep details for input with multiple weights', () => {
      const input = '3x10@100,110,120'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 10, weight: 100 },
        { id: 2, reps: 10, weight: 110 },
        { id: 3, reps: 10, weight: 120 },
      ])
    })

    it('should generate correct set rep details for input with multiple weights and reps', () => {
      const input = '3x1,2,3@100,110,120'
      const result = generateSetRepDetails(input, WorkoutType.Strength)
      expect(result).toEqual([
        { id: 1, reps: 1, weight: 100 },
        { id: 2, reps: 2, weight: 110 },
        { id: 3, reps: 3, weight: 120 },
      ])
    })

    it('should throw an error for invalid input', () => {
      const input = 'invalid'
      expect(() => generateSetRepDetails(input, WorkoutType.Strength)).toThrow(
        'Invalid input format',
      )
    })

    it('should throw an error for input with non-numeric values', () => {
      const input = '3xa'
      expect(() => generateSetRepDetails(input, WorkoutType.Strength)).toThrow(
        'Invalid reps format',
      )
    })

    it('should throw an error for input with missing values', () => {
      const input = '3x'
      expect(() => generateSetRepDetails(input, WorkoutType.Strength)).toThrow(
        'Invalid input format',
      )
    })

    it('should throw an error for mismatched sets and reps', () => {
      const input = '5x1,2,3'
      expect(() => generateSetRepDetails(input, WorkoutType.Strength)).toThrow(
        'Invalid input format',
      )
    })
  })

  describe('Running workout type', () => {
    it('should generate correct set_rep_detail array for input "5x5"', () => {
      const input = '5x5'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 5 },
        { id: 2, distance: 5 },
        { id: 3, distance: 5 },
        { id: 4, distance: 5 },
        { id: 5, distance: 5 },
      ])
    })

    it('should generate correct set_rep_detail array for input "3x10"', () => {
      const input = '3x10'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 10 },
        { id: 2, distance: 10 },
        { id: 3, distance: 10 },
      ])
    })

    it('should generate correct set_rep_detail array for input "5x1,2,3,4,5"', () => {
      const input = '5x1,2,3,4,5'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 1 },
        { id: 2, distance: 2 },
        { id: 3, distance: 3 },
        { id: 4, distance: 4 },
        { id: 5, distance: 5 },
      ])
    })

    it('should generate correct set rep details for input with single paces', () => {
      const input = '3x10@5:00'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 10, pace: '5:00' },
        { id: 2, distance: 10, pace: '5:00' },
        { id: 3, distance: 10, pace: '5:00' },
      ])
    })

    it('should generate correct set rep details for input with multiple paces', () => {
      const input = '3x10@5:00,5:30,6:00'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 10, pace: '5:00' },
        { id: 2, distance: 10, pace: '5:30' },
        { id: 3, distance: 10, pace: '6:00' },
      ])
    })

    it('should generate correct set rep details for input with multiple distances and paces', () => {
      const input = '3x1,2,3@5:00,5:30,6:00'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([
        { id: 1, distance: 1, pace: '5:00' },
        { id: 2, distance: 2, pace: '5:30' },
        { id: 3, distance: 3, pace: '6:00' },
      ])
    })

    it('should generate correct set rep details for input with single distance and pace', () => {
      const input = '15km@5:45'
      const result = generateSetRepDetails(input, WorkoutType.Running)
      expect(result).toEqual([{ id: 1, distance: 15, pace: '5:45' }])
    })

    it('should throw an error for invalid input', () => {
      const input = 'invalid'
      expect(() => generateSetRepDetails(input, WorkoutType.Running)).toThrow(
        'Invalid input format',
      )
    })

    it('should throw an error for input with non-numeric values', () => {
      const input = '3xa'
      expect(() => generateSetRepDetails(input, WorkoutType.Running)).toThrow(
        'Invalid distance format',
      )
    })

    it('should throw an error for input with missing values', () => {
      const input = '3x'
      expect(() => generateSetRepDetails(input, WorkoutType.Running)).toThrow(
        'Invalid input format',
      )
    })

    it('should throw an error for mismatched sets and distances', () => {
      const input = '5x1,2,3'
      expect(() => generateSetRepDetails(input, WorkoutType.Running)).toThrow(
        'Invalid input format',
      )
    })
  })
})
