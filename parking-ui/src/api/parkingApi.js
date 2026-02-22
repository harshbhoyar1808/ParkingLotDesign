import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

const sanitizeVehicleNumber = (v) => {
    if (typeof v !== 'string') return v;
    return v.replaceAll(/[^A-Za-z0-9]/g, ''); // remove any special characters/spaces
};

export const getParkingStatus = () =>
    axios.get(`${API_BASE_URL}/getParkingSlotStatus`);

export const parkVehicle = (data) => {
    const payload = {
        ...data,
        vehicleNumber: sanitizeVehicleNumber(data?.vehicleNumber)
    };
    return axios.post(`${API_BASE_URL}/getTicket`, payload);
};

export const billTicket = (ticketData) => {
    const payload = {
        ...ticketData,
        vehicleNumber: sanitizeVehicleNumber(ticketData?.vehicleNumber)
    };
    return axios.post(`${API_BASE_URL}/billTicket`, payload);
};

export const exitVehicle = (vehicleNumber) =>
    axios.post(`${API_BASE_URL}/billTicket`, { vehicleNumber: sanitizeVehicleNumber(vehicleNumber) });

export const getOccupiedSlotDetails = () =>
    axios.get(`${API_BASE_URL}/getSlotStatus`);
