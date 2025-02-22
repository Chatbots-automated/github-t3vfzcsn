const CALENDAR_ID = '6b15306aca13f2f311f3994866b7492d616027788e6ad9ff2fac90fab57ecfd1@group.calendar.google.com';
const API_KEY = 'AIzaSyBn7Y_mQTLtS0PqyyevggtfNW6CbbGHlfw';
const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export const checkAvailability = async (startTime: string, endTime: string): Promise<boolean> => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: 'true',
      orderBy: 'startTime',
    });

    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?${params}`
    );

    if (!response.ok) {
      throw new Error('Failed to check availability');
    }

    const data = await response.json();
    return data.items?.length === 0;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
};

export const createBooking = async (booking: {
  summary: string;
  description: string;
  start: string;
  end: string;
}): Promise<string> => {
  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: booking.summary,
          description: booking.description,
          start: {
            dateTime: booking.start,
            timeZone: 'Europe/Vilnius',
          },
          end: {
            dateTime: booking.end,
            timeZone: 'Europe/Vilnius',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const cancelBooking = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(
      `${CALENDAR_API_BASE}/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${eventId}?key=${API_KEY}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
  } catch (error) {
    console.error('Error canceling booking:', error);
    throw error;
  }
};