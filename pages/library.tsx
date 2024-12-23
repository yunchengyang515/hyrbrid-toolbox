import type { ReactElement } from 'react'
import { IconBarbell, IconBook, IconLayoutDashboard, IconTemplate } from '@tabler/icons-react'
import { Container, rem, Tabs, Text } from '@mantine/core'
import { Layout } from '@/components/layout.component'
import ExercisesTab from '@/components/Library/tabs/exercise.tab'
import WorkoutsTab from '@/components/Library/tabs/Workout.tab'
import type { NextPageWithLayout } from './_app'

const LibraryPage: NextPageWithLayout = () => {
  const iconStyle = { width: rem(16), height: rem(16) } // Ensure consistent icon size

  return (
    <Container fluid>
      {/* Welcoming Header */}
      <Container fluid mb='xl' pl={0}>
        <Text size='xl' fw={700} ta='left'>
          Welcome to Your Training Library 📚
        </Text>
        <Text size='sm' ta='left'>
          Customize your workouts, exercises, and programs to suit your training goals.
        </Text>
      </Container>
      {/* Tabs */}
      <Tabs variant='outline' defaultValue='workouts'>
        <Tabs.List>
          <Tabs.Tab value='workouts' leftSection={<IconBarbell style={iconStyle} />}>
            Workouts
          </Tabs.Tab>
          <Tabs.Tab value='exercises' leftSection={<IconBook style={iconStyle} />}>
            Exercises
          </Tabs.Tab>
          <Tabs.Tab value='templates' leftSection={<IconTemplate style={iconStyle} />}>
            Session Templates
          </Tabs.Tab>
          <Tabs.Tab value='programs' leftSection={<IconLayoutDashboard style={iconStyle} />}>
            Programs
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab Content Placeholders */}
        <Tabs.Panel value='workouts' pt='md'>
          <WorkoutsTab />
        </Tabs.Panel>

        <Tabs.Panel value='exercises' pt='md'>
          <ExercisesTab />
        </Tabs.Panel>

        <Tabs.Panel value='templates' pt='md'>
          <p>Templates tab content goes here...</p>
        </Tabs.Panel>

        <Tabs.Panel value='programs' pt='md'>
          <p>Programs tab content goes here...</p>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

// Use getLayout to wrap the page in the Layout
LibraryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default LibraryPage
