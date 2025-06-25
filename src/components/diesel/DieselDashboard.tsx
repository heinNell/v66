import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { 
  Fuel, 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Link, 
  FileText,
  TrendingDown,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import DieselImportModal from './DieselImportModal';
import DieselNormsModal from './DieselNormsModal';
import ManualDieselEntryModal from './ManualDieselEntryModal';
import ProbeVerificationModal from './ProbeVerificationModal';
import TripLinkageModal from './TripLinkageModal';
import DieselDebriefModal from './DieselDebriefModal';

const DieselDashboard: React.FC = () => {
  const { 
    dieselRecords, 
    addDieselRecord, 
    updateDieselRecord, 
    deleteDieselRecord,
    trips
  } = useAppContext();
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNormsModal, setShowNormsModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [showProbeVerificationModal, setShowProbeVerificationModal] = useState(false);
  const [showTripLinkageModal, setShowTripLinkageModal] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    fleetNumber: '',
    driver: '',
    dateRange: { start: '', end: '' },
    performanceStatus: '',
    fuelStation: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Diesel norms (efficiency standards)
  const [dieselNorms, setDieselNorms] = useState<any[]>([
    {
      fleetNumber: '6H',
      expectedKmPerLitre: 3.2,
      tolerancePercentage: 10,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System'
    },
    {
      fleetNumber: '26H',
      expectedKmPerLitre: 3.0,
      tolerancePercentage: 10,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System'
    },
    {
      fleetNumber: '6F',
      expectedKmPerLitre: 0,
      tolerancePercentage: 15,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'System',
      isReeferUnit: true,
      litresPerHour: 3.5
    }
  ]);
  
  // Load diesel norms from localStorage
  useEffect(() => {
    const savedNorms = localStorage.getItem('dieselNorms');
    if (savedNorms) {
      try {
        const parsedNorms = JSON.parse(savedNorms);
        setDieselNorms(parsedNorms);
      } catch (error) {
        console.error('Error parsing saved diesel norms:', error);
      }
    }
  }, []);
  
  // Process diesel records with efficiency calculations
  const processedRecords = dieselRecords.map(record => {
    // Find the norm for this fleet
    const norm = dieselNorms.find(n => n.fleetNumber === record.fleetNumber);
    
    let kmPerLitre = record.kmPerLitre;
    let efficiencyVariance = 0;
    let performanceStatus: 'poor' | 'normal' | 'excellent' = 'normal';
    let requiresDebrief = false;
    
    if (norm) {
      if (norm.isReeferUnit) {
        // For reefer units, calculate litres per hour
        const litresPerHour = record.hoursOperated ? record.litresFilled / record.hoursOperated : undefined;
        
        if (litresPerHour && norm.litresPerHour) {
          // Calculate variance (negative means using less fuel than expected, which is good)
          efficiencyVariance = ((litresPerHour - norm.litresPerHour) / norm.litresPerHour) * 100;
          
          // Determine performance status
          if (Math.abs(efficiencyVariance) <= norm.tolerancePercentage) {
            performanceStatus = 'normal';
          } else if (efficiencyVariance > 0) {
            performanceStatus = 'poor';
            requiresDebrief = true;
          } else {
            performanceStatus = 'excellent';
          }
        }
        
        return {
          ...record,
          litresPerHour,
          expectedLitresPerHour: norm.litresPerHour,
          efficiencyVariance,
          performanceStatus,
          requiresDebrief,
          toleranceRange: norm.tolerancePercentage
        };
      } else {
        // For regular trucks, calculate km per litre
        if (kmPerLitre && norm.expectedKmPerLitre) {
          // Calculate variance (positive means better than expected)
          efficiencyVariance = ((kmPerLitre - norm.expectedKmPerLitre) / norm.expectedKmPerLitre) * 100;
          
          // Determine performance status
          if (Math.abs(efficiencyVariance) <= norm.tolerancePercentage) {
            performanceStatus = 'normal';
          } else if (efficiencyVariance < 0) {
            performanceStatus = 'poor';
            requiresDebrief = true;
          } else {
            performanceStatus = 'excellent';
          }
        }
        
        return {
          ...record,
          expectedKmPerLitre: norm.expectedKmPerLitre,
          efficiencyVariance,
          performanceStatus,
          requiresDebrief,
          toleranceRange: norm.tolerancePercentage
        };
      }
    }
    
    return record;
  });
  
  // Apply filters
  const filteredRecords = processedRecords.filter(record => {
    if (filters.fleetNumber && record.fleetNumber !== filters.fleetNumber) return false;
    if (filters.driver && record.driverName !== filters.driver) return false;
    if (filters.dateRange.start && record.date < filters.dateRange.start) return false;
    if (filters.dateRange.end && record.date > filters.dateRange.end) return false;
    if (filters.performanceStatus && record.performanceStatus !== filters.performanceStatus) return false;
    if (filters.fuelStation && record.fuelStation !== filters.fuelStation) return false;
    return true;
  });
  
  // Sort records by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculate summary statistics
  const summary = {
    totalRecords: filteredRecords.length,
    totalLitres: filteredRecords.reduce((sum, r) => sum + r.litresFilled, 0),
    totalCostZAR: filteredRecords
      .filter(r => r.currency === 'ZAR' || !r.currency)
      .reduce((sum, r) => sum + r.totalCost, 0),
    totalCostUSD: filteredRecords
      .filter(r => r.currency === 'USD')
      .reduce((sum, r) => sum + r.totalCost, 0),
    avgKmPerLitre: filteredRecords
      .filter(r => r.kmPerLitre && !r.isReeferUnit)
      .reduce((sum, r, i, arr) => sum + (r.kmPerLitre || 0) / arr.length, 0),
    poorPerformance: filteredRecords.filter(r => r.performanceStatus === 'poor').length,
    excellentPerformance: filteredRecords.filter(r => r.performanceStatus === 'excellent').length,
    requiresDebrief: filteredRecords.filter(r => r.requiresDebrief).length
  };
  
  // Get unique values for filters
  const uniqueFleets = [...new Set(dieselRecords.map(r => r.fleetNumber))];
  const uniqueDrivers = [...new Set(dieselRecords.map(r => r.driverName))];
  const uniqueFuelStations = [...new Set(dieselRecords.map(r => r.fuelStation))];
  
  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    if (field.includes('dateRange')) {
      const [, dateField] = field.split('.');
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [dateField]: value
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      fleetNumber: '',
      driver: '',
      dateRange: { start: '', end: '' },
      performanceStatus: '',
      fuelStation: ''
    });
  };
  
  // Handle record selection for modals
  const handleProbeVerification = (id: string) => {
    setSelectedRecordId(id);
    setShowProbeVerificationModal(true);
  };
  
  const handleTripLinkage = (id: string) => {
    setSelectedRecordId(id);
    setShowTripLinkageModal(true);
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this diesel record? This action cannot be undone.')) {
      deleteDieselRecord(id);
    }
  };
  
  // Handle norms update
  const handleUpdateNorms = (updatedNorms: any[]) => {
    setDieselNorms(updatedNorms);
  };
  
  // Get records that need debriefing
  const recordsNeedingDebrief = processedRecords.filter(r => r.requiresDebrief);
  
  // Handle opening debrief modal
  const handleOpenDebrief = () => {
    setShowDebriefModal(true);
  };
  
  // Get performance status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Diesel Management Dashboard</h2>
          <p className="text-gray-600">Track fuel consumption, efficiency, and costs</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowNormsModal(true)}
            icon={<Settings className="w-4 h-4" />}
          >
            Configure Norms
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}
            icon={<Upload className="w-4 h-4" />}
          >
            Import Records
          </Button>
          <Button
            onClick={() => setShowManualEntryModal(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Diesel Record
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Diesel</p>
                <p className="text-2xl font-bold text-blue-600">{summary.totalLitres.toLocaleString()} L</p>
                <p className="text-xs text-gray-400">{summary.totalRecords} records</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Fuel className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <div>
                  {summary.totalCostZAR > 0 && (
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(summary.totalCostZAR, 'ZAR')}
                    </p>
                  )}
                  {summary.totalCostUSD > 0 && (
                    <p className="text-xl font-bold text-red-600">
                      {formatCurrency(summary.totalCostUSD, 'USD')}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <DollarSign className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Efficiency</p>
                <p className="text-2xl font-bold text-green-600">{summary.avgKmPerLitre.toFixed(2)} KM/L</p>
                <p className="text-xs text-gray-400">
                  {summary.excellentPerformance} excellent • {summary.poorPerformance} poor
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Debrief</p>
                <p className="text-2xl font-bold text-amber-600">{summary.requiresDebrief}</p>
                <p className="text-xs text-gray-400">
                  <button 
                    onClick={handleOpenDebrief}
                    className="text-blue-600 hover:underline"
                    disabled={summary.requiresDebrief === 0}
                  >
                    {summary.requiresDebrief > 0 ? 'Conduct Debrief' : 'No Debriefs Needed'}
                  </button>
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader title="Filter Diesel Records" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Fleet Number"
                value={filters.fleetNumber}
                onChange={(value) => handleFilterChange('fleetNumber', value)}
                options={[
                  { label: 'All Fleets', value: '' },
                  ...uniqueFleets.map(fleet => ({ label: fleet, value: fleet }))
                ]}
              />
              
              <Select
                label="Driver"
                value={filters.driver}
                onChange={(value) => handleFilterChange('driver', value)}
                options={[
                  { label: 'All Drivers', value: '' },
                  ...uniqueDrivers.map(driver => ({ label: driver, value: driver }))
                ]}
              />
              
              <Select
                label="Performance Status"
                value={filters.performanceStatus}
                onChange={(value) => handleFilterChange('performanceStatus', value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Poor', value: 'poor' },
                  { label: 'Normal', value: 'normal' },
                  { label: 'Excellent', value: 'excellent' }
                ]}
              />
              
              <Select
                label="Fuel Station"
                value={filters.fuelStation}
                onChange={(value) => handleFilterChange('fuelStation', value)}
                options={[
                  { label: 'All Stations', value: '' },
                  ...uniqueFuelStations.map(station => ({ label: station, value: station }))
                ]}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="From Date"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(value) => handleFilterChange('dateRange.start', value)}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(value) => handleFilterChange('dateRange.end', value)}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diesel Records */}
      <Card>
        <CardHeader 
          title={`Diesel Records (${sortedRecords.length})`}
          action={
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* Export functionality */}}
                icon={<Download className="w-4 h-4" />}
              >
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => setShowManualEntryModal(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Record
              </Button>
            </div>
          }
        />
        <CardContent>
          {sortedRecords.length === 0 ? (
            <div className="text-center py-8">
              <Fuel className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No diesel records found</h3>
              <p className="mt-1 text-gray-500">
                {Object.values(filters).some(f => f !== '' && f !== undefined) || 
                 (filters.dateRange.start !== '' || filters.dateRange.end !== '')
                  ? 'No records match your current filter criteria.'
                  : 'Start by adding your first diesel record or importing data.'}
              </p>
              {!Object.values(filters).some(f => f !== '' && f !== undefined) && 
               filters.dateRange.start === '' && filters.dateRange.end === '' && (
                <div className="mt-4 flex justify-center space-x-4">
                  <Button
                    onClick={() => setShowManualEntryModal(true)}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Diesel Record
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowImportModal(true)}
                    icon={<Upload className="w-4 h-4" />}
                  >
                    Import Records
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fleet
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KM Reading
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Litres
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRecords.map((record) => {
                    const isReeferUnit = record.isReeferUnit || ['4F', '5F', '6F', '7F', '8F'].includes(record.fleetNumber);
                    const hasProbe = ['22H', '23H', '24H', '26H', '28H', '31H', '30H'].includes(record.fleetNumber);
                    const isLinkedToTrip = record.tripId !== undefined;
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {record.fleetNumber}
                            </div>
                            {isReeferUnit && (
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Reefer
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.driverName}</div>
                          <div className="text-xs text-gray-500">{record.fuelStation}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {isReeferUnit ? (
                            <div className="text-sm text-gray-500">N/A</div>
                          ) : (
                            <div className="text-sm text-gray-900">{record.kmReading?.toLocaleString()}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{record.litresFilled.toFixed(1)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {isReeferUnit ? (
                            <div className="text-sm text-gray-900">
                              {record.litresPerHour?.toFixed(2) || 'N/A'} L/hr
                              <div className="text-xs text-gray-500">
                                Target: {record.expectedLitresPerHour?.toFixed(1) || '3.5'}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-900">
                              {record.kmPerLitre?.toFixed(2) || 'N/A'} KM/L
                              <div className="text-xs text-gray-500">
                                Target: {record.expectedKmPerLitre?.toFixed(1) || 'N/A'}
                              </div>
                            </div>
                          )}
                          {record.efficiencyVariance !== undefined && (
                            <div className={`text-xs ${
                              record.performanceStatus === 'poor' ? 'text-red-600' :
                              record.performanceStatus === 'excellent' ? 'text-green-600' :
                              'text-gray-500'
                            }`}>
                              {record.efficiencyVariance > 0 ? '+' : ''}
                              {record.efficiencyVariance.toFixed(1)}%
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(record.totalCost, record.currency || 'ZAR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(record.costPerLitre || (record.totalCost / record.litresFilled), record.currency || 'ZAR')}/L
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          {record.performanceStatus && (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.performanceStatus)}`}>
                              {record.performanceStatus.toUpperCase()}
                            </span>
                          )}
                          {record.requiresDebrief && (
                            <div className="mt-1">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                                NEEDS DEBRIEF
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-1">
                            {hasProbe && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => handleProbeVerification(record.id)}
                                title="Verify Probe Reading"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </Button>
                            )}
                            
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleTripLinkage(record.id)}
                              title={isLinkedToTrip ? "View Trip Linkage" : "Link to Trip"}
                            >
                              <Link className={`w-4 h-4 ${isLinkedToTrip ? 'text-blue-500' : 'text-gray-500'}`} />
                            </Button>
                            
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {/* View details */}}
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </Button>
                            
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => {/* Edit record */}}
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </Button>
                            
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleDelete(record.id)}
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Efficiency Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency by Fleet */}
        <Card>
          <CardHeader title="Efficiency by Fleet" />
          <CardContent>
            {sortedRecords.length > 0 ? (
              <div className="space-y-4">
                {/* Fleet efficiency chart would go here */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-700">
                    Fleet efficiency visualization would be displayed here, showing average KM/L by fleet number compared to targets.
                  </p>
                </div>
                
                {/* Fleet efficiency table */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fleet
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg KM/L
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variance
                      </th>
                      <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* This would be populated with fleet efficiency data */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">6H</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">3.1</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">3.2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600">-3.1%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          NORMAL
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">26H</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">2.6</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">3.0</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600">-13.3%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          POOR
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <TrendingUp className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No data available for efficiency analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Consumption Trends */}
        <Card>
          <CardHeader title="Consumption Trends" />
          <CardContent>
            {sortedRecords.length > 0 ? (
              <div className="space-y-4">
                {/* Consumption trend chart would go here */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm text-blue-700">
                    Consumption trend visualization would be displayed here, showing diesel usage over time.
                  </p>
                </div>
                
                {/* Monthly consumption summary */}
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Litres
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg KM/L
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost/KM
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* This would be populated with monthly consumption data */}
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Jan 2025</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">12,450</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">3.1</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">R230,325</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">R5.97</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Feb 2025</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">11,875</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">3.2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">R219,688</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">R5.78</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No data available for consumption trends</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <DieselImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
      
      <DieselNormsModal
        isOpen={showNormsModal}
        onClose={() => setShowNormsModal(false)}
        norms={dieselNorms}
        onUpdateNorms={handleUpdateNorms}
      />
      
      <ManualDieselEntryModal
        isOpen={showManualEntryModal}
        onClose={() => setShowManualEntryModal(false)}
      />
      
      {selectedRecordId && (
        <>
          <ProbeVerificationModal
            isOpen={showProbeVerificationModal}
            onClose={() => setShowProbeVerificationModal(false)}
            dieselRecordId={selectedRecordId}
          />
          
          <TripLinkageModal
            isOpen={showTripLinkageModal}
            onClose={() => setShowTripLinkageModal(false)}
            dieselRecordId={selectedRecordId}
          />
        </>
      )}
      
      <DieselDebriefModal
        isOpen={showDebriefModal}
        onClose={() => setShowDebriefModal(false)}
        records={recordsNeedingDebrief}
        norms={dieselNorms}
      />
    </div>
  );
};

export default DieselDashboard;