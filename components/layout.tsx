import Image from 'next/image'
import { AppShell, Group, Skeleton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened] = useDisclosure()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Image src='/logo.svg' alt='Logo' width={40} height={40} />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p='md'>
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt='sm' animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
