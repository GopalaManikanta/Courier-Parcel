import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  fetchShipmentsApi,
  createShipmentApi,
  updateShipmentApi,
  deleteShipmentApi,
  generateTrackingNumber
} from '../services/shipmentApi';

const ShipmentContext = createContext();

export const ShipmentProvider = ({ children }) => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, Filter, Sort, Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'weightHigh', 'weightLow'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all shipments
  const loadShipments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchShipmentsApi();
      if (result.success) {
        setShipments(result.data);
      } else {
        setError('Failed to fetch shipments from API.');
      }
    } catch {
      setError('An error occurred while loading shipments.');
      toast.error('Failed to load shipments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  // Create Shipment
  const addShipment = async (formData) => {
    setLoading(true);
    try {
      const tracking = formData.trackingNumber || generateTrackingNumber();
      const payload = {
        ...formData,
        trackingNumber: tracking
      };
      const result = await createShipmentApi(payload);
      if (result.success) {
        setShipments((prev) => [result.data, ...prev]);
        toast.success(`Shipment ${result.data.trackingNumber} created successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to create shipment.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit Shipment
  const editShipment = async (id, updatedFields) => {
    setLoading(true);
    try {
      const result = await updateShipmentApi(id, updatedFields);
      if (result.success) {
        setShipments((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
        );
        toast.success(`Shipment ${updatedFields.trackingNumber || 'record'} updated successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to update shipment.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete Shipment
  const removeShipment = async (id) => {
    setLoading(true);
    try {
      const target = shipments.find((item) => item.id === id);
      const result = await deleteShipmentApi(id);
      if (result.success) {
        setShipments((prev) => prev.filter((item) => item.id !== id));
        toast.success(`Shipment ${target?.trackingNumber || 'record'} deleted successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to delete shipment.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Shipments
  const getFilteredShipments = () => {
    let list = [...shipments];

    // Search Filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.trackingNumber.toLowerCase().includes(query) ||
          s.senderName.toLowerCase().includes(query) ||
          s.receiverName.toLowerCase().includes(query) ||
          s.pickupAddress.toLowerCase().includes(query) ||
          s.deliveryAddress.toLowerCase().includes(query)
      );
    }

    // Type Filter
    if (typeFilter !== 'All') {
      list = list.filter((s) => s.parcelType === typeFilter);
    }

    // Status Filter
    if (statusFilter !== 'All') {
      list = list.filter((s) => s.deliveryStatus === statusFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.shippingDate) - new Date(a.shippingDate);
      }
      if (sortBy === 'oldest') {
        return new Date(a.shippingDate) - new Date(b.shippingDate);
      }
      if (sortBy === 'weightHigh') {
        const wA = parseFloat(a.parcelWeight) || 0;
        const wB = parseFloat(b.parcelWeight) || 0;
        return wB - wA;
      }
      if (sortBy === 'weightLow') {
        const wA = parseFloat(a.parcelWeight) || 0;
        const wB = parseFloat(b.parcelWeight) || 0;
        return wA - wB;
      }
      return 0;
    });

    return list;
  };

  const filteredList = getFilteredShipments();
  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Paginated Slice
  const paginatedShipments = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ShipmentContext.Provider
      value={{
        shipments: paginatedShipments,
        allShipments: shipments,
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
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
};
