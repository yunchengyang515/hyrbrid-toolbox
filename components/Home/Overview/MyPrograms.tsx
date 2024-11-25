import { Badge, Group, Paper, Progress, ScrollArea, Text } from '@mantine/core'

const programs = [
  {
    name: 'The Juggernut Method',
    status: 'Active',
    dateRange: '01/01/2023 - 31/03/2023',
    progress: 75,
  },
  {
    name: 'Cardio Maintaining',
    status: 'Completed',
    dateRange: '01/10/2022 - 31/12/2022',
    progress: 100,
  },
  {
    name: 'Flexibility & Mobility',
    status: 'Pending',
    dateRange: '01/02/2023 - 31/05/2023',
    progress: 50,
  },
]

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'blue'
    case 'Completed':
      return 'teal'
    case 'Pending':
      return 'yellow'
    default:
      return 'gray'
  }
}

export default function MyPrograms() {
  return (
    <ScrollArea h={250} type='auto' offsetScrollbars>
      {programs.map((program, index) => (
        <Paper key={index} shadow='sm' p={10} radius='md' withBorder mb='md'>
          {/* Header: Program Name and Status */}
          <Group justify='space-between' mb='xs'>
            <Text fw={500}>{program.name}</Text>
            <Badge color={getStatusBadgeColor(program.status)}>{program.status}</Badge>
          </Group>

          {/* Date Range */}
          <Text size='sm' c='dimmed' mb='sm'>
            {program.dateRange}
          </Text>

          {/* Progress */}
          <Progress.Root size='lg'>
            <Progress.Section
              value={program.progress}
              color={program.progress >= 100 ? 'teal' : 'blue'}
            >
              <Progress.Label>{program.progress}%</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </Paper>
      ))}
    </ScrollArea>
  )
}
