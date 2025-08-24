import { Outlet } from 'react-router-dom'

import {
  UiBreadcrumb,
  UiBreadcrumbItem,
  UiBreadcrumbLink,
  UiBreadcrumbList,
  UiBreadcrumbPage,
  UiBreadcrumbSeparator,
} from '@/ui/UiBreadcrumb'
import { UiSeparator } from '@/ui/UiSeparator'
import {
  UiSidebarInset,
  UiSidebarProvider,
  UiSidebarTrigger,
} from '@/ui/UiSidebar'

import { AppSidebar } from './components/app-sidebar'

export default function AppPage() {
  return (
    <UiSidebarProvider>
      <AppSidebar />
      <UiSidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <UiSidebarTrigger className='text-foreground -ml-1' />
            <UiSeparator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <UiBreadcrumb>
              <UiBreadcrumbList>
                <UiBreadcrumbItem className='hidden md:block'>
                  <UiBreadcrumbLink href='#'>
                    Building Your Application
                  </UiBreadcrumbLink>
                </UiBreadcrumbItem>
                <UiBreadcrumbSeparator className='hidden md:block' />
                <UiBreadcrumbItem>
                  <UiBreadcrumbPage>Data Fetching</UiBreadcrumbPage>
                </UiBreadcrumbItem>
              </UiBreadcrumbList>
            </UiBreadcrumb>
          </div>
        </header>

        <Outlet />
      </UiSidebarInset>
    </UiSidebarProvider>
  )
}
