import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { type Log } from '../models/log.model'
import Skeleton from '@/components/shared/skeleton'

interface LogsTableProps {
  logs: Log[]
  isLoading: boolean
}

export const LogsTable: React.FC<LogsTableProps> = ({ logs, isLoading }) => {
  // Función para formatear la fecha
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Fecha no disponible'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible'
      }

      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      console.error('Error al formatear la fecha:', error)
      return 'Fecha no válida'
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <Skeleton />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Dirección IP</TableHead>
            <TableHead>Acción</TableHead>
            <TableHead>Método</TableHead>
            <TableHead>Path</TableHead>

            <TableHead>Fecha y Hora</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs?.length === 0
            ? (<TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No hay registros en la bitácora</TableCell></TableRow>)
            : (
                logs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.metadata.method}</TableCell>
                <TableCell>{log.metadata.url}</TableCell>
                <TableCell>
                  {formatDate(log.timestamp as string || log.createdAt as string)}
                </TableCell>
              </TableRow>
                ))
              )}
        </TableBody>
      </Table>
    </Card>
  )
}
