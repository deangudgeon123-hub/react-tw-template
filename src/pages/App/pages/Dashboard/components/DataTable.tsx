'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Separator } from '@radix-ui/react-separator'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CircleCheckIcon,
  Columns3CogIcon,
  EllipsisVerticalIcon,
  GripVerticalIcon,
  LoaderIcon,
  PlusIcon,
  TrendingUpIcon,
} from 'lucide-react'
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'
import { z } from 'zod'

import { UiBadge } from '@/ui/UiBadge'
import { UiButton } from '@/ui/UiButton'
import {
  ChartConfig,
  UiChartContainer,
  UiChartTooltip,
  UiChartTooltipContent,
} from '@/ui/UiChart'
import { UiCheckbox } from '@/ui/UiCheckbox'
import {
  UiDrawer,
  UiDrawerClose,
  UiDrawerContent,
  UiDrawerDescription,
  UiDrawerFooter,
  UiDrawerHeader,
  UiDrawerTitle,
  UiDrawerTrigger,
} from '@/ui/UiDrawer'
import {
  UiDropdownMenu,
  UiDropdownMenuCheckboxItem,
  UiDropdownMenuContent,
  UiDropdownMenuItem,
  UiDropdownMenuSeparator,
  UiDropdownMenuTrigger,
} from '@/ui/UiDropdownMenu'
import { UiInput } from '@/ui/UiInput'
import { UiLabel } from '@/ui/UiLabel'
import {
  UiSelect,
  UiSelectContent,
  UiSelectItem,
  UiSelectTrigger,
  UiSelectValue,
} from '@/ui/UiSelect'
import { useUiSidebar } from '@/ui/UiSidebar'
import {
  UiTable,
  UiTableBody,
  UiTableCell,
  UiTableHead,
  UiTableHeader,
  UiTableRow,
} from '@/ui/UiTable'
import { UiTabs, UiTabsContent, UiTabsList, UiTabsTrigger } from '@/ui/UiTabs'

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <UiButton
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='text-muted-foreground size-7 hover:bg-transparent'
    >
      <GripVerticalIcon className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </UiButton>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <UiCheckbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <UiCheckbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'header',
    header: 'Header',
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Section Type',
    cell: ({ row }) => (
      <div className='w-32'>
        <UiBadge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.type}
        </UiBadge>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <UiBadge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'Done' ? (
          <CircleCheckIcon className='fill-green-500 dark:fill-green-400' />
        ) : (
          <LoaderIcon />
        )}
        {row.original.status}
      </UiBadge>
    ),
  },
  {
    accessorKey: 'target',
    header: () => <div className='w-full text-right'>Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={e => {
          e.preventDefault()
          toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: 'Done',
            error: 'Error',
          })
        }}
      >
        <UiLabel htmlFor={`${row.original.id}-target`} className='sr-only'>
          Target
        </UiLabel>
        <UiInput
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: 'limit',
    header: () => <div className='w-full text-right'>Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={e => {
          e.preventDefault()
          toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: 'Done',
            error: 'Error',
          })
        }}
      >
        <UiLabel htmlFor={`${row.original.id}-limit`} className='sr-only'>
          Limit
        </UiLabel>
        <UiInput
          className='hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent'
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: 'reviewer',
    header: 'Reviewer',
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== 'Assign reviewer'

      if (isAssigned) {
        return row.original.reviewer
      }

      return (
        <>
          <UiLabel htmlFor={`${row.original.id}-reviewer`} className='sr-only'>
            Reviewer
          </UiLabel>
          <UiSelect>
            <UiSelectTrigger
              className='w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate'
              size='sm'
              id={`${row.original.id}-reviewer`}
            >
              <UiSelectValue placeholder='Assign reviewer' />
            </UiSelectTrigger>
            <UiSelectContent align='end'>
              <UiSelectItem value='Eddie Lake'>Eddie Lake</UiSelectItem>
              <UiSelectItem value='Jamik Tashpulatov'>
                Jamik Tashpulatov
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </>
      )
    },
  },
  {
    id: 'actions',
    cell: () => (
      <UiDropdownMenu>
        <UiDropdownMenuTrigger asChild>
          <UiButton
            variant='ghost'
            className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
            size='icon'
          >
            <EllipsisVerticalIcon />
            <span className='sr-only'>Open menu</span>
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align='end' className='w-32'>
          <UiDropdownMenuItem>Edit</UiDropdownMenuItem>
          <UiDropdownMenuItem>Make a copy</UiDropdownMenuItem>
          <UiDropdownMenuItem>Favorite</UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem variant='destructive'>Delete</UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <UiTableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map(cell => (
        <UiTableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </UiTableCell>
      ))}
    </UiTableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: row => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData(data => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <UiTabs
      defaultValue='outline'
      className='text-foreground w-full flex-col justify-start gap-6'
    >
      <div className='flex items-center justify-between px-4 lg:px-6'>
        <UiLabel htmlFor='view-selector' className='sr-only'>
          View
        </UiLabel>
        <UiSelect defaultValue='outline'>
          <UiSelectTrigger
            className='flex w-fit @4xl/main:hidden'
            size='sm'
            id='view-selector'
          >
            <UiSelectValue placeholder='Select a view' />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem value='outline'>Outline</UiSelectItem>
            <UiSelectItem value='past-performance'>
              Past Performance
            </UiSelectItem>
            <UiSelectItem value='key-personnel'>Key Personnel</UiSelectItem>
            <UiSelectItem value='focus-documents'>Focus Documents</UiSelectItem>
          </UiSelectContent>
        </UiSelect>
        <UiTabsList className='**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex'>
          <UiTabsTrigger value='outline'>Outline</UiTabsTrigger>
          <UiTabsTrigger value='past-performance'>
            Past Performance <UiBadge variant='secondary'>3</UiBadge>
          </UiTabsTrigger>
          <UiTabsTrigger value='key-personnel'>
            Key Personnel <UiBadge variant='secondary'>2</UiBadge>
          </UiTabsTrigger>
          <UiTabsTrigger value='focus-documents'>Focus Documents</UiTabsTrigger>
        </UiTabsList>
        <div className='flex items-center gap-2'>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger asChild>
              <UiButton variant='outline' size='sm'>
                <Columns3CogIcon />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <ChevronDownIcon />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter(
                  column =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide(),
                )
                .map(column => {
                  return (
                    <UiDropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </UiDropdownMenuCheckboxItem>
                  )
                })}
            </UiDropdownMenuContent>
          </UiDropdownMenu>
          <UiButton variant='outline' size='sm'>
            <PlusIcon />
            <span className='hidden lg:inline'>Add Section</span>
          </UiButton>
        </div>
      </div>
      <UiTabsContent
        value='outline'
        className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'
      >
        <div className='overflow-hidden rounded-lg border'>
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <UiTable>
              <UiTableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map(headerGroup => (
                  <UiTableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      return (
                        <UiTableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </UiTableHead>
                      )
                    })}
                  </UiTableRow>
                ))}
              </UiTableHeader>
              <UiTableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map(row => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <UiTableRow>
                    <UiTableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </UiTableCell>
                  </UiTableRow>
                )}
              </UiTableBody>
            </UiTable>
          </DndContext>
        </div>
        <div className='flex items-center justify-between px-4'>
          <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className='flex w-full items-center gap-8 lg:w-fit'>
            <div className='hidden items-center gap-2 lg:flex'>
              <UiLabel htmlFor='rows-per-page' className='text-sm font-medium'>
                Rows per page
              </UiLabel>
              <UiSelect
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={value => {
                  table.setPageSize(Number(value))
                }}
              >
                <UiSelectTrigger size='sm' className='w-20' id='rows-per-page'>
                  <UiSelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </UiSelectTrigger>
                <UiSelectContent side='top'>
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <UiSelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </UiSelectItem>
                  ))}
                </UiSelectContent>
              </UiSelect>
            </div>
            <div className='flex w-fit items-center justify-center text-sm font-medium'>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
              <UiButton
                variant='outline'
                className='hidden h-8 w-8 p-0 lg:flex'
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to first page</span>
                <ChevronsLeftIcon />
              </UiButton>
              <UiButton
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon />
              </UiButton>
              <UiButton
                variant='outline'
                className='size-8'
                size='icon'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon />
              </UiButton>
              <UiButton
                variant='outline'
                className='hidden size-8 lg:flex'
                size='icon'
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className='sr-only'>Go to last page</span>
                <ChevronsRightIcon />
              </UiButton>
            </div>
          </div>
        </div>
      </UiTabsContent>
      <UiTabsContent
        value='past-performance'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </UiTabsContent>
      <UiTabsContent
        value='key-personnel'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </UiTabsContent>
      <UiTabsContent
        value='focus-documents'
        className='flex flex-col px-4 lg:px-6'
      >
        <div className='aspect-video w-full flex-1 rounded-lg border border-dashed'></div>
      </UiTabsContent>
    </UiTabs>
  )
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const { isMobile } = useUiSidebar()

  return (
    <UiDrawer direction={isMobile ? 'bottom' : 'right'}>
      <UiDrawerTrigger asChild>
        <UiButton
          variant='link'
          className='text-foreground w-fit px-0 text-left'
        >
          {item.header}
        </UiButton>
      </UiDrawerTrigger>
      <UiDrawerContent>
        <UiDrawerHeader className='gap-1'>
          <UiDrawerTitle>{item.header}</UiDrawerTitle>
          <UiDrawerDescription>
            Showing total visitors for the last 6 months
          </UiDrawerDescription>
        </UiDrawerHeader>
        <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
          {!isMobile && (
            <>
              <UiChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='month'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={value => value.slice(0, 3)}
                    hide
                  />
                  <UiChartTooltip
                    cursor={false}
                    content={props => (
                      <UiChartTooltipContent {...props} indicator='dot' />
                    )}
                  />
                  <Area
                    dataKey='mobile'
                    type='natural'
                    fill='var(--color-mobile)'
                    fillOpacity={0.6}
                    stroke='var(--color-mobile)'
                    stackId='a'
                  />
                  <Area
                    dataKey='desktop'
                    type='natural'
                    fill='var(--color-desktop)'
                    fillOpacity={0.4}
                    stroke='var(--color-desktop)'
                    stackId='a'
                  />
                </AreaChart>
              </UiChartContainer>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex gap-2 leading-none font-medium'>
                  Trending up by 5.2% this month{' '}
                  <TrendingUpIcon className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <UiLabel htmlFor='header'>Header</UiLabel>
              <UiInput id='header' defaultValue={item.header} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <UiLabel htmlFor='type'>Type</UiLabel>
                <UiSelect defaultValue={item.type}>
                  <UiSelectTrigger id='type' className='w-full'>
                    <UiSelectValue placeholder='Select a type' />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem value='Table of Contents'>
                      Table of Contents
                    </UiSelectItem>
                    <UiSelectItem value='Executive Summary'>
                      Executive Summary
                    </UiSelectItem>
                    <UiSelectItem value='Technical Approach'>
                      Technical Approach
                    </UiSelectItem>
                    <UiSelectItem value='Design'>Design</UiSelectItem>
                    <UiSelectItem value='Capabilities'>
                      Capabilities
                    </UiSelectItem>
                    <UiSelectItem value='Focus Documents'>
                      Focus Documents
                    </UiSelectItem>
                    <UiSelectItem value='Narrative'>Narrative</UiSelectItem>
                    <UiSelectItem value='Cover Page'>Cover Page</UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </div>
              <div className='flex flex-col gap-3'>
                <UiLabel htmlFor='status'>Status</UiLabel>
                <UiSelect defaultValue={item.status}>
                  <UiSelectTrigger id='status' className='w-full'>
                    <UiSelectValue placeholder='Select a status' />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem value='Done'>Done</UiSelectItem>
                    <UiSelectItem value='In Progress'>In Progress</UiSelectItem>
                    <UiSelectItem value='Not Started'>Not Started</UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <UiLabel htmlFor='target'>Target</UiLabel>
                <UiInput id='target' defaultValue={item.target} />
              </div>
              <div className='flex flex-col gap-3'>
                <UiLabel htmlFor='limit'>Limit</UiLabel>
                <UiInput id='limit' defaultValue={item.limit} />
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <UiLabel htmlFor='reviewer'>Reviewer</UiLabel>
              <UiSelect defaultValue={item.reviewer}>
                <UiSelectTrigger id='reviewer' className='w-full'>
                  <UiSelectValue placeholder='Select a reviewer' />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem value='Eddie Lake'>Eddie Lake</UiSelectItem>
                  <UiSelectItem value='Jamik Tashpulatov'>
                    Jamik Tashpulatov
                  </UiSelectItem>
                  <UiSelectItem value='Emily Whalen'>Emily Whalen</UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </div>
          </form>
        </div>
        <UiDrawerFooter>
          <UiButton>Submit</UiButton>
          <UiDrawerClose asChild>
            <UiButton variant='outline'>Done</UiButton>
          </UiDrawerClose>
        </UiDrawerFooter>
      </UiDrawerContent>
    </UiDrawer>
  )
}
