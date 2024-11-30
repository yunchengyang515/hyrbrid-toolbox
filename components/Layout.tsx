import Image from 'next/image'
import { useRouter } from 'next/router'
import {
  IconCalendar,
  IconChecklist,
  IconCircuitChangeover,
  IconDashboard,
} from '@tabler/icons-react'
import { AppShell, Group, NavLink, Tooltip } from '@mantine/core'

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Navigation links for the sidebar
  const links = [
    {
      label: 'Dashboard',
      icon: <IconDashboard size='1rem' stroke={1.5} />,
      path: '/',
      description: 'Overview and analytics',
    },
    {
      label: 'Calendar',
      icon: <IconCalendar size='1rem' stroke={1.5} />,
      path: '/calendar',
      description: 'View and manage your training schedule',
    },
    {
      label: 'Programming',
      icon: <IconCircuitChangeover size='1rem' stroke={1.5} />,
      path: '/programming',
      description: 'Customize your training program, workout and create new sessions',
    },
    {
      label: 'Sessions',
      icon: <IconChecklist size='1rem' stroke={1.5} />,
      path: '/sessions',
      description: 'View and manage your training sessions',
    },
  ]

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: false } }}
      padding='md'
    >
      {/* Header Section */}
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Image src='/logo.svg' alt='Logo' width={40} height={40} />
        </Group>
      </AppShell.Header>

      {/* Sidebar Section */}
      <AppShell.Navbar p='md'>
        {links.map((link) => (
          <Tooltip label={link.description}>
            <NavLink
              key={link.path}
              label={link.label}
              href={link.path}
              leftSection={link.icon}
              active={router.pathname === link.path} // Highlight active route
              variant='light' // Use the light variant for consistency
              onClick={() => router.push(link.path)} // Redirect to the link's path
            />
          </Tooltip>
        ))}
      </AppShell.Navbar>

      {/* Main Content Section */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
