import axios from 'axios';


const API_URL = 'https://jsonplaceholder.typicode.com/users';
const LOCAL_STORAGE_KEY = 'gaati_track_customers_db';

// Initial API Customers Seed
const INITIAL_CUSTOMERS = [
  {
    id: 1,
    customerName: 'Leanne Graham',
    email: 'sincere@april.biz',
    mobileNumber: '9877073680',
    address: 'Apt. 556, Kulas Light',
    city: 'Gwenborough',
    postalCode: '92998',
    createdAt: '2026-09-15'
  },
  {
    id: 2,
    customerName: 'Ervin Howell',
    email: 'shanna@melissa.tv',
    mobileNumber: '9801069265',
    address: 'Suite 879, Victor Plains',
    city: 'Wisokyburgh',
    postalCode: '90566',
    createdAt: '2026-09-18'
  },
  {
    id: 3,
    customerName: 'Clementine Bauch',
    email: 'nathan@yesenia.net',
    mobileNumber: '9814631234',
    address: 'Suite 847, Douglas Extension',
    city: 'McKenziehaven',
    postalCode: '59590',
    createdAt: '2026-09-20'
  },
  {
    id: 4,
    customerName: 'Patricia Lebsack',
    email: 'julianne.oconner@kory.org',
    mobileNumber: '9849317096',
    address: 'Apt. 692, Hoeger Mall',
    city: 'South Elvis',
    postalCode: '53919',
    createdAt: '2026-09-22'
  },
  {
    id: 5,
    customerName: 'Chelsey Dietrich',
    email: 'lucio_hettinger@annie.ca',
    mobileNumber: '9825495412',
    address: 'Suite 351, Skiles Walks',
    city: 'Roscoeview',
    postalCode: '33263',
    createdAt: '2026-09-25'
  },
  {
    id: 6,
    customerName: 'Mrs. Dennis Schulist',
    email: 'karley_dach@jasper.info',
    mobileNumber: '9814779358',
    address: 'Norberto Crossing, Suite 280',
    city: 'South Christy',
    postalCode: '23505',
    createdAt: '2026-09-28'
  }
];

// Helper to get local customers
const getLocalCustomers = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

// Helper to save local customers
const saveLocalCustomers = (customers) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customers));
};

// Helper to map remote API user object into gaatiTrack Customer model
const mapApiUserToCustomer = (user) => {
  let rawPhone = (user.phone || '').replace(/[^0-9]/g, '');
  if (rawPhone.length > 10) rawPhone = rawPhone.slice(-10);
  if (rawPhone.length < 10) rawPhone = '98' + (rawPhone + '9876543210').slice(0, 8);

  const city = user.address?.city || 'Hyderabad';
  const street = user.address?.street || 'Main Road';
  const suite = user.address?.suite || 'Suite 100';
  const zipcode = (user.address?.zipcode || '500081').split('-')[0];

  return {
    id: user.id,
    customerName: user.name,
    email: user.email.toLowerCase(),
    mobileNumber: rawPhone,
    address: `${suite}, ${street}`,
    city: city,
    postalCode: zipcode,
    createdAt: '2026-09-10'
  };
};

// 1. Fetch All Customers (Axios REST + LocalStorage Sync)
export const fetchCustomersApi = async () => {
  try {
    const response = await axios.get(API_URL);
    const apiCustomers = (response.data || []).map(mapApiUserToCustomer);

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let userAdded = [];

    if (stored) {
      try {
        const localData = JSON.parse(stored);
        // Filter out old legacy initial mock data (Ramesh Kumar, etc.) and keep only user-created items (IDs created via Date.now())
        userAdded = localData.filter(
          (c) => c.isUserCreated || (typeof c.id === 'number' && c.id > 100) || typeof c.id === 'string'
        );
      } catch {
        userAdded = [];
      }
    }

    // Combine live API customers with any user-added custom customers
    const merged = [...userAdded, ...apiCustomers];
    saveLocalCustomers(merged);
    return { success: true, data: merged };
  } catch (error) {
    console.error('Failed to fetch customers from API, using local storage:', error);
    const localData = getLocalCustomers();
    return { success: true, data: localData };
  }
};

// 2. Create New Customer
export const createCustomerApi = async (customerData) => {
  try {
    const payload = {
      name: customerData.customerName,
      email: customerData.email,
      phone: customerData.mobileNumber
    };

    await axios.post(API_URL, payload);
    const localData = getLocalCustomers();
    const newCustomer = {
      id: Date.now(),
      ...customerData,
      isUserCreated: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedList = [newCustomer, ...localData];
    saveLocalCustomers(updatedList);

    return { success: true, data: newCustomer };
  } catch (error) {
    console.error('API Post error, saving customer locally:', error);
    const localData = getLocalCustomers();
    const newCustomer = {
      id: Date.now(),
      ...customerData,
      isUserCreated: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updatedList = [newCustomer, ...localData];
    saveLocalCustomers(updatedList);

    return { success: true, data: newCustomer };
  }
};

// 3. Update Existing Customer
export const updateCustomerApi = async (id, updatedFields) => {
  try {
    await axios.put(`${API_URL}/1`, {
      id,
      name: updatedFields.customerName,
      email: updatedFields.email
    });

    const localData = getLocalCustomers();
    const updatedList = localData.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveLocalCustomers(updatedList);

    const updatedItem = updatedList.find((item) => item.id === id);
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error('API Put error, updating customer locally:', error);
    const localData = getLocalCustomers();
    const updatedList = localData.map((item) =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    saveLocalCustomers(updatedList);
    const updatedItem = updatedList.find((item) => item.id === id);
    return { success: true, data: updatedItem };
  }
};

// 4. Delete Customer
export const deleteCustomerApi = async (id) => {
  try {
    await axios.delete(`${API_URL}/1`);

    const localData = getLocalCustomers();
    const updatedList = localData.filter((item) => item.id !== id);
    saveLocalCustomers(updatedList);

    return { success: true, id };
  } catch (error) {
    console.error('API Delete error, removing customer locally:', error);
    const localData = getLocalCustomers();
    const updatedList = localData.filter((item) => item.id !== id);
    saveLocalCustomers(updatedList);
    return { success: true, id };
  }
};
