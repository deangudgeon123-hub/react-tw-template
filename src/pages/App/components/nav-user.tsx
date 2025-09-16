'use client'

import Avatar from 'boring-avatars'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogInIcon,
  LogOutIcon,
  Sparkles,
} from 'lucide-react'

import { useEthContext } from '@/contexts/Web3Provider/EthProvider'
import { UiAvatar, UiAvatarFallback, UiAvatarImage } from '@/ui/UiAvatar'
import {
  UiDropdownMenu,
  UiDropdownMenuContent,
  UiDropdownMenuGroup,
  UiDropdownMenuItem,
  UiDropdownMenuLabel,
  UiDropdownMenuSeparator,
  UiDropdownMenuTrigger,
} from '@/ui/UiDropdownMenu'
import {
  UiSidebarMenu,
  UiSidebarMenuButton,
  UiSidebarMenuItem,
  useUiSidebar,
} from '@/ui/UiSidebar'

export function NavUser() {
  const { address, connect, disconnect } = useEthContext()

  const { isMobile } = useUiSidebar()

  const UserAvatar = () => {
    if (!address) {
      return (
        <UiAvatar className='h-8 w-8 rounded-lg'>
          <UiAvatarImage asChild></UiAvatarImage>
          <UiAvatarFallback className='rounded-lg'>CN</UiAvatarFallback>
        </UiAvatar>
      )
    }

    return (
      <Avatar
        name={address}
        size={32}
        colors={[
          'var(--chart-1)',
          'var(--chart-2)',
          'var(--chart-3)',
          'var(--chart-4)',
          'var(--chart-5)',
        ]}
      />
    )
  }

  const UserInitials = () => {
    if (!address) {
      return (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-medium'>Connect your wallet</span>
        </div>
      )
    }

    return (
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium'>address</span>
        <span className='truncate text-xs'>{address}</span>
      </div>
    )
  }

  return (
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger asChild>
            <UiSidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UserAvatar />
              <UserInitials />
              <ChevronsUpDown className='ml-auto size-4' />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <UiDropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <UserAvatar />
                <UserInitials />
              </div>
            </UiDropdownMenuLabel>
            <UiDropdownMenuSeparator />

            {address ? (
              <>
                <UiDropdownMenuGroup>
                  <UiDropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </UiDropdownMenuItem>
                </UiDropdownMenuGroup>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuGroup>
                  <UiDropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </UiDropdownMenuItem>
                  <UiDropdownMenuItem>
                    <CreditCard />
                    Billing
                  </UiDropdownMenuItem>
                  <UiDropdownMenuItem>
                    <Bell />
                    Notifications
                  </UiDropdownMenuItem>
                </UiDropdownMenuGroup>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuItem onClick={disconnect}>
                  <LogOutIcon />
                  Log out
                </UiDropdownMenuItem>
              </>
            ) : (
              <UiDropdownMenuItem onClick={connect}>
                <LogInIcon />
                Connect
              </UiDropdownMenuItem>
            )}
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>
  )
}
