import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useCustomers } from '../context/CustomerContext';
import { useShipments } from '../context/ShipmentContext';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allCustomers } = useCustomers();
  const { allShipments } = useShipments();

  const customer = allCustomers.find((item) => String(item.id) === String(id));

  if (!customer) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200 space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-slate-900">Customer Profile Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested customer record could not be found in the gaatiTrack registry.
          </p>
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 bg-[#0B2E8C] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-[#082269] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customers Directory
          </Link>
        </div>
      </div>
    );
  }

  // Filter shipments associated with this customer (by Sender or Receiver matching customer name)
  const customerShipments = allShipments.filter(
    (s) =>
      s.senderName.toLowerCase().includes(customer.customerName.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(customer.customerName.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/customers"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0B2E8C] bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:bg-blue-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customers Directory
          </Link>
          
          <button
            onClick={() => navigate('/shipments')}
            className="inline-flex items-center gap-2 bg-[#0B2E8C] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md hover:bg-[#082269] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" /> Book Shipment for Customer
          </button>
        </div>

        {/* AMAZON/FLIPKART STYLE CUSTOMER HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0B2E8C] to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-[#0B2E8C] font-black text-2xl flex items-center justify-center shadow-lg">
                {customer.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {customer.customerName}
                  </h1>
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Verified Customer
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1 font-medium flex items-center gap-2">
                  <span>Customer ID: #{customer.id}</span> • <span>Member since {customer.createdAt || '2026'}</span>
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Flipkart & Amazon Preferred Shipper
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/10">
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-semibold truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/10">
              <Phone className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-semibold">{customer.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/10">
              <Building2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-semibold">{customer.city}, {customer.postalCode}</span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN: Customer Location & Address Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#0B2E8C]" /> Primary Address Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">STREET ADDRESS</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{customer.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">CITY</span>
                    <p className="font-bold text-slate-900">{customer.city}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">POSTAL CODE</span>
                    <p className="font-bold text-slate-900">{customer.postalCode}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">MOBILE CONTACT</span>
                  <p className="font-bold text-slate-900">{customer.mobileNumber}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Parcel Activity Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                  <span className="text-2xl font-black text-[#0B2E8C]">{customerShipments.length}</span>
                  <span className="block text-[10px] font-bold uppercase text-slate-500 mt-1">Total Parcels</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                  <span className="text-2xl font-black text-emerald-600">
                    {customerShipments.filter((s) => s.deliveryStatus === 'Delivered').length}
                  </span>
                  <span className="block text-[10px] font-bold uppercase text-slate-500 mt-1">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Associated Shipments Stream */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0B2E8C]" /> Customer Shipment History ({customerShipments.length})
                </h3>
                <span className="text-xs text-slate-500 font-semibold">Real-Time Dispatch Logs</span>
              </div>

              {customerShipments.length > 0 ? (
                <div className="space-y-4">
                  {customerShipments.map((shipment) => (
                    <div
                      key={shipment.id}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 hover:border-[#0B2E8C] transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/shipments/${shipment.id}`}
                            className="text-sm font-black text-[#0B2E8C] hover:underline"
                          >
                            {shipment.trackingNumber}
                          </Link>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {shipment.parcelType}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                            shipment.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : shipment.deliveryStatus === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : shipment.deliveryStatus === 'Out for Delivery'
                              ? 'bg-indigo-100 text-indigo-800'
                              : shipment.deliveryStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {shipment.deliveryStatus === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {shipment.deliveryStatus === 'In Transit' && <Truck className="w-3.5 h-3.5 text-blue-600" />}
                          {shipment.deliveryStatus === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {shipment.deliveryStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-semibold block text-[10px]">SENDER</span>
                          <p className="font-bold text-slate-800">{shipment.senderName}</p>
                          <p className="text-slate-500 text-[11px] truncate">{shipment.pickupAddress}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold block text-[10px]">RECEIVER</span>
                          <p className="font-bold text-slate-800">{shipment.receiverName}</p>
                          <p className="text-slate-500 text-[11px] truncate">{shipment.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                        <span>Weight: {shipment.parcelWeight}</span>
                        <Link
                          to={`/shipments/${shipment.id}`}
                          className="text-[#0B2E8C] font-bold hover:underline flex items-center gap-1"
                        >
                          View Order Journey <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <Package className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No shipments linked to {customer.customerName} yet</p>
                  <button
                    onClick={() => navigate('/shipments')}
                    className="inline-flex items-center gap-1.5 bg-[#0B2E8C] text-white text-xs font-bold px-4 py-2 rounded-full shadow mt-2 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> Book First Shipment
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CustomerProfile;
