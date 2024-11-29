import Image from 'next/image'
import { useRouter } from 'next/router'
import { IconCalendar, IconDashboard } from '@tabler/icons-react'
import { AppShell, Group, NavLink } from '@mantine/core'

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Navigation links for the sidebar
  const links = [
    {
      label: 'Dashboard',
      icon: <IconDashboard size='1rem' stroke={1.5} />,
      path: '/',
    },
    {
      label: 'Calendar',
      icon: <IconCalendar size='1rem' stroke={1.5} />,
      path: '/calendar',
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
          <NavLink
            key={link.path}
            label={link.label}
            href={link.path}
            leftSection={link.icon}
            active={router.pathname === link.path} // Highlight active route
            variant='light' // Use the light variant for consistency
            onClick={() => router.push(link.path)} // Redirect to the link's path
          />
        ))}
      </AppShell.Navbar>

      {/* Main Content Section */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
