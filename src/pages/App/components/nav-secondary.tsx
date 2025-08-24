import { type LucideIcon } from 'lucide-react'
import * as React from 'react'

import {
  UiSidebarGroup,
  UiSidebarGroupContent,
  UiSidebarMenu,
  UiSidebarMenuButton,
  UiSidebarMenuItem,
} from '@/ui/UiSidebar'

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof UiSidebarGroup>) {
  return (
    <UiSidebarGroup {...props}>
      <UiSidebarGroupContent>
        <UiSidebarMenu>
          {items.map(item => (
            <UiSidebarMenuItem key={item.title}>
              <UiSidebarMenuButton asChild size='sm'>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
          ))}
        </UiSidebarMenu>
      </UiSidebarGroupContent>
    </UiSidebarGroup>
  )
}
