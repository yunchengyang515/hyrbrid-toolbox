/**
 * Overview component
 * Include 1. The ongoing training programs, in a list format
 * 2. Goals and dates
 * 3. Notes section, focus on periodization, including the Macrocycle, Mesocycle, and Microcycle
 */
import { Container, SimpleGrid, Text } from '@mantine/core'
import RecentPrograms from '@/components/Home/Overview/RecentPrograms'
import Periodization from './Periodization'
import WeeklyReport from './WeeklyReport'

export default function Overview() {
  return (
    <Container fluid>
      <SimpleGrid cols={1}>
        <Text size='md' fw={700} mb='md'>
          Recent Programs
        </Text>
        <RecentPrograms />
      </SimpleGrid>
      <SimpleGrid cols={2} spacing='md'>
        <WeeklyReport />
        <Periodization />
      </SimpleGrid>
    </Container>
  )
}
