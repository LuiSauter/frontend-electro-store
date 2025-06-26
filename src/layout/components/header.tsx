import { Bell, CircleUser, LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import Navigation from './navigation'
import { useAuth, useHeader } from '@/hooks'
// import { PrivateRoutes } from '@/models'
import { AppConfig } from '@/config'
import { useEffect } from 'react'
import { socket } from '@/config/socket'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { useGetAllResource } from '@/hooks/useApiResource'

const Header = () => {
  const { breadcrumb } = useHeader()
  const { signOut } = useAuth()
  // const navigate = useNavigate()
  const { allResource: notifications } = useGetAllResource({ endpoint: '/api/product/notifications', isPagination: false })

  useEffect(() => {
    socket.on('minimunStock', (data: { title: string, body: string }) => {
      toast.info(data.title, {
        description: data.body,
        duration: 5000,
        position: 'bottom-right',
        style: {
          background: '#fff',
          color: '#000'
        }
      })
    })

    return () => {
      socket.off('minimunStock')
    }
  }, [socket])

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6 dark:bg-dark-bg-secondary bg-light-bg-primary">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col px-0 py-0 gap-0">
          <SheetHeader>
            <div className="flex items-center gap-3 px-4 border-b py-3 h-14">
              <h1>{AppConfig.APP_TITLE}</h1>
            </div>
          </SheetHeader>
          <Navigation />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              item.path
                ? (<div className='flex items-center sm:gap-2' key={index}>
                  <BreadcrumbItem>

                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>)
                : <BreadcrumbItem key={index}><BreadcrumbPage>{item.label}</BreadcrumbPage></BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-4 bg-light-bg-primary dark:bg-dark-bg-secondary">
          <div>
            <h3 className="font-semibold mb-2">Notificaciones</h3>
            <ul className="space-y-2">
              {notifications?.map((notification: any) => (
                <li key={notification.id} className="p-2 rounded hover:bg-light-bg-secondary dark:hover:bg-dark-bg-primary transition">
                  <span className="font-medium">{notification.title}</span>
                  <div className="text-xs text-muted-foreground">{notification.body}</div>
                </li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem onClick={() => { navigate(PrivateRoutes.PROFILE) }} className='cursor-pointer'>
            <User className="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { navigate(PrivateRoutes.SETTINGS) }} className='cursor-pointer'>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut} className='cursor-pointer'>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header >
  )
}

export default Header
