import { IconHeart, IconRun, IconWeight } from '@tabler/icons-react'
import { Card, Group, RingProgress, Stack, Text } from '@mantine/core'

const weeklyGoals = [
  {
    label: 'Strength Workouts',
    completed: 2,
    total: 3,
    color: 'blue',
    icon: <IconWeight size={20} color='blue' />,
  },
  {
    label: 'Cardio Workouts',
    completed: 4,
    total: 5,
    color: 'green',
    icon: <IconRun size={20} color='green' />,
  },
  {
    label: 'Longevity Workouts',
    completed: 1,
    total: 2,
    color: 'orange',
    icon: <IconHeart size={20} color='orange' />,
  },
]

export default function WeeklyReport() {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Text size='xl' fw={700} mb='md'>
        Weekly Report
      </Text>
      <Stack gap='sm'>
        {weeklyGoals.map((goal, index) => {
          const progress = (goal.completed / goal.total) * 100
          return (
            <Group key={index} justify='space-between' align='center'>
              <Group>
                {goal.icon}
                <Stack gap={0}>
                  <Text fw={500}>{goal.label}</Text>
                  <Text size='sm' c='dimmed'>
                    {goal.completed}/{goal.total} sessions
                  </Text>
                </Stack>
              </Group>
              <RingProgress
                size={60}
                thickness={8}
                sections={[{ value: progress, color: goal.color }]}
              />
            </Group>
          )
        })}
      </Stack>
    </Card>
  )
}
