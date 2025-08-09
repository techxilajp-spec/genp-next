"use client"

import { useState } from "react"
import { Calendar, Filter, X, SortAsc, SortDesc } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"

export interface FilterState {
  search: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
  status: string[]
  priority: string[]
  category: string[]
  user: string[]
  customFilters?: Record<string, string[]>
}

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  options: {
    sortOptions: FilterOption[]
    statusOptions?: FilterOption[]
    priorityOptions?: FilterOption[]
    categoryOptions?: FilterOption[]
    userOptions?: FilterOption[]
  }
  showFilters?: {
    search?: boolean
    dateRange?: boolean
    sort?: boolean
    status?: boolean
    priority?: boolean
    category?: boolean
    user?: boolean
  }
  placeholder?: string
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  options,
  showFilters = {
    search: true,
    dateRange: true,
    sort: true,
    status: true,
    priority: true,
    category: true,
    user: true
  },
  placeholder = "Search..."
}: AdvancedFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      dateRange: { from: undefined, to: undefined },
      sortBy: options.sortOptions[0]?.value || '',
      sortOrder: 'desc',
      status: [],
      priority: [],
      category: [],
      user: []
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.status.length > 0) count++
    if (filters.priority.length > 0) count++
    if (filters.category.length > 0) count++
    if (filters.user.length > 0) count++
    return count
  }

  const toggleArrayFilter = (filterKey: keyof FilterState, value: string) => {
    const currentArray = filters[filterKey] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilters({ [filterKey]: newArray })
  }

  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'search':
        updateFilters({ search: '' })
        break
      case 'dateRange':
        updateFilters({ dateRange: { from: undefined, to: undefined } })
        break
      case 'status':
      case 'priority':
      case 'category':
      case 'user':
        if (value) {
          const currentArray = filters[filterType as keyof FilterState] as string[]
          updateFilters({ [filterType]: currentArray.filter(item => item !== value) })
        }
        break
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
        {showFilters.search && (
          <div className="flex-1">
            <Input
              placeholder={placeholder}
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          {showFilters.sort && (
            <div className="flex items-center space-x-2">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilters({ sortBy: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {options.sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({ 
                  sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                })}
                className="px-2"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
                  >
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Advanced Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear All
                  </Button>
                </div>

                <Separator />

                {/* Date Range Filter */}
                {showFilters.dateRange && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            filters.dateRange.to ? (
                              <>
                                {filters.dateRange.from.toLocaleDateString()} -{" "}
                                {filters.dateRange.to.toLocaleDateString()}
                              </>
                            ) : (
                              filters.dateRange.from.toLocaleDateString()
                            )
                          ) : (
                            "Pick a date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={filters.dateRange.from}
                          selected={{
                            from: filters.dateRange.from,
                            to: filters.dateRange.to,
                          }}
                          onSelect={(range) => 
                            updateFilters({ 
                              dateRange: { 
                                from: range?.from, 
                                to: range?.to 
                              } 
                            })
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Status Filter */}
                {showFilters.status && options.statusOptions && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Status</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {options.statusOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${option.value}`}
                            checked={filters.status.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('status', option.value)}
                          />
                          <Label 
                            htmlFor={`status-${option.value}`}
                            className="text-xs flex-1 cursor-pointer"
                          >
                            {option.label}
                            {option.count && (
                              <span className="text-slate-400 ml-1">({option.count})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Filter */}
                {showFilters.priority && options.priorityOptions && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Priority</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {options.priorityOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${option.value}`}
                            checked={filters.priority.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('priority', option.value)}
                          />
                          <Label 
                            htmlFor={`priority-${option.value}`}
                            className="text-xs flex-1 cursor-pointer"
                          >
                            {option.label}
                            {option.count && (
                              <span className="text-slate-400 ml-1">({option.count})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Filter */}
                {showFilters.category && options.categoryOptions && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">Category</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {options.categoryOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${option.value}`}
                            checked={filters.category.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('category', option.value)}
                          />
                          <Label 
                            htmlFor={`category-${option.value}`}
                            className="text-xs flex-1 cursor-pointer"
                          >
                            {option.label}
                            {option.count && (
                              <span className="text-slate-400 ml-1">({option.count})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Filter */}
                {showFilters.user && options.userOptions && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-700">User</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {options.userOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${option.value}`}
                            checked={filters.user.includes(option.value)}
                            onCheckedChange={() => toggleArrayFilter('user', option.value)}
                          />
                          <Label 
                            htmlFor={`user-${option.value}`}
                            className="text-xs flex-1 cursor-pointer"
                          >
                            {option.label}
                            {option.count && (
                              <span className="text-slate-400 ml-1">({option.count})</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-600">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('search')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="text-xs">
              Date: {filters.dateRange.from?.toLocaleDateString()} - {filters.dateRange.to?.toLocaleDateString()}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('dateRange')}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}

          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              Status: {options.statusOptions?.find(opt => opt.value === status)?.label || status}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('status', status)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}

          {filters.priority.map((priority) => (
            <Badge key={priority} variant="secondary" className="text-xs">
              Priority: {options.priorityOptions?.find(opt => opt.value === priority)?.label || priority}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('priority', priority)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}

          {filters.category.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              Category: {options.categoryOptions?.find(opt => opt.value === category)?.label || category}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('category', category)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}

          {filters.user.map((user) => (
            <Badge key={user} variant="secondary" className="text-xs">
              User: {options.userOptions?.find(opt => opt.value === user)?.label || user}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeFilter('user', user)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
