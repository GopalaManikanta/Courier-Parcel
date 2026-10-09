import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';

const Customers = () => {
  const {
    customers,
    allCustomers,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    searchTerm,
    setSearchTerm,
    loading,
    error,
    loadCustomers,
    addCustomer,
    editCustomer,
    removeCustomer
  } = useCustomers();

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // React Hook Form for Create
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors }
  } = useForm({
    defaultValues: {
      customerName: '',
      email: '',
      mobileNumber: '',
      address: '',
      city: '',
      postalCode: ''
    }
  });

  // React Hook Form for Edit
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    formState: { errors: editErrors }
  } = useForm();

  // Open Create Modal
  const handleOpenCreateModal = () => {
    resetCreateForm({
      customerName: '',
      email: '',
      mobileNumber: '',
      address: '',
      city: '',
      postalCode: ''
    });
    setShowCreateModal(true);
  };

  // Submit Create Customer Form
  const onSubmitCreate = async (data) => {
    const success = await addCustomer(data);
    if (success) {
      setShowCreateModal(false);
      resetCreateForm();
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditValue('customerName', customer.customerName);
    setEditValue('email', customer.email);
    setEditValue('mobileNumber', customer.mobileNumber);
    setEditValue('address', customer.address);
    setEditValue('city', customer.city);
    setEditValue('postalCode', customer.postalCode);
    setShowEditModal(true);
  };

  // Submit Edit Customer Form
  const onSubmitEdit = async (data) => {
    if (!editingCustomer) return;
    const success = await editCustomer(editingCustomer.id, data);
    if (success) {
      setShowEditModal(false);
      setEditingCustomer(null);
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (customer) => {
    setDeleteTarget(customer);
    setShowDeleteModal(true);
  };

  // Confirm Delete Customer
  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await removeCustomer(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EBEFF4] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER CONTROL BANNER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#0B2E8C] text-white text-[11px] font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Customer Management Directory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Customer Registry & Profiles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage client records, contact details, delivery addresses, and track real-time customer shipment history.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-[#0B2E8C] hover:bg-[#082269] text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg shadow-[#0B2E8C]/20 transition-all cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-400" /> Add New Customer
          </button>
        </div>

        {/* STAT METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Customers</span>
              <h4 className="text-xl font-black text-slate-900">{allCustomers.length}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B2E8C] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Senders</span>
              <h4 className="text-xl font-black text-emerald-600">{allCustomers.length}</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cities Covered</span>
              <h4 className="text-xl font-black text-indigo-600">
                {new Set(allCustomers.map((c) => c.city)).size}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verified Profiles</span>
              <h4 className="text-xl font-black text-amber-600">100%</h4>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Customer Name, Email, Mobile Number, City, or Postal Code..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
            />
          </div>
        </div>

        {/* LOADING & ERROR INDICATORS */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0B2E8C] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-600">Loading customers directory...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-200 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadCustomers}
              className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* CUSTOMERS DATA TABLE */}
        {!loading && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0B2E8C]" /> Registered Customers ({totalItems} Records)
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
                    <th className="py-3 px-3">Customer Profile</th>
                    <th className="py-3 px-3">Contact Details</th>
                    <th className="py-3 px-3">Address & Location</th>
                    <th className="py-3 px-3">City & Postal Code</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Profile Name */}
                        <td className="py-3.5 px-3">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="font-black text-[#0B2E8C] hover:underline flex items-center gap-2"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#0B2E8C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {customer.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span>{customer.customerName}</span>
                              <span className="block text-[10px] font-medium text-slate-400">ID: #{customer.id}</span>
                            </div>
                          </Link>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-3 space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{customer.mobileNumber}</span>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex items-start gap-1.5 font-medium text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="leading-tight">{customer.address}</span>
                          </div>
                        </td>

                        {/* City & Postal Code */}
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-900 block">{customer.city}</span>
                          <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
                            {customer.postalCode}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/customers/${customer.id}`}
                              className="p-1.5 text-slate-600 hover:text-[#0B2E8C] hover:bg-blue-50 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                              title="View Customer Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleOpenEditModal(customer)}
                              className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                              title="Edit Customer Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(customer)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-sm">No customers found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or add a new customer.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <p className="text-slate-500 font-medium">
                  Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-bold text-slate-800">{totalPages}</span> ({totalItems} total records)
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-[#0B2E8C] text-white shadow-sm'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* CREATE NEW CUSTOMER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-[#0B2E8C]" />
                <h3 className="text-xl font-black text-slate-900">Add New Customer</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit(onSubmitCreate)} className="space-y-4 text-xs">
              
              {/* Customer Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  {...registerCreate('customerName', {
                    required: 'Customer Name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  placeholder="e.g. Leanne Graham"
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                    createErrors.customerName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {createErrors.customerName && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.customerName.message}</p>
                )}
              </div>

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...registerCreate('email', {
                      required: 'Email Address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      createErrors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {createErrors.email && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    {...registerCreate('mobileNumber', {
                      required: 'Mobile Number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter 10-digit Indian mobile number starting with 6-9'
                      }
                    })}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      createErrors.mobileNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {createErrors.mobileNumber && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.mobileNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  {...registerCreate('address', { required: 'Street Address is required' })}
                  placeholder="Plot/Door No, Street Name, Landmark"
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                    createErrors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {createErrors.address && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.address.message}</p>
                )}
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    {...registerCreate('city', { required: 'City is required' })}
                    placeholder="e.g. Hyderabad"
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      createErrors.city ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {createErrors.city && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    {...registerCreate('postalCode', {
                      required: 'Postal Code is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Postal code must be 6 digits'
                      }
                    })}
                    placeholder="e.g. 500081"
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      createErrors.postalCode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {createErrors.postalCode && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{createErrors.postalCode.message}</p>
                  )}
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
                  Save Customer
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900">Edit Customer Profile</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit(onSubmitEdit)} className="space-y-4 text-xs">
              
              {/* Customer Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  {...registerEdit('customerName', {
                    required: 'Customer Name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                    editErrors.customerName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {editErrors.customerName && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.customerName.message}</p>
                )}
              </div>

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...registerEdit('email', {
                      required: 'Email Address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email'
                      }
                    })}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      editErrors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {editErrors.email && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    {...registerEdit('mobileNumber', {
                      required: 'Mobile Number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter 10-digit mobile number'
                      }
                    })}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      editErrors.mobileNumber ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {editErrors.mobileNumber && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.mobileNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  {...registerEdit('address', { required: 'Street Address is required' })}
                  className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                    editErrors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                  }`}
                />
                {editErrors.address && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.address.message}</p>
                )}
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    {...registerEdit('city', { required: 'City is required' })}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      editErrors.city ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {editErrors.city && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    {...registerEdit('postalCode', {
                      required: 'Postal Code is required',
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'Postal code must be 6 digits'
                      }
                    })}
                    className={`w-full px-3 py-2.5 border rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#0B2E8C] ${
                      editErrors.postalCode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {editErrors.postalCode && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{editErrors.postalCode.message}</p>
                  )}
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
                  Update Customer
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
            <h3 className="text-lg font-black text-slate-900">Delete Customer Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete customer <span className="font-bold text-slate-800">{deleteTarget?.customerName}</span>?
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

export default Customers;
