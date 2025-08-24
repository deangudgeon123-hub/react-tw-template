'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'

import {
  UiCollapsible,
  UiCollapsibleContent,
  UiCollapsibleTrigger,
} from '@/ui/UiCollapsible'
import {
  UiSidebarGroup,
  UiSidebarGroupLabel,
  UiSidebarMenu,
  UiSidebarMenuAction,
  UiSidebarMenuButton,
  UiSidebarMenuItem,
  UiSidebarMenuSub,
  UiSidebarMenuSubButton,
  UiSidebarMenuSubItem,
} from '@/ui/UiSidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <UiSidebarGroup>
      <UiSidebarGroupLabel>Platform</UiSidebarGroupLabel>
      <UiSidebarMenu>
        {items.map(item => (
          <UiCollapsible key={item.title} asChild defaultOpen={item.isActive}>
            <UiSidebarMenuItem>
              <UiSidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </UiSidebarMenuButton>
              {item.items?.length ? (
                <>
                  <UiCollapsibleTrigger asChild>
                    <UiSidebarMenuAction className='data-[state=open]:rotate-90'>
                      <ChevronRight />
                      <span className='sr-only'>Toggle</span>
                    </UiSidebarMenuAction>
                  </UiCollapsibleTrigger>
                  <UiCollapsibleContent>
                    <UiSidebarMenuSub>
                      {item.items?.map(subItem => (
                        <UiSidebarMenuSubItem key={subItem.title}>
                          <UiSidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </UiSidebarMenuSubButton>
                        </UiSidebarMenuSubItem>
                      ))}
                    </UiSidebarMenuSub>
                  </UiCollapsibleContent>
                </>
              ) : null}
            </UiSidebarMenuItem>
          </UiCollapsible>
        ))}
      </UiSidebarMenu>
    </UiSidebarGroup>
  )
}
