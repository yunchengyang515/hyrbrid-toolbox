import type { ReactElement } from 'react'
import { IconChartBar, IconListDetails } from '@tabler/icons-react'
import { Container, rem, Tabs, Text } from '@mantine/core'
import Overview from '@/components/Home/Overview'
import { Layout } from '@/components/Layout'
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
          Welcome to Your Hybrid Training Dashboard 🚀
        </Text>
      </Container>
      {/* Tabs */}
      <Container fluid px={0}>
        {' '}
        {/* Tabs container */}
        <Tabs variant='outline' defaultValue='overview'>
          <Tabs.List>
            <Tabs.Tab value='overview' leftSection={<IconListDetails style={iconStyle} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value='analytics' leftSection={<IconChartBar style={iconStyle} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          {/* Content for each tab */}
          <Tabs.Panel value='overview' pt='lg'>
            <Overview />
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
