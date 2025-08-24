'use client'

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'

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

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useUiSidebar()

  return (
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger asChild>
            <UiSidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UiAvatar className='h-8 w-8 rounded-lg'>
                <UiAvatarImage src={user.avatar} alt={user.name} />
                <UiAvatarFallback className='rounded-lg'>CN</UiAvatarFallback>
              </UiAvatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{user.name}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
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
                <UiAvatar className='h-8 w-8 rounded-lg'>
                  <UiAvatarImage src={user.avatar} alt={user.name} />
                  <UiAvatarFallback className='rounded-lg'>CN</UiAvatarFallback>
                </UiAvatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{user.name}</span>
                  <span className='truncate text-xs'>{user.email}</span>
                </div>
              </div>
            </UiDropdownMenuLabel>
            <UiDropdownMenuSeparator />
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
            <UiDropdownMenuItem>
              <LogOut />
              Log out
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>
  )
}
