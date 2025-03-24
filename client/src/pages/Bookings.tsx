import { useQuery } from "@tanstack/react-query";
import BookingForm from "@/components/BookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { TableAvailability } from "@shared/schema";

const Bookings = () => {
  const { data: availability = [], isLoading } = useQuery<TableAvailability[]>({
    queryKey: ["/api/availability"],
  });

  const getStatusClass = (status: string) => {
    return status === "Available" 
      ? "text-[#4CAF50]" 
      : status === "Limited" 
      ? "text-[#F44336]" 
      : "text-[#F44336]";
  };

  return (
    <div className="pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold text-[#5C4033] mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reserve Your Table
          </h1>
          <p className="text-lg text-[#333333] max-w-2xl mx-auto">
            Book your table in advance to ensure the perfect spot for your visit.
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <BookingForm />
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h3 
            className="text-xl font-bold text-[#5C4033] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Current Availability
          </h3>
          
          {isLoading ? (
            <div className="h-48 bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Time</th>
                    <th className="py-2 px-4 border-b text-center">Today</th>
                    <th className="py-2 px-4 border-b text-center">Tomorrow</th>
                    <th className="py-2 px-4 border-b text-center">Day After</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map((slot) => (
                    <tr key={slot.timeSlot}>
                      <td className="py-2 px-4 border-b">{slot.timeSlot}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <span className={getStatusClass(slot.today)}>{slot.today}</span>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <span className={getStatusClass(slot.tomorrow)}>{slot.tomorrow}</span>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <span className={getStatusClass(slot.dayAfter)}>{slot.dayAfter}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h3 
                className="text-xl font-bold text-[#5C4033] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Reservation Policies
              </h3>
              <ul className="space-y-3 text-[#333333]">
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">•</span>
                  <span>Reservations can be made up to 30 days in advance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">•</span>
                  <span>For parties of 7 or more, please call us directly at (555) 123-4567.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">•</span>
                  <span>Your table will be held for 15 minutes past your reservation time.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">•</span>
                  <span>To cancel or modify a reservation, please contact us at least 2 hours in advance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B4513] mr-2">•</span>
                  <span>For special events or private bookings, please email us at events@brewandbite.com.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
