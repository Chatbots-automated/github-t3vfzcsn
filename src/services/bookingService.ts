import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Booking } from '../types/booking';
import * as googleCalendar from './googleCalendar';

export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const now = new Date().toISOString();
    const startTime = `${bookingData.date}T${bookingData.time}:00`;
    const endTime = new Date(new Date(startTime).getTime() + 15 * 60000).toISOString();

    // Check Google Calendar availability
    const isAvailable = await googleCalendar.checkAvailability(startTime, endTime);
    if (!isAvailable) {
      throw new Error('Time slot is not available');
    }

    // Create Google Calendar event
    const eventId = await googleCalendar.createBooking({
      summary: `Tanning Session - ${bookingData.cabin}`,
      description: `Booking for ${bookingData.userEmail}`,
      start: startTime,
      end: endTime,
    });

    // Create Firestore booking
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      googleEventId: eventId,
      createdAt: now,
      updatedAt: now,
      status: 'confirmed',
    });

    return bookingRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string) => {
  try {
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(bookingsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const cancelBooking = async (bookingId: string, googleEventId: string) => {
  try {
    // Cancel Google Calendar event
    await googleCalendar.cancelBooking(googleEventId);

    // Update Firestore booking
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};