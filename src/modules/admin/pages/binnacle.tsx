import { useLogs } from '../hooks/useLogs'
import { LogsFilter } from '../components/LogsFilter'
import { LogsTable } from '../components/LogsTable'
import Pagination from '@/components/shared/pagination'

const Binnacle = () => {
  const {
    logs,
    isLoading,
    handleSearch,
    handleDateFilter,
    countData,
    filterOptions,
    newPage,
    prevPage,
    setOffset
  } = useLogs()

  return (
    <div className="mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logs</h1>
        <p className="text-muted-foreground">
          Aquí puedes ver los registros de actividad del sistema, incluyendo acciones de usuarios, errores y eventos importantes. Utiliza los filtros para buscar registros específicos por fecha o palabra clave.
        </p>
      </div>

      <LogsFilter
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
      />

      <LogsTable logs={logs} isLoading={isLoading} />

      <Pagination
        allItems={countData ?? 0}
        currentItems={logs?.length ?? 0}
        limit={filterOptions.limit}
        newPage={() => { newPage(countData ?? 0) }}
        offset={filterOptions.offset}
        prevPage={prevPage}
        setOffset={setOffset}
        setLimit={() => { }}
        params={true}
      />
    </div>
  )
}

export default Binnacle
