import { formatDate } from '@/modules/sales/pages/sales'
import type React from 'react'

import { useRef } from 'react'

interface PrintOptions {
  content: () => React.ReactInstance | null
  documentTitle?: string
  onBeforeGetContent?: () => Promise<void>
  onBeforePrint?: () => Promise<void>
  onAfterPrint?: () => void
  removeAfterPrint?: boolean
}

export function useReactToPrint({
  content,
  documentTitle = 'Impresión',
  onBeforeGetContent = async () => { },
  onBeforePrint = async () => { },
  onAfterPrint = () => { },
  removeAfterPrint = false
}: PrintOptions) {
  const printFrameRef = useRef<HTMLIFrameElement | null>(null)

  const handlePrint = async () => {
    const contentElement = content()

    if (!contentElement) {
      console.error('No se pudo encontrar el contenido para imprimir')
      return
    }

    await onBeforeGetContent()
    await onBeforePrint()

    const printWindow = document.createElement('iframe')
    printWindow.style.position = 'absolute'
    printWindow.style.top = '-999999px'
    printWindow.style.left = '-999999px'
    document.body.appendChild(printWindow)
    printFrameRef.current = printWindow

    const printDocument = printWindow.contentDocument
    if (!printDocument) return

    printDocument.open()

    let htmlContent = '<!DOCTYPE html><html><head>'

    htmlContent += `<title>${documentTitle}</title>`

    const styles = Array.from(document.styleSheets)
    styles.forEach((styleSheet) => {
      try {
        if (styleSheet.cssRules) {
          htmlContent += '<style>'
          Array.from(styleSheet.cssRules).forEach((rule) => {
            htmlContent += rule.cssText
          })
          htmlContent += '</style>'
        }
      } catch (e) {
        // Ignorar errores de CORS
      }
    })

    htmlContent += '</head><body>'

    const contentNode = contentElement as unknown as HTMLElement
    htmlContent += contentNode.outerHTML

    htmlContent += '</body></html>'

    printDocument.write(htmlContent)
    printDocument.close()

    setTimeout(() => {
      printWindow.focus()
      printWindow.contentWindow?.print()

      setTimeout(() => {
        if (removeAfterPrint && printFrameRef.current) {
          document.body.removeChild(printFrameRef.current)
          printFrameRef.current = null
        }
        onAfterPrint()
      }, 500)
    }, 500)
  }

  return handlePrint
}

/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Convierte un array de objetos a formato Excel (XLSX) y lo descarga como archivo
 * @param data Array de objetos a convertir
 * @param filename Nombre del archivo a descargar
 * @param headers Objeto con mapeo de cabeceras (opcional)
 */
