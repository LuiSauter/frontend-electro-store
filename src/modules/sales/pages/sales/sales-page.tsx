import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon, Download, FileSpreadsheet, ListFilter, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PrivateRoutes } from '@/models'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Skeleton from '@/components/shared/skeleton'
import Pagination from '@/components/shared/pagination'
import { useHeader } from '@/hooks'
import { Input } from '@/components/ui/input'
import { useGetAllResource } from '@/hooks/useApiResource'
import { type Sale } from '../../models/sale.model'
import { formatDate } from '.'
import { exportVentasToExcel, exportVentasToGoogleSheets, useReactToPrint } from '@/hooks/usePrint'
import { AppConfig } from '@/config'

const SalesPage = (): JSX.Element => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Ventas' }
  ])
  const navigate = useNavigate()
  const { allResource: sales, isLoading, filterOptions, countData, newPage, prevPage, setOffset } = useGetAllResource<Sale[]>({ endpoint: '/api/sales/' })
  const reporteRef = useRef(null)
  const [showReport, setShowReport] = useState(false)
  const handlePrint = useReactToPrint({ content: () => reporteRef.current, documentTitle: 'Reporte de Historial de Ventas' })

  const printReport = () => {
    setShowReport(true)
    setTimeout(() => {
      void handlePrint()
      setShowReport(false)
    }, 500)
  }

  const exportToCsv = (detailed: boolean) => {
    exportVentasToExcel(sales?.map((item: any) => ({
      id: item.code,
      fecha: item.created_at,
      total: Number(item.paid_amount),
      items: item.details.map((detail: any, index: number) => ({
        id: index,
        nombre: detail.product_detail.name,
        precio: Number(detail.price),
        cantidad: Number(detail.quantity)
      }))
    })) ?? [], detailed)
  }

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
            // onChange={(e) => { setSearchProduct(e.target.value) }}
            />
          </div>
        </form>
        <Button
          onClick={printReport}
          variant="outline"
          size="sm"
          className="h-8"
          disabled={showReport}
        >
          Exportar a PDF
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-8" size="sm">
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Excel</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => exportToCsv(false)}>
              <Download className="h-4 w-4 mr-2" />
              Resumen de ventas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportToCsv(true)}>
              <Download className="h-4 w-4 mr-2" />
              Detalle de productos
            </DropdownMenuItem>
            <DropdownMenuLabel>Google Sheets</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => exportVentasToGoogleSheets(sales?.map((item: any) => ({
              id: item.code,
              fecha: item.created_at,
              total: Number(item.paid_amount),
              items: item.details.map((detail: any, index: number) => ({
                id: index,
                nombre: detail.product_detail.name,
                precio: Number(detail.price),
                cantidad: Number(detail.quantity)
              }))
            })) ?? [], false)}>
              <Download className="h-4 w-4 mr-2" />
              Resumen para Google Sheets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportVentasToGoogleSheets(sales?.map((item: any) => ({
              id: item.code,
              fecha: item.created_at,
              total: Number(item.paid_amount),
              items: item.details.map((detail: any, index: number) => ({
                id: index,
                nombre: detail.product_detail.name,
                precio: Number(detail.price),
                cantidad: Number(detail.quantity)
              }))
            })) ?? [], true)}>
              <Download className="h-4 w-4 mr-2" />
              Detalle para Google Sheets
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='ml-auto'>
            <Button variant="outline" size="sm" className="h-8 gap-1"><ListFilter className="h-3.5 w-3.5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Fecha</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Cliente</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card x-chunk="dashboard-06-chunk-0" className='flex flex-col overflow-hidden w-full relative'>
        <CardHeader>
          <CardTitle>Todos las ventas</CardTitle>
        </CardHeader>
        <CardContent className='overflow-hidden relative w-full'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nro</TableHead>
                  <TableHead>Nit</TableHead>
                  <TableHead>Cantidad prod.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? <Skeleton rows={5} columns={8} />
                  : sales?.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.nit}</TableCell>
                      <TableCell>{item.details.length}</TableCell>
                      <TableCell>Bs. {item.paid_amount}</TableCell>
                      <TableCell>{formatDate(item.created_at as Date)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className='w-full'>
          <Pagination
            allItems={countData ?? 0}
            currentItems={sales?.length ?? 0}
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
      <div style={{ display: 'none' }}>
        {showReport && (
          <div ref={reporteRef}>
            <ReporteHistorial
              sale={
                sales?.map((item: any) => ({
                  id: item.code,
                  fecha: item.created_at,
                  total: Number(item.paid_amount),
                  items: item.details.map((detail: any, index: number) => ({
                    id: index,
                    nombre: detail.product_detail.name,
                    precio: Number(detail.price),
                    cantidad: Number(detail.quantity)
                  }))
                })) ?? []
              }
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default SalesPage

interface SaleReport {
  id: string
  fecha: Date
  total: number
  items: Array<{
    id: number
    nombre: string
    precio: number
    cantidad: number
  }>
}

function ReporteHistorial({ sale }: { sale: SaleReport[] }) {
  const totalVentas = sale.reduce((total, venta) => total + venta.total, 0)
  const cantidadVentas = sale.length
  const fechaInicio =
    sale.length > 0 ? new Date(Math.min(...sale.map((v) => new Date(v.fecha).getTime()))) : new Date()
  const fechaFin =
    sale.length > 0 ? new Date(Math.max(...sale.map((v) => new Date(v.fecha).getTime()))) : new Date()

  const productosVendidos: Record<string, { nombre: string, cantidad: number, total: number }> = {}
  sale.forEach((venta) => {
    venta.items.forEach((item) => {
      if (!productosVendidos[item.nombre]) {
        productosVendidos[item.nombre] = {
          nombre: item.nombre,
          cantidad: 0,
          total: 0
        }
      }
      productosVendidos[item.nombre].cantidad += item.cantidad
      productosVendidos[item.nombre].total += item.precio * item.cantidad
    })
  })

  const productosOrdenados = Object.values(productosVendidos).sort((a, b) => b.total - a.total)

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>
          {AppConfig.APP_TITLE}
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          REPORTE DE HISTORIAL DE VENTAS
        </h2>
        <p>
          Período: {formatDate(fechaInicio)} - {formatDate(fechaFin)}
        </p>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Resumen</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Total de ventas:</span>
          <span>Bs. {totalVentas.toFixed(2)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Cantidad de transacciones:</span>
          <span>{cantidadVentas}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Promedio por venta:</span>
          <span>Bs. {(cantidadVentas > 0 ? totalVentas / cantidadVentas : 0).toFixed(2)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Productos más vendidos</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>Cantidad</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {productosOrdenados.slice(0, 5).map((producto, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{producto.nombre}</td>
                <td style={{ textAlign: 'center', padding: '0.5rem' }}>{producto.cantidad}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>Bs. {(producto.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Detalle de ventas</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Código</th>
              <th style={{ textAlign: 'left', padding: '0.5rem' }}>Fecha</th>
              <th style={{ textAlign: 'center', padding: '0.5rem' }}>Items</th>
              <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.map((venta) => (
              <tr key={venta.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '0.5rem' }}>{venta.id}</td>
                <td style={{ padding: '0.5rem' }}>{formatDate(venta.fecha)}</td>
                <td style={{ textAlign: 'center', padding: '0.5rem' }}>{venta.items.length}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>Bs. {(venta.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid #ddd', fontWeight: 'bold' }}>
              <td colSpan={3} style={{ textAlign: 'right', padding: '0.5rem' }}>
                TOTAL:
              </td>
              <td style={{ textAlign: 'right', padding: '0.5rem' }}>Bs. {(totalVentas).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
        <p>
          Generado el{' '}
          {new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}
