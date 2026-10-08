import axios from 'axios';

// Third-Party API Endpoints
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';
const LOCAL_STORAGE_KEY = 'gaati_track_shipments_db';

// Generate Unique Tracking Number (GT-XXXXXX)
export const generateTrackingNumber = () => {
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  return `GT-${randomCode}`;
};

// Helper to save shipments to LocalStorage
const saveLocalShipments = (shipments) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shipments));
};

// Helper to get local shipments
const getLocalShipments = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Helper to map remote API users into live gaatiTrack Shipment models with 7 Delivery Statuses & History
const mapApiUsersToShipments = (users) => {
  const statuses = [
    'In Transit',
    'Delivered',
    'Pending',
    'Picked Up',
    'Out for Delivery',
    'Failed Delivery',
    'Delivered',
    'Cancelled',
    'In Transit',
    'Out for Delivery'
  ];
  const parcelTypes = ['Express Parcel', 'Heavy Cargo', 'Document Express', 'Standard Parcel', 'Express Parcel', 'Standard Parcel'];

  return users.map((user, idx) => {
    const nextUser = users[(idx + 1) % users.length];
    const trackingNo = `GT-${984200 - idx * 1111}`;
    const status = statuses[idx % statuses.length];
    const pType = parcelTypes[idx % parcelTypes.length];
    const weight = `${(idx * 2.3 + 1.2).toFixed(1)} kg`;

    const pickupAddress = `${user.address?.suite || 'Suite 100'}, ${user.address?.street || 'Main St'}, ${user.address?.city || 'Hyderabad'} - ${(user.address?.zipcode || '500081').split('-')[0]}`;
    const deliveryAddress = `${nextUser.address?.suite || 'Plot 42'}, ${nextUser.address?.street || 'Commercial Rd'}, ${nextUser.address?.city || 'Bangalore'} - ${(nextUser.address?.zipcode || '560038').split('-')[0]}`;

    // Generate Status History Logs
    const initialHistory = [
      {
        id: `hist-${idx}-1`,
        status: 'Pending',
        timestamp: `2026-10-0${(idx % 4) + 1} 08:30 AM`,
        updatedBy: 'System Booking',
        location: pickupAddress.split(',')[0],
        notes: `Order created by ${user.name}`
      }
    ];

    if (status !== 'Pending') {
      initialHistory.push({
        id: `hist-${idx}-2`,
        status: 'Picked Up',
        timestamp: `2026-10-0${(idx % 4) + 1} 11:45 AM`,
        updatedBy: 'Pickup Executive Agent',
        location: `${user.address?.city || 'Hyderabad'} Hub`,
        notes: 'Parcel picked up from sender location'
      });
    }

    if (['In Transit', 'Out for Delivery', 'Delivered', 'Failed Delivery'].includes(status)) {
      initialHistory.push({
        id: `hist-${idx}-3`,
        status: 'In Transit',
        timestamp: `2026-10-0${(idx % 4) + 2} 06:15 PM`,
        updatedBy: 'Linehaul Fleet Captain',
        location: 'NH-44 Highway Linehaul Waypoint',
        notes: 'In transit between linehaul hubs'
      });
    }

    if (['Out for Delivery', 'Delivered', 'Failed Delivery'].includes(status)) {
      initialHistory.push({
        id: `hist-${idx}-4`,
        status: 'Out for Delivery',
        timestamp: `2026-10-0${(idx % 4) + 3} 08:00 AM`,
        updatedBy: 'Delivery Executive Agent',
        location: `${nextUser.address?.city || 'Bangalore'} Local Center`,
        notes: 'Out for doorstep delivery'
      });
    }

    if (status === 'Delivered') {
      initialHistory.push({
        id: `hist-${idx}-5`,
        status: 'Delivered',
        timestamp: `2026-10-0${(idx % 4) + 3} 02:30 PM`,
        updatedBy: 'Delivery Agent #GT-402',
        location: deliveryAddress.split(',')[0],
        notes: `Handed over directly to ${nextUser.name} with signature proof.`
      });
    }

    if (status === 'Failed Delivery') {
      initialHistory.push({
        id: `hist-${idx}-5`,
        status: 'Failed Delivery',
        timestamp: `2026-10-0${(idx % 4) + 3} 04:15 PM`,
        updatedBy: 'Delivery Agent #GT-402',
        location: deliveryAddress.split(',')[0],
        notes: 'Recipient premises closed. Re-attempt scheduled.'
      });
    }

    if (status === 'Cancelled') {
      initialHistory.push({
        id: `hist-${idx}-5`,
        status: 'Cancelled',
        timestamp: `2026-10-0${(idx % 4) + 1} 02:00 PM`,
        updatedBy: 'Dispatch Manager',
        location: pickupAddress.split(',')[0],
        notes: 'Shipment booking cancelled upon user request.'
      });
    }

    return {
      id: user.id,
      trackingNumber: trackingNo,
      senderName: user.name,
      receiverName: nextUser.name,
      pickupAddress: pickupAddress,
      deliveryAddress: deliveryAddress,
      parcelWeight: weight,
      parcelType: pType,
      shippingDate: `2026-10-0${(idx % 4) + 1}`,
      expectedDeliveryDate: `2026-10-0${(idx % 4) + 4}`,
      deliveryStatus: status,
      statusHistory: [...initialHistory].reverse(),
      isApi: true
    };
  });
};

