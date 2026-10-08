import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Trash2,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useShipments } from '../context/ShipmentContext';
import { useCustomers } from '../context/CustomerContext';
import StatusBadge, { getStatusConfig } from '../components/StatusBadge';

const Shipments = () => {
  const { allCustomers } = useCustomers();
  const {
    shipments,
    allShipments,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    loading,
    error,
    loadShipments,
    addShipment,
    editShipment,
    removeShipment,
    generateTrackingNumber
  } = useShipments();

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    trackingNumber: '',
    senderName: '',
    receiverName: '',
    pickupAddress: '',
    deliveryAddress: '',
    parcelWeight: '2.5 kg',
    parcelType: 'Express Parcel',
    shippingDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    deliveryStatus: 'Pending'
  });

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetTracking, setDeleteTargetTracking] = useState('');

  // Computed Real-Time Status Counters
  const liveInTransitCount = allShipments.filter((s) => s.deliveryStatus === 'In Transit').length;
  const liveDeliveredCount = allShipments.filter((s) => s.deliveryStatus === 'Delivered').length;
  const livePendingCount = allShipments.filter((s) => s.deliveryStatus === 'Pending').length;

  // Auto-fill pickup address when API sender customer selected
  const handleSenderChange = (val) => {
    const matched = allCustomers.find((c) => c.customerName === val);
    setCreateFormData((prev) => ({
      ...prev,
      senderName: val,
      pickupAddress: matched
        ? `${matched.address}, ${matched.city} - ${matched.postalCode}`
        : prev.pickupAddress
    }));
  };

  // Auto-fill delivery address when API receiver customer selected
  const handleReceiverChange = (val) => {
    const matched = allCustomers.find((c) => c.customerName === val);
    setCreateFormData((prev) => ({
      ...prev,
      receiverName: val,
      deliveryAddress: matched
        ? `${matched.address}, ${matched.city} - ${matched.postalCode}`
        : prev.deliveryAddress
    }));
  };

  // Handle Open Create Modal
  const handleOpenCreateModal = () => {
    const defaultSender = allCustomers[0]?.customerName || '';
    const defaultReceiver = allCustomers[1]?.customerName || '';
    const defaultPickup = allCustomers[0]
      ? `${allCustomers[0].address}, ${allCustomers[0].city} - ${allCustomers[0].postalCode}`
      : '';
    const defaultDelivery = allCustomers[1]
      ? `${allCustomers[1].address}, ${allCustomers[1].city} - ${allCustomers[1].postalCode}`
      : '';

    setCreateFormData({
      trackingNumber: generateTrackingNumber(),
      senderName: defaultSender,
      receiverName: defaultReceiver,
      pickupAddress: defaultPickup,
      deliveryAddress: defaultDelivery,
      parcelWeight: '2.5 kg',
      parcelType: 'Express Parcel',
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      deliveryStatus: 'Pending'
    });
    setShowCreateModal(true);
  };

  // Submit Create Shipment
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const success = await addShipment(createFormData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (shipment) => {
    setEditingId(shipment.id);
    setEditFormData({ ...shipment });
    setShowEditModal(true);
  };

  // Submit Edit Shipment
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const success = await editShipment(editingId, editFormData);
    if (success) {
      setShowEditModal(false);
      setEditingId(null);
    }
  };

  // Handle Inline Live Status Change
  const handleInlineStatusChange = async (shipment, newStatus) => {
    await editShipment(shipment.id, { ...shipment, deliveryStatus: newStatus });
  };

  // Handle Open Delete Modal
  const handleOpenDeleteModal = (shipment) => {
    setDeleteTargetId(shipment.id);
    setDeleteTargetTracking(shipment.trackingNumber);
    setShowDeleteModal(true);
  };

  // Confirm Delete Shipment
  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      await removeShipment(deleteTargetId);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EBEFF4] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* CLEAN CONTROL HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#0B2E8C] text-white text-[11px] font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Courier Dispatch Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shipment Tracking & Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Real-time parcel creation, live route tracking, instant status dispatch updates, and multi-filter controls.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleOpenCreateModal}
              className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 bg-[#0B2E8C] hover:bg-[#082269] text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg shadow-[#0B2E8C]/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" /> Create New Shipment
            </button>
          </div>
        </div>

        {/* REAL-TIME LIVE COUNTER STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Parcels</span>
              <h4 className="text-xl font-black text-slate-900">{allShipments.length}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B2E8C] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live In Transit</span>
              <h4 className="text-xl font-black text-blue-600">{liveInTransitCount}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Delivered</span>
              <h4 className="text-xl font-black text-emerald-600">{liveDeliveredCount}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending</span>
              <h4 className="text-xl font-black text-amber-600">{livePendingCount}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SEARCH, FILTER & SORT CONTROL BAR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search Tracking #, Sender, Receiver..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
              />
            </div>

            {/* Filter by Shipment Type */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
              >
                <option value="All">All Parcel Types</option>
                <option value="Express Parcel">Express Parcel</option>
                <option value="Standard Parcel">Standard Parcel</option>
                <option value="Heavy Cargo">Heavy Cargo</option>
                <option value="Document Express">Document Express</option>
              </select>
            </div>

            {/* Filter by Delivery Status */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
              >
                <option value="All">All Delivery Statuses (7 Types)</option>
                <option value="Pending">🟡 Pending</option>
                <option value="Picked Up">🩵 Picked Up</option>
                <option value="In Transit">🔵 In Transit</option>
                <option value="Out for Delivery">🟣 Out for Delivery</option>
                <option value="Delivered">🟢 Delivered</option>
                <option value="Cancelled">⚪ Cancelled</option>
                <option value="Failed Delivery">⚠️ Failed Delivery</option>
              </select>
            </div>

            {/* Sort By Date / Weight */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
              >
                <option value="newest">Shipping Date: Newest First</option>
                <option value="oldest">Shipping Date: Oldest First</option>
                <option value="weightHigh">Weight: High to Low</option>
                <option value="weightLow">Weight: Low to High</option>
              </select>
            </div>

          </div>
        </div>

        {/* LOADING & ERROR HANDLING INDICATORS */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0B2E8C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-600">Loading shipments...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadShipments}
              className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* SHIPMENTS DATA TABLE */}
        {!loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0B2E8C]" /> Shipments Inventory ({totalItems} Records)
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Per Page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-slate-300 rounded-md bg-white text-xs font-bold"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                    <th className="py-3 px-3">Tracking Number</th>
                    <th className="py-3 px-3">Sender ➔ Receiver</th>
                    <th className="py-3 px-3">Pickup ➔ Delivery</th>
                    <th className="py-3 px-3">Weight & Dates</th>
                    <th className="py-3 px-3">Live Status (Update)</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {shipments.length > 0 ? (
                    shipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-[#0B2E8C]">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="hover:underline flex items-center gap-1 cursor-pointer text-left font-black"
                          >
                            {shipment.trackingNumber}
                          </Link>
                          <span className="block text-[10px] font-medium text-slate-400">ID: #{shipment.id} • {shipment.parcelType}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{shipment.senderName}</p>
                          <p className="text-[11px] text-slate-500">To: {shipment.receiverName}</p>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex items-center gap-1 font-semibold text-slate-800 truncate">
                            <span className="truncate">{shipment.pickupAddress.split(',')[0]}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{shipment.deliveryAddress.split(',')[0]}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 block">{shipment.parcelWeight}</span>
                          <span className="block text-[10px] text-slate-400">Ship: {shipment.shippingDate}</span>
                        </td>

                        {/* LIVE INLINE STATUS DISPATCH SELECTOR */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={shipment.deliveryStatus}
                              onChange={(e) => handleInlineStatusChange(shipment, e.target.value)}
                              className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer border shadow-2xs ${
                                getStatusConfig(shipment.deliveryStatus).badgeClass
                              }`}
                            >
                              <option value="Pending">🟡 Pending</option>
                              <option value="Picked Up">🩵 Picked Up</option>
                              <option value="In Transit">🔵 In Transit</option>
                              <option value="Out for Delivery">🟣 Out for Delivery</option>
                              <option value="Delivered">🟢 Delivered</option>
                              <option value="Cancelled">⚪ Cancelled</option>
                              <option value="Failed Delivery">⚠️ Failed Delivery</option>
                            </select>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/shipments/${shipment.id}`}
                              className="p-1.5 text-slate-600 hover:text-[#0B2E8C] hover:bg-blue-50 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title="View Full Shipment Details Page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(shipment)}
                              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                              title="Edit Shipment"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(shipment)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Shipment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-slate-400">
                        No shipment records match your search or filter settings.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-3 text-xs">
                <span className="text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span> ({totalItems} total records)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        currentPage === page ? 'bg-[#0B2E8C] text-white shadow-sm' : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>



      {/* CREATE NEW SHIPMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-[#0B2E8C]" />
                <h3 className="text-xl font-black text-slate-900">Create New Shipment</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              
              {/* Tracking Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tracking Number *</label>
                  <input
                    type="text"
                    required
                    value={createFormData.trackingNumber}
                    onChange={(e) => setCreateFormData({ ...createFormData, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold text-[#0B2E8C] focus:ring-2 focus:ring-[#0B2E8C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parcel Type</label>
                  <select
                    value={createFormData.parcelType}
                    onChange={(e) => setCreateFormData({ ...createFormData, parcelType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Express Parcel">Express Parcel</option>
                    <option value="Standard Parcel">Standard Parcel</option>
                    <option value="Heavy Cargo">Heavy Cargo</option>
                    <option value="Document Express">Document Express</option>
                  </select>
                </div>
              </div>

              {/* Sender & Receiver Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Name (API Customer) *</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#0B2E8C] mb-1.5 font-bold text-slate-800"
                    value={createFormData.senderName}
                    onChange={(e) => handleSenderChange(e.target.value)}
                  >
                    <option value="">-- Select API Sender Customer --</option>
                    {allCustomers.map((c) => (
                      <option key={c.id} value={c.customerName}>
                        {c.customerName} ({c.city})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Or enter custom sender name"
                    value={createFormData.senderName}
                    onChange={(e) => handleSenderChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Receiver Name (API Customer) *</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#0B2E8C] mb-1.5 font-bold text-slate-800"
                    value={createFormData.receiverName}
                    onChange={(e) => handleReceiverChange(e.target.value)}
                  >
                    <option value="">-- Select API Receiver Customer --</option>
                    {allCustomers.map((c) => (
                      <option key={c.id} value={c.customerName}>
                        {c.customerName} ({c.city})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Or enter custom receiver name"
                    value={createFormData.receiverName}
                    onChange={(e) => handleReceiverChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                  />
                </div>
              </div>

              {/* API Customers Datalist */}
              <datalist id="shipment-customer-api-names">
                {allCustomers.map((c) => (
                  <option key={c.id} value={c.customerName}>
                    {c.email} - {c.city}
                  </option>
                ))}
              </datalist>

              {/* Pickup Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Full pickup address with pincode"
                  value={createFormData.pickupAddress}
                  onChange={(e) => setCreateFormData({ ...createFormData, pickupAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Full destination delivery address with pincode"
                  value={createFormData.deliveryAddress}
                  onChange={(e) => setCreateFormData({ ...createFormData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                />
              </div>

              {/* Weight, Shipping Date, Expected Date, Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={createFormData.parcelWeight}
                    onChange={(e) => setCreateFormData({ ...createFormData, parcelWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shipping Date</label>
                  <input
                    type="date"
                    required
                    value={createFormData.shippingDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, shippingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Date</label>
                  <input
                    type="date"
                    required
                    value={createFormData.expectedDeliveryDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={createFormData.deliveryStatus}
                    onChange={(e) => setCreateFormData({ ...createFormData, deliveryStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold text-xs"
                  >
                    <option value="Pending">🟡 Pending</option>
                    <option value="Picked Up">🩵 Picked Up</option>
                    <option value="In Transit">🔵 In Transit</option>
                    <option value="Out for Delivery">🟣 Out for Delivery</option>
                    <option value="Delivered">🟢 Delivered</option>
                    <option value="Cancelled">⚪ Cancelled</option>
                    <option value="Failed Delivery">⚠️ Failed Delivery</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2E8C] hover:bg-[#082269] text-white font-bold rounded-full shadow-md cursor-pointer"
                >
                  Save Shipment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT SHIPMENT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900">Edit Shipment {editFormData.trackingNumber}</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              {/* Sender & Receiver Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sender Name *</label>
                  <input
                    type="text"
                    required
                    list="shipment-customer-api-names"
                    value={editFormData.senderName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, senderName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Receiver Name *</label>
                  <input
                    type="text"
                    required
                    list="shipment-customer-api-names"
                    value={editFormData.receiverName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, receiverName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                  />
                </div>
              </div>

              {/* Pickup Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={editFormData.pickupAddress || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, pickupAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={editFormData.deliveryAddress || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2E8C]"
                />
              </div>

              {/* Type, Weight, Dates, Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parcel Type</label>
                  <select
                    value={editFormData.parcelType || 'Express Parcel'}
                    onChange={(e) => setEditFormData({ ...editFormData, parcelType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Express Parcel">Express Parcel</option>
                    <option value="Standard Parcel">Standard Parcel</option>
                    <option value="Heavy Cargo">Heavy Cargo</option>
                    <option value="Document Express">Document Express</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={editFormData.parcelWeight || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, parcelWeight: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shipping Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.shippingDate || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, shippingDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Status</label>
                  <select
                    value={editFormData.deliveryStatus || 'Pending'}
                    onChange={(e) => setEditFormData({ ...editFormData, deliveryStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full shadow-md cursor-pointer"
                >
                  Update Shipment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Shipment Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete shipment <span className="font-bold text-slate-800">{deleteTargetTracking}</span>?
            </p>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-slate-300 font-bold text-xs rounded-full hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Shipments;
