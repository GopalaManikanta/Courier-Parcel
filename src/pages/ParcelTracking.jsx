import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Sparkles,
  Layers,
  RefreshCw,
  ChevronRight,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useShipments } from '../context/ShipmentContext';
import { toast } from 'react-toastify';

const ParcelTracking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const { allShipments, editShipment } = useShipments();

  // Search input state
  const [trackingInput, setTrackingInput] = useState(initialQuery);
  // Tracking Mode: 'single' | 'multi'
  const [trackingMode, setTrackingMode] = useState('single');
  // Currently inspected shipment tracking ID
  const [selectedTrackingId, setSelectedTrackingId] = useState(initialQuery || (allShipments[0]?.trackingNumber || ''));
  // Selected multi tracking IDs array
  const [multiTrackingIds, setMultiTrackingIds] = useState([]);

  // Find active single shipment
  const currentShipment = useMemo(() => {
    if (!selectedTrackingId && allShipments.length > 0) {
      return allShipments[0];
    }
    return (
      allShipments.find(
        (s) =>
          s.trackingNumber.toLowerCase() === selectedTrackingId.toLowerCase() ||
          String(s.id) === selectedTrackingId
      ) || allShipments[0]
    );
  }, [allShipments, selectedTrackingId]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = trackingInput.trim();
    if (!query) {
      toast.warn('Please enter a tracking number (e.g. GT-984201)');
      return;
    }

    // Check if user entered multiple comma-separated IDs
    if (query.includes(',') || query.includes(' ')) {
      const ids = query
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      setMultiTrackingIds(ids);
      setTrackingMode('multi');
      toast.info(`Tracking ${ids.length} parcels simultaneously`);
    } else {
      const matched = allShipments.find(
        (s) =>
          s.trackingNumber.toLowerCase() === query.toLowerCase() ||
          String(s.id) === query
      );
      if (matched) {
        setSelectedTrackingId(matched.trackingNumber);
        setTrackingMode('single');
        setSearchParams({ query: matched.trackingNumber });
        toast.success(`Found shipment ${matched.trackingNumber}`);
      } else {
        toast.error(`No parcel found for "${query}"`);
      }
    }
  };

  // Status Change Handler
  const handleStatusChange = async (shipmentObj, newStatus) => {
    const success = await editShipment(shipmentObj.id, {
      ...shipmentObj,
      deliveryStatus: newStatus
    });
    if (success) {
      toast.success(`Status for ${shipmentObj.trackingNumber} updated to ${newStatus}`);
    }
  };

  // Location Generator based on shipment status & ID
  const getLocationDetails = (shipment) => {
    if (!shipment) return { location: 'Unknown', hub: 'Logistics Hub', speed: 'Stopped' };
    const status = shipment.deliveryStatus;

    if (status === 'Delivered') {
      return {
        location: shipment.deliveryAddress,
        hub: 'Final Destination Doorstep',
        speed: 'Delivered',
        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      };
    }
    if (status === 'Out for Delivery') {
      return {
        location: `${shipment.deliveryAddress.split(',')[0]} Local Courier Zone`,
        hub: 'Dispatch Agent Van #GT-804',
        speed: 'Speed: 25 km/h (Local Transit)',
        statusColor: 'text-[#0B2E8C] bg-blue-50 border-blue-200'
      };
    }
    if (status === 'In Transit') {
      return {
        location: `National Highway NH-44 Linehaul Waypoint (${shipment.pickupAddress.split(',')[0]} ➔ ${shipment.deliveryAddress.split(',')[0]})`,
        hub: 'Interstate Express Linehaul Truck',
        speed: 'Speed: 72 km/h (Highway Transit)',
        statusColor: 'text-blue-600 bg-blue-50 border-blue-200'
      };
    }
    return {
      location: `${shipment.pickupAddress.split(',')[0]} Origin Sorting Hub`,
      hub: 'Origin Sorting Conveyor Line',
      speed: 'Awaiting Highway Dispatch',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200'
    };
  };

  // Progress Percentage calculation
  const getProgressPercentage = (status) => {
    switch (status) {
      case 'Delivered':
        return 100;
      case 'Out for Delivery':
        return 75;
      case 'In Transit':
        return 50;
      case 'Cancelled':
        return 0;
      default:
        return 20;
    }
  };

  // Generate Tracking History Audit Logs
  const getTrackingHistory = (shipment) => {
    if (!shipment) return [];
    return [
      {
        id: 4,
        status: shipment.deliveryStatus === 'Delivered' ? 'Delivered' : 'Out for Delivery',
        location: shipment.deliveryAddress,
        timestamp: 'Today, 09:15 AM',
        desc:
          shipment.deliveryStatus === 'Delivered'
            ? `Parcel delivered directly to recipient (${shipment.receiverName}). Handover proof signed.`
            : `Out for delivery with local express courier agent.`,
        completed: shipment.deliveryStatus === 'Delivered' || shipment.deliveryStatus === 'Out for Delivery'
      },
      {
        id: 3,
        status: 'In Transit',
        location: `${shipment.deliveryAddress.split(',')[0] || 'Destination'} Regional Sorting Hub`,
        timestamp: 'Yesterday, 07:45 PM',
        desc: 'Arrived at destination linehaul sorting hub. Scanned and sorted into delivery route.',
        completed: shipment.deliveryStatus !== 'Pending'
      },
      {
        id: 2,
        status: 'Highway Transit',
        location: `Linehaul Freight Corridor (${shipment.pickupAddress.split(',')[0]} ➔ ${shipment.deliveryAddress.split(',')[0]})`,
        timestamp: 'Yesterday, 10:30 AM',
        desc: 'Dispatched on gaatiTrack express linehaul container vehicle.',
        completed: shipment.deliveryStatus !== 'Pending'
      },
      {
        id: 1,
        status: 'Booked & Picked Up',
        location: shipment.pickupAddress,
        timestamp: `${shipment.shippingDate}, 08:00 AM`,
        desc: `Shipment booked by sender (${shipment.senderName}). Tracking ID assigned: ${shipment.trackingNumber}`,
        completed: true
      }
    ];
  };

  // Multi Tracking Selected List
  const multiShipmentsList = useMemo(() => {
    if (multiTrackingIds.length === 0) return allShipments.slice(0, 4);
    return allShipments.filter((s) =>
      multiTrackingIds.some(
        (id) => s.trackingNumber.toLowerCase().includes(id.toLowerCase()) || String(s.id) === id
      )
    );
  }, [allShipments, multiTrackingIds]);

  const currentLoc = currentShipment ? getLocationDetails(currentShipment) : null;
  const currentProgress = currentShipment ? getProgressPercentage(currentShipment.deliveryStatus) : 0;
  const currentHistory = currentShipment ? getTrackingHistory(currentShipment) : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EBEFF4] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#0B2E8C]/10 text-[#0B2E8C] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#0B2E8C] animate-pulse" /> Real-Time Live GPS Dispatch Tracking
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Parcel Tracking Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Track single or multiple shipments in real time with live location status, ETA countdowns, and timeline audit logs.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setTrackingMode('single')}
              className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                trackingMode === 'single'
                  ? 'bg-[#0B2E8C] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5" /> Single Parcel Search
            </button>
            <button
              onClick={() => {
                setTrackingMode('multi');
                if (multiTrackingIds.length === 0) {
                  setMultiTrackingIds(allShipments.slice(0, 3).map((s) => s.trackingNumber));
                }
              }}
              className={`px-4 py-2 text-xs font-extrabold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                trackingMode === 'multi'
                  ? 'bg-[#0B2E8C] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Track Multiple Shipments
            </button>
          </div>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder={
                  trackingMode === 'single'
                    ? 'Enter Tracking Number (e.g. GT-984201)'
                    : 'Enter comma-separated IDs (e.g. GT-984201, GT-884102)'
                }
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0B2E8C] hover:bg-[#082269] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Track Parcel Now
            </button>
          </form>

          {/* QUICK PRESET PARCEL PILLS */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold text-slate-400">Quick Track Live API Parcels:</span>
            {allShipments.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedTrackingId(s.trackingNumber);
                  setTrackingInput(s.trackingNumber);
                  setTrackingMode('single');
                  setSearchParams({ query: s.trackingNumber });
                }}
                className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  selectedTrackingId === s.trackingNumber && trackingMode === 'single'
                    ? 'bg-[#0B2E8C] text-white border-[#0B2E8C]'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {s.trackingNumber} ({s.senderName.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* SINGLE TRACKING VIEW */}
        {trackingMode === 'single' && currentShipment && (
          <div className="space-y-6">

            {/* LIVE GPS & ETA STATUS BANNER */}
            <div className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${
              currentShipment.deliveryStatus === 'Delivered'
                ? 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900'
                : currentShipment.deliveryStatus === 'Out for Delivery'
                ? 'bg-gradient-to-r from-indigo-950 via-[#0B2E8C] to-blue-900'
                : currentShipment.deliveryStatus === 'In Transit'
                ? 'bg-gradient-to-r from-[#0B2E8C] via-blue-900 to-slate-900'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950'
            }`}>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Tracking Active
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-400/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live GPS Stream
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">
                      {currentShipment.deliveryStatus === 'Delivered' ? 'Delivery Confirmed' : 'Estimated Arrival Date'}
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">
                      {currentShipment.deliveryStatus === 'Delivered'
                        ? `Delivered on ${currentShipment.expectedDeliveryDate}`
                        : `Arriving on ${currentShipment.expectedDeliveryDate}`}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium">
                      Tracking ID: <span className="font-mono font-bold text-amber-300">{currentShipment.trackingNumber}</span> • Service: <span className="font-bold">{currentShipment.parcelType}</span>
                    </p>
                  </div>
                </div>

                {/* Status Update Quick Trigger */}
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2 shrink-0 w-full md:w-auto">
                  <span className="text-xs text-white/90 font-bold block">Update Status in Real Time:</span>
                  <select
                    value={currentShipment.deliveryStatus}
                    onChange={(e) => handleStatusChange(currentShipment, e.target.value)}
                    className="w-full bg-white text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-md"
                  >
                    <option value="Pending">🟡 Pending</option>
                    <option value="In Transit">🔵 In Transit</option>
                    <option value="Out for Delivery">🟣 Out for Delivery</option>
                    <option value="Delivered">🟢 Delivered</option>
                    <option value="Cancelled">🔴 Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* LIVE LOCATION & GPS CHECKPOINT CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0B2E8C]" /> Current Parcel Location (GPS Dummy Checkpoint)
                </h3>
                <span className="text-xs font-bold text-slate-500">{currentLoc?.speed}</span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B2E8C] text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Checkpoint</span>
                    <h4 className="text-sm font-black text-slate-900">{currentLoc?.location}</h4>
                    <p className="text-xs text-slate-500 font-medium">Facility: {currentLoc?.hub}</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-extrabold bg-blue-50 text-[#0B2E8C] border-blue-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B2E8C] animate-pulse"></span>
                  <span>{currentShipment.deliveryStatus}</span>
                </div>
              </div>
            </div>

            {/* 4-STEP SHIPMENT TIMELINE STEPPER */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#0B2E8C]" /> Shipment Progress Timeline
                </h3>
                <span className="text-xs font-extrabold text-[#0B2E8C] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                  {currentProgress}% Completed
                </span>
              </div>

              {/* Stepper Progress Bar */}
              <div className="relative pt-2 pb-2">
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0B2E8C] to-emerald-500 h-full transition-all duration-700 rounded-full"
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-6 text-center text-xs">
                  {/* Step 1 */}
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="font-black text-slate-900 text-xs mt-2">Booked & Picked Up</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{currentShipment.shippingDate}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                        currentProgress >= 50 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentProgress >= 50 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                    </div>
                    <p className={`font-black text-xs mt-2 ${currentProgress >= 50 ? 'text-slate-900' : 'text-slate-400'}`}>
                      In Linehaul Transit
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">Sorting Center</p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                        currentProgress >= 75
                          ? 'bg-emerald-500 text-white'
                          : currentProgress === 50
                          ? 'bg-[#0B2E8C] text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentProgress >= 75 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                    </div>
                    <p className={`font-black text-xs mt-2 ${currentProgress >= 75 ? 'text-slate-900' : 'text-slate-400'}`}>
                      Out for Delivery
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">Local Agent Van</p>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow-md font-bold text-xs ${
                        currentProgress === 100 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentProgress === 100 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                    </div>
                    <p className={`font-black text-xs mt-2 ${currentProgress === 100 ? 'text-slate-900' : 'text-slate-400'}`}>
                      Delivered
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">{currentShipment.expectedDeliveryDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 COLUMNS: SUMMARY & TRACKING HISTORY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* SHIPMENT SUMMARY */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#0B2E8C]" /> Shipment Summary
                  </span>
                  <Link
                    to={`/shipments/${currentShipment.id}`}
                    className="text-xs text-[#0B2E8C] font-bold hover:underline flex items-center gap-1"
                  >
                    View Full Slip <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Sender Name:</span>
                    <span className="font-black text-slate-900">{currentShipment.senderName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Receiver Name:</span>
                    <span className="font-black text-slate-900">{currentShipment.receiverName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Pickup Address:</span>
                    <span className="font-medium text-slate-700 max-w-[200px] text-right truncate">{currentShipment.pickupAddress}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Delivery Address:</span>
                    <span className="font-medium text-slate-700 max-w-[200px] text-right truncate">{currentShipment.deliveryAddress}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Parcel Weight:</span>
                    <span className="font-bold text-slate-900">{currentShipment.parcelWeight}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Parcel Type:</span>
                    <span className="font-bold text-[#0B2E8C]">{currentShipment.parcelType}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-semibold">Carrier Express:</span>
                    <span className="font-bold text-emerald-600">gaatiTrack Linehaul</span>
                  </div>
                </div>
              </div>

              {/* TRACKING HISTORY AUDIT LOG */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Clock className="w-5 h-5 text-[#0B2E8C]" /> Display Tracking History Log
                </h3>

                <div className="space-y-5 border-l-2 border-slate-200 pl-4 ml-2 pt-1">
                  {currentHistory.map((log) => (
                    <div key={log.id} className="relative space-y-1">
                      <div
                        className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full border-2 ${
                          log.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
                        }`}
                      ></div>
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-black ${log.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {log.status}
                        </h4>
                        <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-xs font-bold text-[#0B2E8C]">{log.location}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{log.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* MULTI SHIPMENTS REAL-TIME TRACKING GRID */}
        {trackingMode === 'multi' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0B2E8C]" /> Multi-Shipment Real-Time Tracking ({multiShipmentsList.length})
                </h3>
                <p className="text-xs text-slate-500">Comparing active parcel dispatches side-by-side with real-time status controls</p>
              </div>
              <button
                onClick={() => setMultiTrackingIds(allShipments.map((s) => s.trackingNumber))}
                className="text-xs font-bold bg-[#0B2E8C] text-white px-4 py-2 rounded-full shadow hover:bg-[#082269] transition-all cursor-pointer"
              >
                Track All ({allShipments.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {multiShipmentsList.map((item) => {
                const itemProgress = getProgressPercentage(item.deliveryStatus);
                const itemLoc = getLocationDetails(item);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 hover:border-[#0B2E8C] transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tracking ID</span>
                        <h4 className="text-base font-black text-[#0B2E8C]">{item.trackingNumber}</h4>
                      </div>
                      <select
                        value={item.deliveryStatus}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className="bg-slate-100 text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-full border border-slate-200 cursor-pointer shadow-sm"
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="In Transit">🔵 In Transit</option>
                        <option value="Out for Delivery">🟣 Out for Delivery</option>
                        <option value="Delivered">🟢 Delivered</option>
                        <option value="Cancelled">🔴 Cancelled</option>
                      </select>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">{item.parcelType}</span>
                        <span className="text-[#0B2E8C]">{itemProgress}% Complete</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0B2E8C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${itemProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Summary Info */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">Sender:</span>
                        <span className="font-bold text-slate-900 block truncate">{item.senderName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">Receiver:</span>
                        <span className="font-bold text-slate-900 block truncate">{item.receiverName}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60 mt-1">
                        <span className="text-slate-400 font-semibold block text-[10px]">Current Location:</span>
                        <span className="font-bold text-[#0B2E8C] block truncate">{itemLoc.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-emerald-600 font-bold">ETA: {item.expectedDeliveryDate}</span>
                      <button
                        onClick={() => {
                          setSelectedTrackingId(item.trackingNumber);
                          setTrackingMode('single');
                        }}
                        className="text-[#0B2E8C] font-black hover:underline flex items-center gap-1"
                      >
                        Inspect Details <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParcelTracking;
