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

// Helper to map remote API users into live gaatiTrack Shipment models with API sender and receiver names
const mapApiUsersToShipments = (users) => {
  const statuses = ['In Transit', 'Delivered', 'Pending', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const parcelTypes = ['Express Parcel', 'Heavy Cargo', 'Document Express', 'Standard Parcel', 'Express Parcel', 'Standard Parcel'];

  return users.map((user, idx) => {
    const nextUser = users[(idx + 1) % users.length];
    const trackingNo = `GT-${984200 - idx * 1111}`;
    const status = statuses[idx % statuses.length];
    const pType = parcelTypes[idx % parcelTypes.length];
    const weight = `${(idx * 2.3 + 1.2).toFixed(1)} kg`;

    const pickupAddress = `${user.address?.suite || 'Suite 100'}, ${user.address?.street || 'Main St'}, ${user.address?.city || 'Hyderabad'} - ${(user.address?.zipcode || '500081').split('-')[0]}`;
    const deliveryAddress = `${nextUser.address?.suite || 'Plot 42'}, ${nextUser.address?.street || 'Commercial Rd'}, ${nextUser.address?.city || 'Bangalore'} - ${(nextUser.address?.zipcode || '560038').split('-')[0]}`;

    return {
      id: user.id,
      trackingNumber: trackingNo,
      senderName: user.name, // Real API Sender Name (e.g. Leanne Graham)
      receiverName: nextUser.name, // Real API Receiver Name (e.g. Ervin Howell)
      pickupAddress: pickupAddress,
      deliveryAddress: deliveryAddress,
      parcelWeight: weight,
      parcelType: pType,
      shippingDate: `2026-10-0${(idx % 4) + 1}`,
      expectedDeliveryDate: `2026-10-0${(idx % 4) + 4}`,
      deliveryStatus: status,
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
    const newShipment = {
      id: Date.now(),
      ...shipmentData,
      trackingNumber: newTracking,
      deliveryStatus: shipmentData.deliveryStatus || 'Pending',
      isUserCreated: true
    };

    const updatedList = [newShipment, ...localData];
    saveLocalShipments(updatedList);

    return { success: true, data: newShipment };
  } catch (error) {
    console.error('API Post error, saving locally:', error);
    const localData = getLocalShipments();
    const newShipment = {
      id: Date.now(),
      ...shipmentData,
      trackingNumber: shipmentData.trackingNumber || generateTrackingNumber(),
      deliveryStatus: shipmentData.deliveryStatus || 'Pending',
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
    const updatedList = localData.map((item) =>
      String(item.id) === String(id) ? { ...item, ...updatedFields } : item
    );
    saveLocalShipments(updatedList);

    const updatedItem = updatedList.find((item) => String(item.id) === String(id)) || { id, ...updatedFields };
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('API Put error, updating locally:', error);
    const localData = getLocalShipments();
    const updatedList = localData.map((item) =>
      String(item.id) === String(id) ? { ...item, ...updatedFields } : item
    );
    saveLocalShipments(updatedList);
    const updatedItem = updatedList.find((item) => String(item.id) === String(id)) || { id, ...updatedFields };
    return { success: true, data: updatedItem };
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
