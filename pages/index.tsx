import type { ReactElement } from 'react'
import { IconCalendar, IconChartBar, IconListDetails } from '@tabler/icons-react'
import { Container, rem, Tabs, Text } from '@mantine/core'
import { Layout } from '@/components/AppLayout'
import Calendar from '@/components/Calendar'
import type { NextPageWithLayout } from './_app'

const HomePage: NextPageWithLayout = () => {
  const iconStyle = { width: rem(16), height: rem(16) } // Slightly larger icons for better visibility

  return (
    <Container fluid px='md' mt='xl'>
      {' '}
      {/* Outer container for the entire page */}
      {/* Header Text */}
      <Container fluid mb='xl'>
        {' '}
        {/* Centered container for the header */}
        <Text size='xl' fw={700} ta='left'>
          Welcome to Your Training Dashboard
        </Text>
      </Container>
      {/* Tabs */}
      <Container fluid px={0}>
        {' '}
        {/* Tabs container */}
        <Tabs variant='outline' defaultValue='calendar'>
          <Tabs.List>
            <Tabs.Tab value='calendar' leftSection={<IconCalendar style={iconStyle} />}>
              Calendar
            </Tabs.Tab>
            <Tabs.Tab value='programs' leftSection={<IconListDetails style={iconStyle} />}>
              Programs
            </Tabs.Tab>
            <Tabs.Tab value='analytics' leftSection={<IconChartBar style={iconStyle} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          {/* Content for each tab */}
          <Tabs.Panel value='programs' pt='lg'>
            <Text ta='center'>Programs tab content goes here...</Text>
          </Tabs.Panel>

          <Tabs.Panel value='calendar'>
            <Container fluid pt={20} px={0}>
              <Calendar />
            </Container>
          </Tabs.Panel>

          <Tabs.Panel value='analytics' pt='lg'>
            <Text ta='center'>Analytics tab content goes here...</Text>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Container>
  )
}

// Use getLayout to wrap the home page in the Layout
HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default HomePage
