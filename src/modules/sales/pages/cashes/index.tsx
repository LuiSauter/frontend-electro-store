/* eslint-disable new-cap */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useGetAllCash } from '../../hooks/useCash'
import { type Cash } from '../../models/cash.model'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { Badge } from '@/components/ui/badge'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDate } from '../sales'

const CashPage = (): JSX.Element => {
  const exportToPDF = () => {
    const doc = new jsPDF()
    const now = new Date().toLocaleString('es-ES')
    const timestamp = now
      .replace('T', '_')
      .replace(/:/g, '-')
      .substring(0, 19) // yyyy-mm-dd_hh-mm-ss

    doc.setFontSize(14)
    doc.text('Reporte de Cajas', 14, 15)

    autoTable(doc, {
      startY: 20,
      head: [
        [
          'Fecha de Apertura',
          'Fecha de cierre',
          'Monto Inicial',
          'Ventas',
          'Compras',
          'Total',
          'Cajero',
          'Estado'
        ]
      ],
      body:
        allCashs?.map((cash: Cash) => [
          new Date(cash.opening).toLocaleString('es-ES'),
          cash.closing ? new Date(cash.closing).toLocaleString('es-ES') : '-',
          cash.initial_balance,
          cash.sales_total,
          cash.purchases_total,
          (Number(cash.total) + Number(cash.initial_balance)).toFixed(2),
          cash.user?.name ?? '',
          cash.closing ? 'Caja cerrada' : 'Caja abierta'
        ]) ?? [],
      styles: { fontSize: 8 }
    })

    doc.save(`reporte_cajas_${timestamp}.pdf`)
  }

  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Cajas' }
  ])
  const navigate = useNavigate()
  const { allCashs, countData, isLoading, filterOptions, newPage, prevPage, setOffset, search } = useGetAllCash()
  // const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchProduct, setSearchProduct] = useState('')
  const debounceSearchProduct = useDebounce(searchProduct, 1000)
  useEffect(() => {
    search('opening', debounceSearchProduct)
  }, [debounceSearchProduct])
  return (
    <section className='grid gap-4 overflow-hidden w-full relative'>
      <div className="inline-flex items-center flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => { navigate(-1) }}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <form className='py-1' onSubmit={(e) => { e.preventDefault() }}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar"
              className="w-full appearance-none bg-background pl-8 shadow-none outline-none h-8 ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 ring-offset-0 xl:min-w-80"
              onChange={(e) => { setSearchProduct(e.target.value) }}
            />
          </div>
        </form>
        <Button
          onClick={exportToPDF}
          variant="outline"
          size="sm"
          className="h-8"
        >
          Exportar a PDF
        </Button>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Historial de cajas</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de Apertura</TableHead>
                  <TableHead>Monto Inicial</TableHead>
                  <TableHead>Ventas</TableHead>
                  <TableHead>Compras</TableHead>
                  {/* <TableHead>Subtotal</TableHead> */}
                  <TableHead>Total</TableHead>
                  <TableHead>Nombre del Cajero</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={filterOptions.limit} columns={8} />
                  : allCashs?.map((cash: Cash) => (
                    <TableRow key={cash.id}>
                      <TableCell>{formatDate(cash.opening)}</TableCell>
                      <TableCell>{cash.initial_balance}</TableCell>
                      <TableCell>{cash.sales_total}</TableCell>
                      <TableCell>{cash.purchases_total}</TableCell>
                      {/* <TableCell>{cash.total}</TableCell> */}
                      <TableCell>{(Number(cash.total) + Number(cash.initial_balance)).toFixed(2)}</TableCell>
                      <TableCell>{cash.user?.name}</TableCell>
                      <TableCell>
                        <Badge variant={cash.closing ? 'default' : 'outline'}>
                          {cash.closing ? 'Caja cerrada' : 'Caja abierta'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={allCashs?.length ?? 0}
            limit={filterOptions.limit}
            newPage={() => { newPage(countData ?? 0) }}
            offset={filterOptions.offset}
            prevPage={prevPage}
            setOffset={setOffset}
            setLimit={() => { }}
            params={true}
          />
        </CardFooter>
      </Card>
    </section>
  )
}

export default CashPage
