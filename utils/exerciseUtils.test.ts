import { generateSetRepDetails } from './exerciseUtils'

describe('generateSetRepDetails', () => {
  it('should generate correct set_rep_detail array for input "5x5"', () => {
    const input = '5x5'
    const result = generateSetRepDetails(input)
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
    const result = generateSetRepDetails(input)
    expect(result).toEqual([
      { id: 1, reps: 10 },
      { id: 2, reps: 10 },
      { id: 3, reps: 10 },
    ])
  })

  it('should generate correct set_rep_detail array for input "5x1,2,3,4,5"', () => {
    const input = '5x1,2,3,4,5'
    const result = generateSetRepDetails(input)
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
    const result = generateSetRepDetails(input)
    expect(result).toEqual([
      { id: 1, reps: 10, weight: 100 },
      { id: 2, reps: 10, weight: 100 },
      { id: 3, reps: 10, weight: 100 },
    ])
  })

  it('should generate correct set rep details for input with multiple weights', () => {
    const input = '3x10@100,110,120'
    const result = generateSetRepDetails(input)
    expect(result).toEqual([
      { id: 1, reps: 10, weight: 100 },
      { id: 2, reps: 10, weight: 110 },
      { id: 3, reps: 10, weight: 120 },
    ])
  })

  it('should generate correct set rep details for input with multiple weights and reps', () => {
    const input = '3x1,2,3@100,110,120'
    const result = generateSetRepDetails(input)
    expect(result).toEqual([
      { id: 1, reps: 1, weight: 100 },
      { id: 2, reps: 2, weight: 110 },
      { id: 3, reps: 3, weight: 120 },
    ])
  })

  it('should throw an error for invalid input', () => {
    const input = 'invalid'
    expect(() => generateSetRepDetails(input)).toThrow('Invalid input format')
  })

  it('should throw an error for input with non-numeric values', () => {
    const input = '3xa'
    expect(() => generateSetRepDetails(input)).toThrow('Invalid input format')
  })

  it('should throw an error for input with missing values', () => {
    const input = '3x'
    expect(() => generateSetRepDetails(input)).toThrow('Invalid input format')
  })

  it('should throw an error for mismatched sets and reps', () => {
    const input = '5x1,2,3'
    expect(() => generateSetRepDetails(input)).toThrow('Invalid input format')
  })
})
