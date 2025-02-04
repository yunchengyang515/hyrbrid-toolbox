import Image from 'next/image'
import { useRouter } from 'next/router'
import { IconBook, IconCalendar, IconDashboard, IconMessageCircle } from '@tabler/icons-react'
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
      label: 'Library',
      icon: <IconBook size='1rem' stroke={1.5} />,
      path: '/library',
      description: 'Explore and create workouts, exercises, and training programs',
    },
    {
      label: 'Dylan AI 🤖',
      icon: <IconMessageCircle size='1rem' stroke={1.5} />,
      path: '/chat',
      description: 'Chat with Dylan AI, your smart online coach',
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
          <Tooltip label={link.description} key={link.path}>
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
