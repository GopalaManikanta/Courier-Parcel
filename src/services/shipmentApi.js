import axios from 'axios';

// Third-Party API Endpoint (JSONPlaceholder for REST HTTP simulation)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const LOCAL_STORAGE_KEY = 'gaati_track_shipments_db';

// Initial Mock Seed Data matching all required shipment fields
const INITIAL_SHIPMENTS = [
  {
    id: 1,
    trackingNumber: 'GT-984201',
    senderName: 'Ramesh Kumar',
    receiverName: 'Priya Sharma',
    pickupAddress: 'Plot 42, Hitec City, Hyderabad - 500081',
    deliveryAddress: '12th Main Road, Indiranagar, Bangalore - 560038',
    parcelWeight: '3.5 kg',
    parcelType: 'Express Parcel',
    shippingDate: '2026-10-01',
    expectedDeliveryDate: '2026-10-04',
    deliveryStatus: 'In Transit'
  },
  {
    id: 2,
    trackingNumber: 'GT-884102',
    senderName: 'Vikram Mehta',
    receiverName: 'Sneha Reddy',
    pickupAddress: 'GST Road, Guindy, Chennai - 600032',
    deliveryAddress: 'Andheri East Commercial Complex, Mumbai - 400069',
    parcelWeight: '12.0 kg',
    parcelType: 'Heavy Cargo',
    shippingDate: '2026-09-28',
    expectedDeliveryDate: '2026-10-02',
    deliveryStatus: 'Delivered'
  },
  {
    id: 3,
    trackingNumber: 'GT-772190',
    senderName: 'Ananya Verma',
    receiverName: 'Suresh Patil',
    pickupAddress: 'Connaught Place Sector 4, New Delhi - 110001',
    deliveryAddress: 'FC Road, Shivaji Nagar, Pune - 411005',
    parcelWeight: '0.8 kg',
    parcelType: 'Document Express',
    shippingDate: '2026-10-04',
    expectedDeliveryDate: '2026-10-06',
    deliveryStatus: 'Pending'
  },
  {
    id: 4,
    trackingNumber: 'GT-661044',
    senderName: 'Karan Malhotra',
    receiverName: 'Deepak Joshi',
    pickupAddress: 'Salt Lake City Sector 5, Kolkata - 700091',
    deliveryAddress: 'Banjara Hills Road No 12, Hyderabad - 500034',
    parcelWeight: '5.2 kg',
    parcelType: 'Standard Parcel',
    shippingDate: '2026-10-03',
    expectedDeliveryDate: '2026-10-07',
    deliveryStatus: 'Out for Delivery'
  },
  {
    id: 5,
    trackingNumber: 'GT-554321',
    senderName: 'Rajesh Naidu',
    receiverName: 'Swati Rao',
    pickupAddress: 'MG Road, Vijayawada - 520010',
    deliveryAddress: 'Beach Road, Visakhapatnam - 530003',
    parcelWeight: '4.1 kg',
    parcelType: 'Standard Parcel',
    shippingDate: '2026-09-25',
    expectedDeliveryDate: '2026-09-27',
    deliveryStatus: 'Delivered'
  },
  {
    id: 6,
    trackingNumber: 'GT-443210',
    senderName: 'Manish Gupta',
    receiverName: 'Aarti Singh',
    pickupAddress: 'MI Road, Jaipur - 302001',
    deliveryAddress: 'CG Road, Ahmedabad - 380009',
    parcelWeight: '1.5 kg',
    parcelType: 'Express Parcel',
    shippingDate: '2026-10-02',
    expectedDeliveryDate: '2026-10-05',
    deliveryStatus: 'Cancelled'
  }
];

// Helper to load shipments from LocalStorage or initialize
const getLocalShipments = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
      return INITIAL_SHIPMENTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SHIPMENTS;
  }
};

// Helper to save shipments to LocalStorage
const saveLocalShipments = (shipments) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shipments));
};

// Generate Unique Tracking Number (GT-XXXXXX)
export const generateTrackingNumber = () => {
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  return `GT-${randomCode}`;
};

// 1. Fetch All Shipments (Axios REST + LocalStorage Sync)
export const fetchShipmentsApi = async () => {
  try {
    // Perform actual Third-Party API Call
    await axios.get(`${API_URL}?_limit=5`);
    const localData = getLocalShipments();
    return { success: true, data: localData };
  } catch (error) {
    console.error('Failed to fetch from third-party API, using local fallback:', error);
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

    // Axios POST request to Third-Party API
    const response = await axios.post(API_URL, payload);

    const localData = getLocalShipments();
    const newShipment = {
      id: response.data.id ? Date.now() : Date.now(),
      ...shipmentData,
      trackingNumber: newTracking,
      deliveryStatus: shipmentData.deliveryStatus || 'Pending'
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
      deliveryStatus: shipmentData.deliveryStatus || 'Pending'
    };
    const updatedList = [newShipment, ...localData];
    saveLocalShipments(updatedList);

    return { success: true, data: newShipment };
  }
};

// 3. Update Existing Shipment (Axios PUT + LocalStorage Sync)
export const updateShipmentApi = async (id, updatedFields) => {
  try {
    // Axios PUT request to Third-Party API
    await axios.put(`${API_URL}/1`, {
      id,
      title: `Updated Shipment ${updatedFields.trackingNumber}`,
      body: JSON.stringify(updatedFields)
    });

    const localData = getLocalShipments();
    const updatedList = localData.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveLocalShipments(updatedList);

    const updatedItem = updatedList.find((item) => item.id === id);
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('API Put error, updating locally:', error);
    const localData = getLocalShipments();
    const updatedList = localData.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveLocalShipments(updatedList);
    const updatedItem = updatedList.find((item) => item.id === id);
    return { success: true, data: updatedItem };
  }
};

// 4. Delete Shipment (Axios DELETE + LocalStorage Sync)
export const deleteShipmentApi = async (id) => {
  try {
    // Axios DELETE request to Third-Party API
    await axios.delete(`${API_URL}/1`);

    const localData = getLocalShipments();
    const updatedList = localData.filter((item) => item.id !== id);
    saveLocalShipments(updatedList);

    return { success: true, id };
  } catch (error) {
    console.error('API Delete error, removing locally:', error);
    const localData = getLocalShipments();
    const updatedList = localData.filter((item) => item.id !== id);
    saveLocalShipments(updatedList);
    return { success: true, id };
  }
};
