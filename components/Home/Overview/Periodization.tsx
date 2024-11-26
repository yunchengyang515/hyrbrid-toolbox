import { IconCircle } from '@tabler/icons-react'
import { Accordion, Card, Group, ScrollArea, Stack, Text } from '@mantine/core'

enum CycleTypes {
  Macro = 'Macro',
  Meso = 'Meso',
  Micro = 'Micro',
}

export default function Periodization() {
  const periodization = {
    [CycleTypes.Macro]: {
      current: 'Strength Phase (Yearly Plan)',
      details: [
        'The yearly macrocycle combines strength and endurance phases for peak performance.',
      ],
    },
    [CycleTypes.Meso]: {
      current: 'Hypertrophy Block (4 weeks)',
      details: [
        'Weeks 1-4: Hypertrophy and Aerobic Base (Strength and Endurance)',
        'Weeks 5-8: Strength and VO2 Max Development',
        'Weeks 9-12: Strength Maintenance and Lactate Threshold',
      ],
    },
    [CycleTypes.Micro]: {
      current: 'Week 2: Push/Pull/Legs + Tempo/Interval Runs',
      details: [
        'Day 1: Push (Chest/Shoulders/Triceps) + Steady-State Run',
        'Day 2: Pull (Back/Biceps) + Tempo Run',
        'Day 3: Legs (Squats/Deadlifts) + Interval Run',
        'Day 4: Active Recovery or Easy Run',
      ],
    },
  }

  const cycleColors = {
    [CycleTypes.Macro]: 'blue',
    [CycleTypes.Meso]: 'green',
    [CycleTypes.Micro]: 'orange',
  }

  return (
    <Card shadow='sm' padding='md' radius='md' withBorder>
      <Text size='xl' fw={700} mb='md'>
        Periodization
      </Text>
      <ScrollArea h={300} offsetScrollbars>
        <Accordion>
          {Object.keys(periodization).map((cycle) => (
            <Accordion.Item value={cycle} key={cycle}>
              <Accordion.Control>
                <Group>
                  <IconCircle size={20} color={cycleColors[cycle as CycleTypes]} />
                  <Stack gap={0}>
                    <Text fw={500}>{cycle.charAt(0).toUpperCase() + cycle.slice(1)} Cycle</Text>
                    <Text size='sm' c='dimmed'>
                      {periodization[cycle as CycleTypes].current}
                    </Text>
                  </Stack>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {Array.isArray(periodization[cycle as CycleTypes].details) ? (
                  <Stack gap='xs'>
                    {periodization[cycle as CycleTypes].details.map((detail, index) => (
                      <Text size='sm' c='dimmed' key={index}>
                        {detail}
                      </Text>
                    ))}
                  </Stack>
                ) : (
                  <Text size='sm' c='dimmed'>
                    {periodization[cycle as CycleTypes].details}
                  </Text>
                )}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </ScrollArea>
    </Card>
  )
}
