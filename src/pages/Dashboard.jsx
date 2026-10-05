import React from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  Search,
  PlusCircle,
  ShieldCheck,
  Activity,
  Filter,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EBEFF4] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* TOP WELCOME HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#0B2E8C]/10 text-[#0B2E8C] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B2E8C]" /> Enterprise Logistics Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Logistics Manager'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Real-time courier dispatch overview, parcel tracking metrics, and customer operations center.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 bg-[#0B2E8C] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md">
              <PlusCircle className="w-4 h-4 text-amber-400" /> Book New Shipment
            </button>
          </div>
        </div>

        {/* 7 STAT CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1. Total Shipments */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Shipments</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">1,248</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0B2E8C] flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>All registered courier packages</span>
            </div>
          </div>

          {/* 2. In Transit Parcels */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In Transit</p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-600">342</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>On highway & air freight routes</span>
            </div>
          </div>

          {/* 3. Delivered Parcels */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivered</p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">854</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Handed over to recipients</span>
            </div>
          </div>

          {/* 4. Pending Deliveries */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Deliveries</p>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-600">52</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
              <span>Awaiting agent assignment</span>
            </div>
          </div>

        </div>

        {/* SECOND ROW STATS: Customers, Today's Shipments, Success Rate */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* 5. Total Customers */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Customers</p>
                <h4 className="text-2xl font-black text-slate-900">418</h4>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Active</span>
          </div>

          {/* 6. Today's Shipments */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Shipments</p>
                <h4 className="text-2xl font-black text-slate-900">64</h4>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">Today</span>
          </div>

          {/* 7. Delivery Success Rate */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Success Rate</p>
                <h4 className="text-2xl font-black text-slate-900">94.8%</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[94.8%]"></div>
            </div>
          </div>

        </div>

        {/* QUICK ACTION CARDS SECTION */}
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Quick Action Cards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Action Card 1: Track Parcel */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2E8C] text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Track Parcel</h4>
                  <p className="text-xs text-slate-500">Instant tracking details lookup</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GT-984201"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0B2E8C]"
                />
                <button className="bg-[#0B2E8C] hover:bg-[#082269] text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-all">
                  Track
                </button>
              </div>
            </div>

            {/* Action Card 2: Book Shipment */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Book Shipment</h4>
                <p className="text-xs text-slate-500">Create sender & receiver booking</p>
              </div>
            </div>

            {/* Action Card 3: Dispatch Update */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Update Parcel Status</h4>
                <p className="text-xs text-slate-500">Change parcel status to Delivered/In Transit</p>
              </div>
            </div>

            {/* Action Card 4: Filter Status */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Filter className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Filter Overview</h4>
                  <p className="text-xs text-slate-500">Filter parcels by current status</p>
                </div>
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {['All', 'In Transit', 'Delivered', 'Pending'].map((st, idx) => (
                  <span
                    key={st}
                    className={`flex-1 text-[10px] text-center font-bold py-1.5 rounded-md ${
                      idx === 0 ? 'bg-[#0B2E8C] text-white' : 'text-slate-500'
                    }`}
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT GRID: Parcels Table + Recent Activities Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT 2 COLUMNS: Active Shipments Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0B2E8C]" /> Active Shipments Overview
                </h3>
                <p className="text-xs text-slate-500">Recent parcel logs and route tracking summary</p>
              </div>
            </div>

            {/* Parcels Display Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50/50">
                    <th className="py-3 px-3">Tracking ID</th>
                    <th className="py-3 px-3">Sender & Receiver</th>
                    <th className="py-3 px-3">Route (Origin ➔ Dest)</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-3 font-bold text-[#0B2E8C]">
                      GT-984201
                      <span className="block text-[10px] font-semibold text-slate-400">Express Parcel</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">Ramesh Kumar</p>
                      <p className="text-[11px] text-slate-500">To: Priya Sharma</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <span>Hyderabad</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bangalore</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        <Truck className="w-3 h-3 text-blue-600" /> In Transit
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-3 font-bold text-[#0B2E8C]">
                      GT-884102
                      <span className="block text-[10px] font-semibold text-slate-400">Heavy Cargo</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">Vikram Mehta</p>
                      <p className="text-[11px] text-slate-500">To: Sneha Reddy</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <span>Chennai</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mumbai</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-3 font-bold text-[#0B2E8C]">
                      GT-772190
                      <span className="block text-[10px] font-semibold text-slate-400">Document Express</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">Ananya Verma</p>
                      <p className="text-[11px] text-slate-500">To: Suresh Patil</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <span>Delhi</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pune</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" /> Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Recent Activities Stream */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-500" /> Recent Activities
                </h3>
              </div>

              {/* Activity List */}
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">Parcel GT-984201 status updated</p>
                    <p className="text-[11px] text-slate-500">En route from Hyderabad to Bangalore Hub</p>
                    <span className="text-[10px] font-semibold text-slate-400 block pt-0.5">10 mins ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">Shipment GT-884102 delivered</p>
                    <p className="text-[11px] text-slate-500">Delivered to Sneha Reddy in Mumbai</p>
                    <span className="text-[10px] font-semibold text-slate-400 block pt-0.5">45 mins ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">New Shipment Booked (GT-772190)</p>
                    <p className="text-[11px] text-slate-500">Document parcel booked by Ananya Verma</p>
                    <span className="text-[10px] font-semibold text-slate-400 block pt-0.5">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] font-bold text-slate-400">Courier Dispatch System Overview</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
