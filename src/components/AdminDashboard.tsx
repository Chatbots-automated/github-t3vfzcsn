import React from 'react';
import { Shield } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-elida-gold/10 rounded-lg">
            <Shield className="h-6 w-6 text-elida-gold" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>

        <div className="space-y-6">
          {/* Google Calendar Embed */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=6b15306aca13f2f311f3994866b7492d616027788e6ad9ff2fac90fab57ecfd1%40group.calendar.google.com&ctz=Europe%2FVilnius"
              style={{ border: 0 }}
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}