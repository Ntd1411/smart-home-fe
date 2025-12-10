import * as React from 'react'

import { useMeQuery } from '@/features/auth/api/AuthService'
import { NavMain } from '@/shared/components/NavMain'
import { NavUser } from '@/shared/components/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/shared/components/ui/sidebar'
import navMain from '../lib/nav-main'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: selfInfo, isLoading, isPending } = useMeQuery()
  const permissions = selfInfo?.data?.roles.flatMap((role) => role.permissions) || []

  if (isLoading || isPending) {
    return null
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
                <img src='/actvn_big_icon.png' className='w-full h-full' alt='logo' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Smart home</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='style-scrollbar'>
        <NavMain items={navMain} permissions={permissions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={selfInfo?.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
