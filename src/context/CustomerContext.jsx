import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  fetchCustomersApi,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi
} from '../services/customerApi';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch all customers
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomersApi();
      if (result.success) {
        setCustomers(result.data);
      } else {
        setError('Failed to load customers list.');
      }
    } catch {
      setError('An error occurred while loading customers.');
      toast.error('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // Add Customer
  const addCustomer = async (customerData) => {
    setLoading(true);
    try {
      const result = await createCustomerApi(customerData);
      if (result.success) {
        setCustomers((prev) => [result.data, ...prev]);
        toast.success(`Customer ${result.data.customerName} added successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to add customer.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Edit Customer
  const editCustomer = async (id, updatedFields) => {
    setLoading(true);
    try {
      const result = await updateCustomerApi(id, updatedFields);
      if (result.success) {
        setCustomers((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
        );
        toast.success(`Customer ${updatedFields.customerName || 'record'} updated successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to update customer.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove Customer
  const removeCustomer = async (id) => {
    setLoading(true);
    try {
      const target = customers.find((item) => item.id === id);
      const result = await deleteCustomerApi(id);
      if (result.success) {
        setCustomers((prev) => prev.filter((item) => item.id !== id));
        toast.success(`Customer ${target?.customerName || 'record'} deleted successfully!`);
        return true;
      }
      return false;
    } catch {
      toast.error('Failed to delete customer.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filter Customers by Search Term
  const getFilteredCustomers = () => {
    let list = [...customers];
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.mobileNumber.toLowerCase().includes(query) ||
          c.city.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query) ||
          c.postalCode.toLowerCase().includes(query)
      );
    }
    return list;
  };

  const filteredCustomers = getFilteredCustomers();
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <CustomerContext.Provider
      value={{
        customers: paginatedCustomers,
        allCustomers: customers,
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
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