// 1. Fetch All Shipments (Axios REST + LocalStorage Sync)
export const fetchShipmentsApi = async () => {
  try {
    const response = await axios.get(USERS_API_URL);
    const apiShipments = mapApiUsersToShipments(response.data || []);

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let userAdded = [];

    if (stored) {
      try {
        const localData = JSON.parse(stored);
        userAdded = localData.filter(
          (s) => s.isUserCreated || (typeof s.id === 'number' && s.id > 100) || typeof s.id === 'string'
        );
      } catch {
        userAdded = [];
      }
    }

    const merged = [...userAdded, ...apiShipments];
    saveLocalShipments(merged);
    return { success: true, data: merged };
  } catch (error) {
    console.error('Failed to fetch shipments from API, using local storage:', error);
    const localData = getLocalShipments();
    return { success: true, data: localData };
  }
};

// 2. Create New Shipment (Axios POST + LocalStorage Sync)
export const createShipmentApi = async (shipmentData) => {
  try {
    const newTracking = shipmentData.trackingNumber || generateTrackingNumber();
    const payload = {
      title: `Shipment ${newTracking}`,
      body: JSON.stringify(shipmentData),
      userId: 1
    };

    await axios.post(API_URL, payload);

    const localData = getLocalShipments();
    const initialStatus = shipmentData.deliveryStatus || 'Pending';
    const now = new Date().toLocaleString();

    const newShipment = {
      id: Date.now(),
      ...shipmentData,
      trackingNumber: newTracking,
      deliveryStatus: initialStatus,
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          status: initialStatus,
          timestamp: now,
          updatedBy: 'Logistics Dispatcher',
          location: shipmentData.pickupAddress ? shipmentData.pickupAddress.split(',')[0] : 'Origin Hub',
          notes: 'New shipment registered'
        }
      ],
      isUserCreated: true
    };

    const updatedList = [newShipment, ...localData];
    saveLocalShipments(updatedList);

    return { success: true, data: newShipment };
  } catch (error) {
    console.error('API Post error, saving locally:', error);
    const localData = getLocalShipments();
    const initialStatus = shipmentData.deliveryStatus || 'Pending';
    const now = new Date().toLocaleString();

    const newShipment = {
      id: Date.now(),
      ...shipmentData,
      trackingNumber: shipmentData.trackingNumber || generateTrackingNumber(),
      deliveryStatus: initialStatus,
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          status: initialStatus,
          timestamp: now,
          updatedBy: 'Logistics Dispatcher',
          location: shipmentData.pickupAddress ? shipmentData.pickupAddress.split(',')[0] : 'Origin Hub',
          notes: 'New shipment registered'
        }
      ],
      isUserCreated: true
    };
    const updatedList = [newShipment, ...localData];
    saveLocalShipments(updatedList);

    return { success: true, data: newShipment };
  }
};

// 3. Update Existing Shipment (Axios PUT + LocalStorage Sync)
export const updateShipmentApi = async (id, updatedFields) => {
  try {
    await axios.put(`${API_URL}/1`, {
      id,
      title: `Updated Shipment ${updatedFields.trackingNumber}`,
      body: JSON.stringify(updatedFields)
    });

    const localData = getLocalShipments();
    const existing = localData.find((item) => String(item.id) === String(id)) || {};

    // Auto append status history if deliveryStatus changed
    let updatedHistory = updatedFields.statusHistory || existing.statusHistory || [];
    if (updatedFields.deliveryStatus && updatedFields.deliveryStatus !== existing.deliveryStatus) {
      const newHistoryEntry = {
        id: `hist-${Date.now()}`,
        status: updatedFields.deliveryStatus,
        timestamp: new Date().toLocaleString(),
        updatedBy: 'Dispatch Manager',
        location: updatedFields.deliveryAddress ? updatedFields.deliveryAddress.split(',')[0] : 'Current Checkpoint',
        notes: `Delivery status updated to ${updatedFields.deliveryStatus}`
      };
      updatedHistory = [newHistoryEntry, ...updatedHistory];
    }

    const updatedObject = {
      ...existing,
      ...updatedFields,
      statusHistory: updatedHistory
    };

    const updatedList = localData.map((item) =>
      String(item.id) === String(id) ? updatedObject : item
    );
    saveLocalShipments(updatedList);

    return { success: true, data: updatedObject };
  } catch (error) {
    console.error('API Put error, updating locally:', error);
    const localData = getLocalShipments();
    const existing = localData.find((item) => String(item.id) === String(id)) || {};

    let updatedHistory = updatedFields.statusHistory || existing.statusHistory || [];
    if (updatedFields.deliveryStatus && updatedFields.deliveryStatus !== existing.deliveryStatus) {
      const newHistoryEntry = {
        id: `hist-${Date.now()}`,
        status: updatedFields.deliveryStatus,
        timestamp: new Date().toLocaleString(),
        updatedBy: 'Dispatch Manager',
        location: updatedFields.deliveryAddress ? updatedFields.deliveryAddress.split(',')[0] : 'Current Checkpoint',
        notes: `Delivery status updated to ${updatedFields.deliveryStatus}`
      };
      updatedHistory = [newHistoryEntry, ...updatedHistory];
    }

    const updatedObject = {
      ...existing,
      ...updatedFields,
      statusHistory: updatedHistory
    };

    const updatedList = localData.map((item) =>
      String(item.id) === String(id) ? updatedObject : item
    );
    saveLocalShipments(updatedList);
    return { success: true, data: updatedObject };
  }
};

// 4. Delete Shipment (Axios DELETE + LocalStorage Sync)
export const deleteShipmentApi = async (id) => {
  try {
    await axios.delete(`${API_URL}/1`);

    const localData = getLocalShipments();
    const updatedList = localData.filter((item) => String(item.id) !== String(id));
    saveLocalShipments(updatedList);

    return { success: true, id };
  } catch (error) {
    console.error('API Delete error, removing locally:', error);
    const localData = getLocalShipments();
    const updatedList = localData.filter((item) => String(item.id) !== String(id));
    saveLocalShipments(updatedList);
    return { success: true, id };
  }
};
