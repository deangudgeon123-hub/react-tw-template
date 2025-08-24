'use client'

import {
  Folder,
  type LucideIcon,
  MoreHorizontal,
  Share,
  Trash2,
} from 'lucide-react'

import {
  UiDropdownMenu,
  UiDropdownMenuContent,
  UiDropdownMenuItem,
  UiDropdownMenuSeparator,
  UiDropdownMenuTrigger,
} from '@/ui/UiDropdownMenu'
import {
  UiSidebarGroup,
  UiSidebarGroupLabel,
  UiSidebarMenu,
  UiSidebarMenuAction,
  UiSidebarMenuButton,
  UiSidebarMenuItem,
  useUiSidebar,
} from '@/ui/UiSidebar'

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { isMobile } = useUiSidebar()

  return (
    <UiSidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <UiSidebarGroupLabel>Projects</UiSidebarGroupLabel>
      <UiSidebarMenu>
        {projects.map(item => (
          <UiSidebarMenuItem key={item.name}>
            <UiSidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </UiSidebarMenuButton>
            <UiDropdownMenu>
              <UiDropdownMenuTrigger asChild>
                <UiSidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className='sr-only'>More</span>
                </UiSidebarMenuAction>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent
                className='w-48'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <UiDropdownMenuItem>
                  <Folder className='text-muted-foreground' />
                  <span>View Project</span>
                </UiDropdownMenuItem>
                <UiDropdownMenuItem>
                  <Share className='text-muted-foreground' />
                  <span>Share Project</span>
                </UiDropdownMenuItem>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuItem>
                  <Trash2 className='text-muted-foreground' />
                  <span>Delete Project</span>
                </UiDropdownMenuItem>
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </UiSidebarMenuItem>
        ))}
        <UiSidebarMenuItem>
          <UiSidebarMenuButton>
            <MoreHorizontal />
            <span>More</span>
          </UiSidebarMenuButton>
        </UiSidebarMenuItem>
      </UiSidebarMenu>
    </UiSidebarGroup>
  )
}
