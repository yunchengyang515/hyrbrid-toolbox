/**
 * Overview component
 * Include 1. The ongoing training programs, in a list format
 * 2. Goals and dates
 * 3. Notes section, focus on periodization, including the Macrocycle, Mesocycle, and Microcycle
 */
import { Container, Text } from '@mantine/core'
import MyPrograms from '@/components/Home/Overview/MyPrograms'

export default function Overview() {
  return (
    <Container fluid>
      {/* Section Header */}
      <Text size='md' fw={700} mb='md'>
        My Programs
      </Text>

      <MyPrograms />
    </Container>
  )
}