export function exportToExcel(data: Array<Record<string, any>>, filename: string, headers?: Record<string, string>) {
  if (!data?.length) {
    console.error('No hay datos para exportar')
    return
  }

  // Obtener las cabeceras del primer objeto si no se proporcionan
  const headerKeys = headers ? Object.keys(headers) : Object.keys(data[0])
  const headerValues = headers ? Object.values(headers) : headerKeys

  // Crear contenido Excel (HTML que Excel puede abrir)
  let excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Hoja1</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table, td, th {
          border: 1px solid #000000;
          border-collapse: collapse;
        }
        td, th {
          padding: 5px;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${headerValues.map((header) => `<th>${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `

  // Añadir filas de datos
  data.forEach((item) => {
    excelContent += '<tr>'
    headerKeys.forEach((key) => {
      const value = item[key]
      // Formatear valores especiales
      if (value === null || value === undefined) {
        excelContent += '<td></td>'
      } else if (value instanceof Date) {
        excelContent += `<td>${formatDateForExcel(value)}</td>`
      } else if (typeof value === 'number') {
        // Formatear números con 2 decimales si es necesario
        excelContent += `<td x:num>${value}</td>`
      } else {
        // Escapar HTML para texto
        excelContent += `<td>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`
      }
    })
    excelContent += '</tr>'
  })

  excelContent += `
        </tbody>
      </table>
    </body>
    </html>
  `

  // Crear blob y descargar
  const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' })
  downloadBlob(blob, `${filename}.xls`)
}

/**
 * Convierte un array de objetos a formato CSV para Google Sheets y lo descarga
 * @param data Array de objetos a convertir
 * @param filename Nombre del archivo a descargar
 * @param headers Objeto con mapeo de cabeceras (opcional)
 */
export function exportToGoogleSheets(data: Array<Record<string, any>>, filename: string, headers?: Record<string, string>) {
  if (!data?.length) {
    console.error('No hay datos para exportar')
    return
  }

  // Obtener las cabeceras del primer objeto si no se proporcionan
  const headerKeys = headers ? Object.keys(headers) : Object.keys(data[0])
  const headerValues = headers ? Object.values(headers) : headerKeys

  // Crear contenido CSV
  let csvContent = ''

  // Añadir cabeceras
  csvContent += headerValues.map(escapeCSVField).join(',') + '\n'

  // Añadir filas de datos
  data.forEach((item) => {
    const row = headerKeys
      .map((key) => {
        const value = item[key]
        // Formatear valores especiales
        if (value === null || value === undefined) return ''
        if (value instanceof Date) {
          return escapeCSVField(formatDateForGoogleSheets(value))
        }
        if (typeof value === 'number') {
          return value.toString()
        }
        return escapeCSVField(String(value))
      })
      .join(',')
    csvContent += row + '\n'
  })

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * Escapa un campo para formato CSV
 */
function escapeCSVField(field: string): string {
  // Si el campo contiene comas, comillas o saltos de línea, lo encerramos en comillas
  if (/[",\n\r]/.test(field)) {
    // Escapar comillas duplicándolas
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

/**
 * Exporta un historial de ventas a Google Sheets
 * @param ventas Array de ventas
 * @param includeItems Si se deben incluir los items de cada venta
 */
export function exportVentasToGoogleSheets(
  ventas: Array<{
    id: string
    fecha: Date
    total: number
    items: Array<{
      id: number
      nombre: string
      precio: number
      cantidad: number
    }>
  }>,
  includeItems = false
) {
  if (!ventas.length) return

  if (includeItems) {
    // Exportar con detalle de productos
    const flatData: Array<{
      id_venta: string
      fecha: Date
      producto: string
      cantidad: number
      precio_unitario: number
      subtotal: number
    }> = []

    ventas.forEach((venta) => {
      venta.items.forEach((item) => {
        flatData.push({
          id_venta: venta.id,
          fecha: venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha),
          producto: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad
        })
      })
    })

    const headers = {
      id_venta: 'Codigo',
      fecha: 'Fecha',
      producto: 'Producto',
      cantidad: 'Cantidad',
      precio_unitario: 'Precio Unitario',
      subtotal: 'Subtotal'
    }

    exportToGoogleSheets(flatData, 'ventas_detallado_' + formatDate(new Date()), headers)
  } else {
    // Exportar solo resumen de ventas
    const data = ventas.map((venta) => ({
      id: venta.id,
      fecha: venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha),
      productos: venta.items.length,
      items_totales: venta.items.reduce((sum, item) => sum + item.cantidad, 0),
      total: venta.total
    }))

    const headers = {
      id: 'Codigo',
      fecha: 'Fecha',
      productos: 'Tipos de Productos',
      items_totales: 'Cantidad Total',
      total: 'Total (Bs.)'
    }

    exportToGoogleSheets(data, 'ventas_resumen_' + formatDate(new Date()), headers)
  }
}

/**
 * Exporta un historial de ventas a Excel
 * @param ventas Array de ventas
 * @param includeItems Si se deben incluir los items de cada venta
 */
export function exportVentasToExcel(
  ventas: Array<{
    id: string
    fecha: Date
    total: number
    items: Array<{
      id: number
      nombre: string
      precio: number
      cantidad: number
    }>
  }>,
  includeItems = false
) {
  if (!ventas.length) return

  if (includeItems) {
    // Exportar con detalle de productos
    const flatData: Array<{
      id_venta: string
      fecha: Date
      producto: string
      cantidad: number
      precio_unitario: number
      subtotal: number
    }> = []

    ventas.forEach((venta) => {
      venta.items.forEach((item) => {
        flatData.push({
          id_venta: venta.id,
          fecha: venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha),
          producto: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad
        })
      })
    })

    const headers = {
      id_venta: 'Codigo',
      fecha: 'Fecha',
      producto: 'Producto',
      cantidad: 'Cantidad',
      precio_unitario: 'Precio Unitario',
      subtotal: 'Subtotal'
    }

    exportToExcel(flatData, 'ventas_detallado_' + formatDate(new Date()), headers)
  } else {
    // Exportar solo resumen de ventas
    const data = ventas.map((venta) => ({
      id: venta.id,
      fecha: venta.fecha instanceof Date ? venta.fecha : new Date(venta.fecha),
      productos: venta.items.length,
      items_totales: venta.items.reduce((sum, item) => sum + item.cantidad, 0),
      total: venta.total
    }))

    const headers = {
      id: 'Codigo',
      fecha: 'Fecha',
      productos: 'Tipos de Productos',
      items_totales: 'Cantidad Total',
      total: 'Total (Bs.)'
    }

    exportToExcel(data, 'ventas_resumen_' + formatDate(new Date()), headers)
  }
}

/**
 * Formatea una fecha para Excel
 */
function formatDateForExcel(date: Date): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Formatea una fecha para Google Sheets (formato ISO)
 */
function formatDateForGoogleSheets(date: Date): string {
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

/**
 * Descarga un Blob como archivo
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
