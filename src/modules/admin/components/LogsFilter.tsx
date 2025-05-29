import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { type DateRange } from 'react-day-picker'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { toast } from 'sonner'
// import { Checkbox } from '@/components/ui/checkbox'
// import { API_BASEURL, getStorage, STORAGE_TOKEN } from '@/utils'

interface LogsFilterProps {
  onSearch: (search: string) => void
  onDateFilter: (fromDate?: string, toDate?: string) => void
}

// const items = [
//   { id: 'id', label: 'id' },
//   { id: 'user', label: 'Usuario' },
//   { id: 'ip', label: 'IP' },
//   { id: 'action', label: 'Acción' },
//   { id: 'metadata.url', label: 'Url' },
//   { id: 'metadata.method', label: 'Method' },
//   { id: 'metadata.body', label: 'Body' }
// ]

// const FormSchema = z.object({
//   type: z
//     .string({
//       required_error: 'Seleciona un tipo de exportación'
//     })
//     .min(1, {
//       message: 'Seleciona un tipo de exportación'
//     }),
//   columns: z.array(z.string()).refine((value) => value.some((item) => item), {
//     message: 'You have to select at least one item.'
//   }),
//   fileName: z.string().min(1, {
//     message: 'El nombre del archivo es requerido'
//   }),
//   fromDate: z.string().optional(),
//   toDate: z.string().optional()
// })

export const LogsFilter: React.FC<LogsFilterProps> = ({
  onSearch,
  onDateFilter
}) => {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  // const [isCalendarOpenExport, setIsCalendarOpenExport] = useState(false)
  // const [dateRangeExport, setDateRangeExport] = useState<DateRange | undefined>(undefined)

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     type: '',
  //     columns: ['id', 'user'],
  //     fileName: ''
  //   }
  // })

  // async function sendPdf({
  //   type,
  //   columns,
  //   fileName,
  //   fromDate,
  //   toDate
  // }: z.infer<typeof FormSchema>) {
  //   const columnsUrl = columns.map((column) => `columns=${column}`).join('&')
  //   const token = getStorage(STORAGE_TOKEN)
  //   const response = await fetch(
  //     `${API_BASEURL}/api/logs/${type}?${columnsUrl}&fileName=${fileName}&fromDate=${fromDate}&toDate=${toDate}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type':
  //           type === 'pdf'
  //             ? 'application/pdf'
  //             : type === 'excel'
  //               ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //               : 'application/json',
  //         Authorization: `Bearer ${token}`,
  //         Accept: '*/*'
  //       }
  //     }
  //   )
  //   if (type === 'send') {
  //     return
  //   }
  //   const blob = await response.blob()
  //   const url = window.URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.style.display = 'none'
  //   a.href = url
  //   a.download = `${fileName}.${type === 'pdf' ? 'pdf' : type === 'excel' ? 'xlsx' : 'json'
  //     }`
  //   document.body.appendChild(a)
  //   a.click()
  //   window.URL.revokeObjectURL(url)
  //   a.remove()
  // }

  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   const { type, columns, fileName } = data
  //   const fromDate = data.fromDate
  //     ? format(new Date(data.fromDate), 'yyyy-MM-dd')
  //     : undefined
  //   const toDate = data.toDate
  //     ? format(new Date(data.toDate), 'yyyy-MM-dd')
  //     : undefined
  //   await sendPdf({ type, columns, fileName, fromDate, toDate })
  //   toast.success('Exportación exitosa')
  // }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(search)
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)

    if (range?.from) {
      const fromDate = format(range.from, 'yyyy-MM-dd')
      const toDate = range.to ? format(range.to, 'yyyy-MM-dd') : undefined
      onDateFilter(fromDate, toDate)
    } else {
      onDateFilter(undefined, undefined)
    }

    if (range?.from && range.to) {
      setIsCalendarOpen(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setDateRange(undefined)
    onSearch('')
    onDateFilter(undefined, undefined)
  }

  return (
    <Card className="mb-4 bg-transparent border-none shadow-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en bitácora..."
              className="pl-8"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'P', { locale: es })} -{' '}
                      {format(dateRange.to, 'P', { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, 'P', { locale: es })
                  )
                ) : (
                  'Por fecha'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={handleDateChange}
                locale={es}
              // disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" onClick={clearFilters}>
            Limpiar
          </Button>

          {/* <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Exportar</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit" align='end'>
              <div className="grid gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <h3 className="text-lg font-semibold">Exportar</h3>
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className='grid grid-cols-[140px_1fr] items-center justify-center gap-4'>
                          <FormLabel className='h-fit mt-2'>Tipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="send">Correo electronico</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fileName"
                      render={({ field }) => (
                        <FormItem className='grid grid-cols-[140px_1fr] items-center justify-center gap-4 mt-0'>
                          <FormLabel className='h-fit mt-2'>Nombre del archivo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del archivo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="columns"
                      render={() => (
                        <FormItem className="grid grid-cols-[140px_1fr] items-center justify-center gap-4 mt-0">
                          <div className="mb-4">
                            <FormLabel className='h-fit mt-2'>Columnas</FormLabel>
                          </div>
                          <div>
                            {items.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="columns"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            if (checked) {
                                              field.onChange([...field.value, item.id])
                                            } else {
                                              field.onChange(
                                                field.value.filter((value) => value !== item.id)
                                              )
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-[140px_1fr] items-center justify-center gap-4 mt-0">
                      <FormLabel className="h-fit mt-2">Filtrar por fecha</FormLabel>
                      <Popover open={isCalendarOpenExport} onOpenChange={setIsCalendarOpenExport}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left">
                            {dateRangeExport?.from
                              ? (
                                dateRangeExport.to
                                  ? (
                                    <>
                                      {format(dateRangeExport.from, 'P', { locale: es })} -{' '}
                                      {format(dateRangeExport.to, 'P', { locale: es })}
                                    </>
                                  )
                                  : (
                                    format(dateRangeExport.from, 'P', { locale: es })
                                  )
                              )
                              : (
                                'Filtrar por fecha'
                              )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={dateRangeExport}
                            onSelect={(range) => {
                              setDateRangeExport(range)
                              form.setValue('fromDate', range?.from ? format(range.from, 'yyyy-MM-dd') : undefined)
                              form.setValue('toDate', range?.to ? format(range.to, 'yyyy-MM-dd') : undefined)
                            }}
                            locale={es}
                            disabled={{ after: new Date() }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            </PopoverContent>
          </Popover> */}
        </div>
      </div>
    </Card>
  )
}
