// import { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapPin, Navigation, Loader2, User, Phone, Star, Car } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface Props {
//   onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
//   initialLocation?: { lat: number; lng: number; address: string };
// }

// interface Driver {
//   name: string;
//   phone: string;
//   rating: number;
//   vehicle: string;
//   plateNumber: string;
//   lat: number;
//   lng: number;
// }

// export default function OrderTrackingMap({ onLocationSelect, initialLocation }: Props) {
//   const mapRef = useRef<L.Map | null>(null);
//   const driverMarkerRef = useRef<L.Marker | null>(null);
//   const routeRef = useRef<L.Polyline | null>(null);

//   const [manualAddress, setManualAddress] = useState(initialLocation?.address || "");
//   const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
//     initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
//   );
//   const [driver, setDriver] = useState<Driver | null>(null);
//   const [distance, setDistance] = useState<string>("");
//   const [eta, setETA] = useState<string>("");

//   // Initialize Leaflet map
//   useEffect(() => {
//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([-26.2041, 28.0473], 14);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "&copy; OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }
//   }, []);

//   // Place initial marker and simulate driver if initialLocation exists
//   useEffect(() => {
//     if (initialLocation && mapRef.current) {
//       // Set customer marker
//       L.marker([initialLocation.lat, initialLocation.lng], {
//         icon: L.icon({
//           iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//           iconSize: [35, 35],
//           iconAnchor: [17, 35],
//         }),
//       }).addTo(mapRef.current).bindPopup("Customer");

//       mapRef.current.setView([initialLocation.lat, initialLocation.lng], 14);

//       // Update state
//       setSelectedLocation({ lat: initialLocation.lat, lng: initialLocation.lng });
//       onLocationSelect(initialLocation);

//       // Start driver simulation
//       simulateDriver(initialLocation.lat, initialLocation.lng);
//     }
//   }, [initialLocation]);

//   const handleLocationSelect = (lat: number, lng: number) => {
//     setSelectedLocation({ lat, lng });
//     onLocationSelect({ lat, lng, address: manualAddress });

//     if (mapRef.current) {
//       L.marker([lat, lng], {
//         icon: L.icon({
//           iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
//           iconSize: [35, 35],
//           iconAnchor: [17, 35],
//         }),
//       }).addTo(mapRef.current).bindPopup("Customer");
//     }

//     simulateDriver(lat, lng);
//   };

//   // ---------- Simulate Driver Movement ----------
//   const simulateDriver = (custLat: number, custLng: number) => {
//     const driverStart = { lat: custLat + 0.02, lng: custLng + 0.02 }; // start near customer
//     const mockDriver: Driver = {
//       name: "Thabo Malema",
//       phone: "+27 82 555 1234",
//       rating: 4.8,
//       vehicle: "Toyota Corolla",
//       plateNumber: "CA 123-456",
//       lat: driverStart.lat,
//       lng: driverStart.lng,
//     };
//     setDriver(mockDriver);

//     // Add driver marker
//     if (mapRef.current && !driverMarkerRef.current) {
//       driverMarkerRef.current = L.marker([driverStart.lat, driverStart.lng], {
//         icon: L.icon({
//           iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//           iconSize: [35, 35],
//           iconAnchor: [17, 35],
//         }),
//       }).addTo(mapRef.current).bindPopup("Driver");
//     }

//     // Start moving driver towards customer
//     const steps = 20;
//     let step = 0;
//     const latStep = (custLat - driverStart.lat) / steps;
//     const lngStep = (custLng - driverStart.lng) / steps;

//     const interval = setInterval(async () => {
//       step++;
//       const newLat = driverStart.lat + latStep * step;
//       const newLng = driverStart.lng + lngStep * step;

//       // Update driver marker
//       if (driverMarkerRef.current) {
//         driverMarkerRef.current.setLatLng([newLat, newLng]);
//       }

//       // Fetch route & ETA from OSRM
//       const res = await fetch(
//         `https://router.project-osrm.org/route/v1/driving/${newLng},${newLat};${custLng},${custLat}?overview=full&geometries=geojson`
//       );
//       const data = await res.json();
//       const coords = data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({ lat, lng }));

//       // Draw route
//       if (mapRef.current) {
//         if (routeRef.current) {
//           routeRef.current.setLatLngs(coords.map(c => [c.lat, c.lng]));
//         } else {
//           routeRef.current = L.polyline(coords.map(c => [c.lat, c.lng]), { color: "blue", weight: 5 }).addTo(mapRef.current);
//         }
//       }

//       // Update distance & ETA
//       setDistance((data.routes[0].distance / 1000).toFixed(1) + " km");
//       setETA(Math.ceil(data.routes[0].duration / 60) + " min");

//       if (step >= steps) clearInterval(interval);
//     }, 3000); // move every 3 seconds
//   };

//   return (
//     <div className="space-y-4">
//       {/* Address Input */}
//       <div className="space-y-2">
//         <Label htmlFor="deliveryAddress">Enter Delivery Address</Label>
//         <div className="flex gap-2">
//           <Input
//             id="deliveryAddress"
//             placeholder="123 Main Street, Johannesburg"
//             value={manualAddress}
//             onChange={(e) => setManualAddress(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && selectedLocation && handleLocationSelect(selectedLocation.lat, selectedLocation.lng)}
//           />
//           <Button
//             onClick={() => {
//               // Geocode via Nominatim
//               fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(manualAddress)}&format=json&limit=1`)
//                 .then(res => res.json())
//                 .then((data) => {
//                   if (data.length > 0) handleLocationSelect(parseFloat(data[0].lat), parseFloat(data[0].lon));
//                 });
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       </div>

//       {/* Map */}
//       <div id="map" style={{ height: "400px", width: "100%", borderRadius: "12px" }} />

//       {/* Driver Info */}
//       {driver && (
//         <div className="bg-card rounded-lg p-4 mt-4 shadow-md">
//           <div className="flex items-center gap-3 mb-2">
//             <Car className="h-5 w-5 text-primary" />
//             <h3 className="font-bold text-foreground">Driver Info</h3>
//           </div>
//           <p><strong>Name:</strong> {driver.name}</p>
//           <p><strong>Vehicle:</strong> {driver.vehicle} ({driver.plateNumber})</p>
//           <p><strong>Phone:</strong> {driver.phone}</p>
//           <p><strong>Distance:</strong> {distance}</p>
//           <p><strong>ETA:</strong> {eta}</p>
//         </div>
//       )}
//     </div>
//   );
// }