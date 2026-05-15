import { getAdminSession } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-admin"
import { addRoom } from "./actions"
import AdminBookingsTable from "./AdminBookingsTable"
import AdminRoomList from "@/components/AdminRoomList"
import { serializeFirestoreData } from "@/lib/utils"

export default async function AdminDashboard() {
  const session = await getAdminSession()
  
  if (!session || !session.isAdmin) {
    redirect("/login")
  }

  const roomsSnapshot = await db.collection("rooms").get()
  const rooms = roomsSnapshot.docs
    .map((doc: any) => serializeFirestoreData({ id: doc.id, ...doc.data() as any }))
    .sort((a, b) => {
      if (a.floor === b.floor) {
        return (a.roomNumber || "").localeCompare(b.roomNumber || "");
      }
      return (a.floor || 0) - (b.floor || 0);
    });

  const bookingsSnapshot = await db.collection("bookings").orderBy("createdAt", "desc").get()
  const bookings = bookingsSnapshot.docs.map((doc: any) => {
    const data = serializeFirestoreData(doc.data())
    // Find the associated room to pass to the component
    const associatedRoom = rooms.find(r => r.id === data.roomId)
    return {
      id: doc.id,
      ...data,
      room: associatedRoom || { name: "Unknown Room" }
    }
  })

  return (
    <div className="max-w-7xl mx-auto p-8 palace-bg min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-cinzel text-[var(--accent-primary)]">
          Admin <span className="text-[var(--gold-primary)]">Dashboard</span>
        </h1>
        <div className="flex gap-4">
          <a href="/api/admin/export" download className="btn-outline">
            Download CSV Report
          </a>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Add Room Form */}
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 font-cinzel">Add New Room</h2>
          <form action={addRoom} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Room Name" required className="form-input" />
            <textarea name="description" placeholder="Description" required className="form-input min-h-[100px]" />
            
            <div className="flex gap-4">
              <input type="number" name="price" placeholder="Price (₹)" required className="form-input w-full" />
              <input type="text" name="floor" placeholder="Floor (e.g. 1st, Top, Left)" required className="form-input w-full" />
            </div>

            <div className="flex gap-4">
              <select name="location" className="form-select w-full" required>
                <option value="Chaliha Nagar">Chaliha Nagar</option>
                <option value="Bordoloi Nagar (Near Lake)">Bordoloi Nagar (Near Lake)</option>
                <option value="Bordoloi Nagar (Near Income Tax Office)">Bordoloi Nagar (Near Income Tax Office)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <select name="type" className="form-select w-full">
                <option value="Cozy Pink Room">Cozy Pink Room</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Premium 1BHK Suite">Premium 1BHK Suite</option>
                <option value="2BHK House">2BHK House</option>
                <option value="1RK">1RK</option>
              </select>
              <input type="text" name="roomNumber" placeholder="Room Number" required className="form-input w-full" />
            </div>

            <label className="form-label mt-2">Room Images</label>
            <input type="file" name="images" multiple accept="image/*" className="form-input" />
            
            <button type="submit" className="btn-primary mt-4">Add Room</button>
          </form>
        </div>

        {/* Existing Rooms Management */}
        <div className="glass-panel p-8 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 font-cinzel">Manage Rooms</h2>
          <AdminRoomList rooms={rooms} bookings={bookings} />
        </div>
      </div>

      {/* Bookings Management */}
      <h2 className="text-2xl font-bold mb-6 font-cinzel text-[var(--accent-primary)]">Bookings Management</h2>
      <div className="glass-panel p-8">
        <AdminBookingsTable bookings={bookings} />
      </div>
    </div>
  )
}
