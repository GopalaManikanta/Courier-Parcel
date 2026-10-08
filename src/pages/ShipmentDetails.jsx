import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Printer,
  ChevronRight,
  Sparkles,
  Building2,
  Navigation
} from 'lucide-react';
import { useShipments } from '../context/ShipmentContext';
import StatusBadge from '../components/StatusBadge';

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allShipments, removeShipment, editShipment } = useShipments();

  const shipment = allShipments.find((item) => String(item.id) === String(id));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!shipment) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-slate-200 space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-slate-900">Shipment Record Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested parcel shipment could not be located in the gaatiTrack registry.
          </p>
          <Link
            to="/shipments"
            className="inline-flex items-center gap-2 bg-[#0B2E8C] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-[#082269] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Shipments Hub
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    const success = await removeShipment(shipment.id);
    if (success) {
      navigate('/shipments');
    }
  };

  const handleStatusChange = async (newStatus) => {
    await editShipment(shipment.id, {
      ...shipment,
      deliveryStatus: newStatus
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Amazon Stepper Calculation
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Delivered':
        return 100;
      case 'Out for Delivery':
        return 75;
      case 'In Transit':
        return 50;
      default:
        return 20;
    }
  };

  const progressPercent = getProgressPercentage(shipment.deliveryStatus);

  // Amazon Journey Activity Stream
  const activityStream = [
    {
      time: 'Today, 08:30 AM',
      title: shipment.deliveryStatus === 'Delivered' ? 'Package Delivered' : 'Out for Delivery',
      location: shipment.deliveryAddress.split(',')[0] || 'Destination Hub',
      desc: shipment.deliveryStatus === 'Delivered' ? 'Handed over directly to recipient' : 'Loaded onto local express courier delivery van',
      done: shipment.deliveryStatus === 'Delivered' || shipment.deliveryStatus === 'Out for Delivery'
    },
    {
      time: 'Yesterday, 06:15 PM',
      title: 'Arrived at Regional Distribution Center',
      location: 'Central Sorting Linehaul Facility',
      desc: 'Sorted and scanned into automated express conveyor hub',
      done: shipment.deliveryStatus !== 'Pending'
    },
    {
      time: 'Yesterday, 11:45 AM',
      title: 'In Transit between Logistics Hubs',
      location: 'National Highway Express Route',
      desc: 'Dispatched via gaatiTrack linehaul logistics fleet',
      done: shipment.deliveryStatus !== 'Pending'
    },
    {
      time: shipment.shippingDate,
      title: 'Package Picked Up & Registered',
      location: shipment.pickupAddress.split(',')[0] || 'Origin Facility',
      desc: `Manifest created by ${shipment.senderName}`,
      done: true
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Breadcrumb Navigation & Print Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Link to="/shipments" className="hover:text-[#0B2E8C] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Shipments
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">{shipment.trackingNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#0B2E8C]" /> Print Slip
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-full transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* AMAZON STYLE HERO ARRIVAL BANNER */}
        <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden ${
          shipment.deliveryStatus === 'Delivered'
            ? 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900'
            : shipment.deliveryStatus === 'Out for Delivery'
            ? 'bg-gradient-to-r from-indigo-950 via-[#0B2E8C] to-blue-900'
            : shipment.deliveryStatus === 'In Transit'
            ? 'bg-gradient-to-r from-[#0B2E8C] via-blue-900 to-slate-900'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950'
        }`}>
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Amazon & Flipkart Grade Live Tracking
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/80 font-bold">Status Mode:</span>
                <select
                  value={shipment.deliveryStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2 rounded-full border-0 focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-md"
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

            <div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest">
                {shipment.deliveryStatus === 'Delivered' ? 'Package Delivered' : 'Delivery Status'}
              </p>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
                {shipment.deliveryStatus === 'Delivered'
                  ? `Delivered on ${shipment.expectedDeliveryDate}`
                  : `Status: ${shipment.deliveryStatus}`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium">
                Tracking ID: <span className="font-mono font-bold text-amber-300">{shipment.trackingNumber}</span> • Shipped via <span className="font-bold">gaatiTrack Express Linehaul</span>
              </p>
            </div>
          </div>
        </div>

        {/* AMAZON 4-STEP PROGRESS BAR TRACKER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#0B2E8C]" /> Live Order Progress
            </h2>
            <span className="text-xs font-extrabold text-[#0B2E8C] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {progressPercent}% Journey Complete
            </span>
          </div>

          {/* Progress Line */}
          <div className="relative pt-4 pb-2">
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0B2E8C] to-emerald-500 h-full transition-all duration-700 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Stepper Nodes */}
            <div className="grid grid-cols-4 gap-2 mt-6 text-center text-xs">
              
              {/* Step 1: Ordered */}
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="font-black text-slate-900 text-xs mt-2">Ordered</p>
                <p className="text-[10px] text-slate-400 font-semibold">{shipment.shippingDate}</p>
              </div>

              {/* Step 2: Shipped */}
              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                  progressPercent >= 50
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {progressPercent >= 50 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                </div>
                <p className={`font-black text-xs mt-2 ${progressPercent >= 50 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</p>
                <p className="text-[10px] text-slate-400 font-semibold">Sorting Hub</p>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                  progressPercent >= 75
                    ? 'bg-emerald-500 text-white'
                    : progressPercent === 50
                    ? 'bg-[#0B2E8C] text-white animate-pulse'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {progressPercent >= 75 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                </div>
                <p className={`font-black text-xs mt-2 ${progressPercent >= 75 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</p>
                <p className="text-[10px] text-slate-400 font-semibold">Local Agent</p>
              </div>

              {/* Step 4: Delivered */}
              <div className="space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                  progressPercent === 100
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {progressPercent === 100 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                </div>
                <p className={`font-black text-xs mt-2 ${progressPercent === 100 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</p>
                <p className="text-[10px] text-slate-400 font-semibold">{shipment.expectedDeliveryDate}</p>
              </div>

            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: Tracking Updates Feed & Addresses */}
          <div className="lg:col-span-2 space-y-6">

            {/* Address Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Navigation className="w-5 h-5 text-[#0B2E8C]" /> Delivery Address & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Pickup Address */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-[#0B2E8C]" /> Pickup Sender Origin
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{shipment.senderName}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {shipment.pickupAddress}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold block pt-1">Dispatch Date: {shipment.shippingDate}</span>
                </div>

                {/* Delivery Address */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Delivery Destination
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{shipment.receiverName}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {shipment.deliveryAddress}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold block pt-1">Expected: {shipment.expectedDeliveryDate}</span>
                </div>

              </div>
            </div>

            {/* Status History Audit Trail */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Clock className="w-5 h-5 text-[#0B2E8C]" /> Delivery Status History & Log
              </h3>

              <div className="space-y-6 border-l-2 border-slate-200 pl-4 ml-2">
                {(shipment.statusHistory && shipment.statusHistory.length > 0
                  ? shipment.statusHistory
                  : activityStream
                ).map((hist, idx) => (
                  <div key={hist.id || idx} className="relative space-y-1.5">
                    <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 border-[#0B2E8C] bg-white"></div>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <StatusBadge status={hist.status} size="small" />
                      <span className="text-[10px] font-bold text-slate-400">{hist.timestamp || hist.time}</span>
                    </div>
                    <p className="text-xs font-black text-slate-900">{hist.location}</p>
                    <p className="text-xs text-slate-500 font-medium">{hist.notes || hist.desc}</p>
                    {hist.updatedBy && (
                      <span className="text-[10px] text-slate-400 font-semibold block">Updated By: {hist.updatedBy}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Parcel Specifications Summary */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#0B2E8C]" /> Parcel Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Tracking Number:</span>
                  <span className="font-mono font-bold text-[#0B2E8C]">{shipment.trackingNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Parcel Type:</span>
                  <span className="font-bold text-slate-900">{shipment.parcelType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Weight:</span>
                  <span className="font-bold text-slate-900">{shipment.parcelWeight}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Shipping Date:</span>
                  <span className="font-bold text-slate-900">{shipment.shippingDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Expected Arrival:</span>
                  <span className="font-bold text-slate-900">{shipment.expectedDeliveryDate}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-semibold">Carrier Logistics:</span>
                  <span className="font-bold text-emerald-700">gaatiTrack Express</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-black text-[#0B2E8C]">
                    <ShieldCheck className="w-4 h-4" /> Amazon & Flipkart Linehaul
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    100% verified shipment route with automated hub tracking and real-time status dispatch logs.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Delete Shipment Record?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete shipment <span className="font-bold text-slate-800">{shipment.trackingNumber}</span>? This action cannot be undone.
            </p>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 border border-slate-300 font-bold text-xs rounded-full hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShipmentDetails;
