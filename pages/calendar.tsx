import type { ReactElement } from 'react'
import { Container, Divider, Notification, Stack, Title } from '@mantine/core'
import Calendar from '@/components/Calendar'
import { Layout } from '@/components/Layout'
import type { NextPageWithLayout } from './_app'

const CalendarPage: NextPageWithLayout = () => {
  // Example events
  const events = [
    { title: 'Strength Training', start: '2024-11-28T09:00:00' },
    { title: 'Long Run', start: '2024-11-29T07:00:00' },
    { title: 'Recovery Yoga', start: '2024-11-30T18:00:00' },
  ]

  // Find the next session (sorted by date)
  const nextSession = events
    .filter((event) => new Date(event.start) > new Date()) // Filter future sessions
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0] // Get earliest

  return (
    <Container fluid h={100}>
      <Stack gap='xl'>
        {/* Notification for Next Session */}
        {nextSession && (
          <Notification title='Upcoming Session' color='blue'>
            {`${nextSession.title}`}
          </Notification>
        )}
        <Calendar events={events} />
      </Stack>
    </Container>
  )
}

// Use getLayout to wrap the page in the Layout
CalendarPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CalendarPage
