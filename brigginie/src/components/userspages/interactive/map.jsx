import { useState, useMemo, useRef, useEffect } from "react";
import {  Search, MapPin, Star, Navigation2, Heart, Share2,  Plus, Minus, X, Clock, Layers, Route, Car, Bike, PersonStanding,ChevronLeft, Wifi, Camera, Moon, Sun, LocateFixed, List, LayoutGrid,ArrowUpDown, ChevronRight, Flame, BadgeCheck, CheckCircle2, Monitor, Cpu,} from "lucide-react";
{/* import { MapAuth } ../../../services/distance */}
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { IoArrowBack, IoLockClosedSharp } from "react-icons/io5";
import L from "leaflet";
import logo from "../../../assets/logo.png";
import "leaflet/dist/leaflet.css";

const PLACES = [
  {
    id: 1,
    name: "Rigginie Factory Pasig Main Branch",
    lat: 14.58691, lng: 121.06140,
    rating: 4.9, reviews: 1420,
    open: true, dist: "0.2 km", time: "5 min", verified: true,
    tags: ["PC Rental", "Gaming", "24/7", "Printing"],
    desc: "Main Branch of Rigginie PC Factory.",
    totalPCs: 50, availablePCs: 12,
    gpus: [
      { name: "LAPTOPS",    total: 8,  available: 2 },
      { name: "RTX 4070 Ti", total: 12, available: 4 },
      { name: "RTX 3080",    total: 15, available: 3 },
      { name: "RX 7800 XT",  total: 15, available: 3 },
    ],
  },
  {
    id: 2,
    name: "Rigginie Quezon City Branch",
    lat:  14.717, lng: 121.059,
    rating: 4.7, reviews: 882,
    open: true, dist: "0.5 km", time: "9 min", verified: true,
    tags: ["PC Rental", "Gaming", "WiFi"],
    desc: "QC branch in the heart of the city.",
    totalPCs: 30, availablePCs: 8,
    gpus: [
      { name: "RTX 4070",   total: 10, available: 3 },
      { name: "RTX 3070",   total: 10, available: 2 },
      { name: "RX 6700 XT", total: 10, available: 3 },
    ],
  },
  {
    id: 3,
    name: "Rigginie Cavite Branch",
    lat: 14.5490, lng: 121.0310,
    rating: 4.8, reviews: 2100,
    open: true, dist: "0.9 km", time: "12 min", verified: true,
    tags: ["PC Rental", "Esports", "LAN"],
    desc: "Full esports setup with tournament-grade rigs.",
    totalPCs: 40, availablePCs: 20,
    gpus: [
      { name: "RTX 4080",   total: 10, available: 6 },
      { name: "RTX 4070",   total: 15, available: 8 },
      { name: "RTX 3060 Ti",total: 15, available: 6 },
    ],
  },
  {
    id: 4,
    name: "Rigginie Taguig Branch",
    lat: 14.5580, lng: 121.0160,
    rating: 4.9, reviews: 3240,
    open: true, dist: "1.2 km", time: "16 min", verified: false,
    tags: ["PC Rental", "Gaming", "Streaming"],
    desc: "BGC area branch with high-speed fiber connection.",
    totalPCs: 35, availablePCs: 0,
    gpus: [
      { name: "LAPTOPS",    total: 5,  available: 0 },
      { name: "RTX 4070 Ti",total: 15, available: 0 },
      { name: "RTX 3080 Ti",total: 15, available: 0 },
    ],
  },
  {
    id: 5,
    name: "Rigginie Pasay Branch",
    lat: 14.5530, lng: 121.0350,
    rating: 4.8, reviews: 560,
    open: false, dist: "1.6 km", time: "20 min", verified: true,
    tags: ["PC Rental", "Gaming"],
    desc: "Pasay branch near the entertainment district.",
    totalPCs: 25, availablePCs: 0,
    gpus: [
      { name: "RTX 4060 Ti", total: 10, available: 0 },
      { name: "RTX 3070",    total: 15, available: 0 },
    ],
  },
  {
    id: 6,
    name: "Rigginie Cebu Branch",
    lat: 10.3167, lng: 123.8907,
    rating: 4.5, reviews: 430,
    open: true, dist: "196 km", time: "11 min", verified: false,
    tags: ["PC Rental", "Gaming", "Student Friendly"],
    desc: "Cebu branch serving students and casual gamers.",
    totalPCs: 20, availablePCs: 5,
    gpus: [
      { name: "RTX 3060",   total: 10, available: 3 },
      { name: "RX 6600 XT", total: 10, available: 2 },
    ],
  },
  {
    id: 7,
    name: "Rigginie Marikina Branch",
    lat: 14.5540, lng: 121.0190,
    rating: 4.4, reviews: 1870,
    open: true, dist: "2.1 km", time: "25 min", verified: true,
    tags: ["PC Rental", "Gaming", "VR"],
    desc: "Marikina branch featuring VR gaming stations.",
    totalPCs: 28, availablePCs: 9,
    gpus: [
      { name: "RTX 4070",   total: 8,  available: 3 },
      { name: "RTX 3080",   total: 10, available: 4 },
      { name: "RX 7700 XT", total: 10, available: 2 },
    ],
  },
  {
    id: 8,
    name: "Rigginie Makati Branch",
    lat: 14.5600, lng: 121.0220,
    rating: 4.6, reviews: 980,
    open: true, dist: "1.5 km", time: "18 min", verified: false,
    tags: ["PC Rental", "Gaming", "Office Use"],
    desc: "Makati CBD branch for gamers and remote workers.",
    totalPCs: 32, availablePCs: 14,
    gpus: [
      { name: "LAPTOPS",    total: 12, available: 5 },
      { name: "RTX 3070 Ti", total: 10, available: 4 },
      { name: "RX 6800",     total: 10, available: 5 },
    ],
  },
  {
    id: 9,
    name: "Rigginie Manila Branch",
    lat: 14.5515, lng: 121.0260,
    rating: 4.6, reviews: 740,
    open: true, dist: "1.0 km", time: "13 min", verified: true,
    tags: ["PC Rental", "Gaming", "24/7"],
    desc: "Downtown Manila branch open round the clock.",
    totalPCs: 45, availablePCs: 18,
    gpus: [
      { name: "RTX 4080",   total: 10, available: 4 },
      { name: "RTX 4070",   total: 15, available: 6 },
      { name: "RTX 3080",   total: 10, available: 4 },
      { name: "RX 7800 XT", total: 10, available: 4 },
    ],
  },
  {
    id: 10,
    name: "Rigginie Malabon Branch",
    lat: 14.5490, lng: 121.0290,
    rating: 4.8, reviews: 1120,
    open: true, dist: "2.3 km", time: "28 min", verified: true,
    tags: ["PC Rental", "Gaming", "Streaming"],
    desc: "Malabon branch with dedicated streaming booths.",
    totalPCs: 22, availablePCs: 7,
    gpus: [
      { name: "RTX 4060 Ti", total: 10, available: 4 },
      { name: "RTX 3060 Ti", total: 12, available: 3 },
    ],
  },
  {
    id: 11,
    name: "Rigginie Parañaque Branch",
    lat: 14.5565, lng: 121.0230,
    rating: 4.5, reviews: 388,
    open: false, dist: "1.1 km", time: "14 min", verified: false,
    tags: ["PC Rental", "Gaming"],
    desc: "Parañaque branch currently closed for renovation.",
    totalPCs: 18, availablePCs: 0,
    gpus: [
      { name: "RTX 3070",   total: 9,  available: 0 },
      { name: "RX 6700 XT", total: 9,  available: 0 },
    ],
  },
];

const CATEGORIES = [
  { key: "all",    label: "All",    Icon: Layers            },
  { key: "open",   label: "Open",   Icon: CheckCircle2      },
  { key: "closed", label: "Closed", Icon: IoLockClosedSharp },
];

const TRAVEL = [
  { key: "drive", Icon: Car,             label: "Drive" },
  { key: "cycle", Icon: Bike,            label: "Cycle" },
  { key: "walk",  Icon: PersonStanding,  label: "Walk"  },
];

const PIN = {
  open:   { dot: "#22c55e", glow: "#22c55e22", light: "bg-green-50 text-green-600",  badge: "bg-green-100 text-green-700"  },
  closed: { dot: "#ef4444", glow: "#ef444422", light: "bg-red-50 text-red-600",      badge: "bg-red-100 text-red-700"      },
};

const NEAR_ME_RADIUS_KM = 1.5;

function haversineKm(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function walkTime(km) {
  const mins = Math.round((km / 5) * 60);
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function makePinIcon(color, isSelected = false) {
  const w = isSelected ? 34 : 26;
  const h = isSelected ? 44 : 34;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 26 34">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21S26 22.75 26 13C26 5.82 20.18 0 13 0z"
        fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      <circle cx="13" cy="13" r="6" fill="rgba(255,255,255,0.9)"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize:      [w, h],
    iconAnchor:    [w / 2, h],
    popupAnchor:   [0, -h],
    tooltipAnchor: [w / 2, -h],
  });
}

const PIN_ICONS = {
  open:   { normal: makePinIcon("#22c55e", false), selected: makePinIcon("#22c55e", true) },
  closed: { normal: makePinIcon("#ef4444", false), selected: makePinIcon("#ef4444", true) },
};

function MapTiles({ dark }) {
  const DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  return (
    <TileLayer
      key={dark ? "dark" : "light"}
      url={dark ? DARK : LIGHT}
      attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      maxZoom={19}
    />
  );
}

function FlyTo({ place }) {
  const map = useMap();
  useEffect(() => {
    if (place) map.flyTo([place.lat, place.lng], 16, { duration: 0.8 });
  }, [place?.id]);
  return null;
}

function LeafletMap({ dark, places, selected, onSelect, mapRef, userLocation }) {
  const CENTER = [14.5547, 121.0244];

  const youAreHereIcon = L.divIcon({
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(99,102,241,0.25);animation:nearMePulse 1.8s ease-out infinite;"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:#6366f1;border:2px solid white;box-shadow:0 2px 8px rgba(99,102,241,0.5);"></div>
      </div>`,
    className: "",
    iconSize:   [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <MapContainer
      ref={mapRef}
      center={CENTER}
      zoom={15}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <MapTiles dark={dark} />
      <FlyTo place={selected} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={youAreHereIcon}>
          <Tooltip direction="top" offset={[0, -14]} permanent>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>You are here</span>
          </Tooltip>
        </Marker>
      )}

      {places.map((p) => {
        const statusKey = p.open ? "open" : "closed";
        return (
          <Marker
            key={`${p.id}-${selected?.id === p.id}`}
            position={[p.lat, p.lng]}
            icon={selected?.id === p.id ? PIN_ICONS[statusKey].selected : PIN_ICONS[statusKey].normal}
            eventHandlers={{ click: () => onSelect(p) }}
          >
            <Tooltip direction="top" offset={[0, -28]} opacity={1} className="leaflet-tooltip-custom">
              <div style={{ fontFamily: "system-ui,sans-serif" }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  {p.open ? "🟢 Open" : "🔴 Closed"} · {p.availablePCs}/{p.totalPCs} PCs free
                </div>
                {p.dist && (
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{p.dist} away</div>
                )}
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

function PlaceCard({ p, selected, dark, onClick }) {
  const col = PIN[p.open ? "open" : "closed"];
  const isS = selected?.id === p.id;
  const topGpu = p.gpus.find(g => g.available > 0);
  const pcPercent = Math.round((p.availablePCs / p.totalPCs) * 100);

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-2xl p-3 border transition-all duration-150 ${
        isS
          ? dark ? "border-indigo-500/50 bg-indigo-950/60" : "border-indigo-300 bg-indigo-50"
          : dark ? "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/80"
                 : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${col.light}`}>
          <Monitor size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className={`truncate text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}>{p.name}</p>
            {p.verified && <BadgeCheck size={12} className="shrink-0 text-indigo-500" />}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className={`text-xs font-bold ${dark ? "text-slate-200" : "text-slate-700"}`}>{p.rating}</span>
            <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>·</span>
            <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>{p.reviews.toLocaleString()} reviews</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              p.open ? "bg-green-100 text-green-700" : dark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-500"
            }`}>
              {p.open ? "Open" : "Closed"}
            </span>
            <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{p.dist}</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Monitor size={10} className={dark ? "text-slate-500" : "text-slate-400"} />
                <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  {p.availablePCs}/{p.totalPCs} PCs available
                </span>
              </div>
              <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{pcPercent}%</span>
            </div>
            <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pcPercent}%`,
                  background: pcPercent === 0 ? "#ef4444" : pcPercent < 30 ? "#f97316" : "#22c55e",
                }}
              />
            </div>
          </div>
          {topGpu && (
            <div className="mt-1.5 flex items-center gap-1">
              <Cpu size={10} className="text-indigo-500" />
              <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {topGpu.name} · {topGpu.available} avail.
              </span>
            </div>
          )}
        </div>
        <ChevronRight size={14} className={`mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 ${dark ? "text-slate-600" : "text-slate-300"}`} />
      </div>
    </button>
  );
}

function DetailDrawer({ p, dark, onClose }) {
  const [saved,  setSaved]  = useState(false);
  const [travel, setTravel] = useState("walk");
  const col = PIN[p.open ? "open" : "closed"];
  const TRAVEL_TIME = { drive: "3 min", cycle: "8 min", walk: p.time };
  const pcPercent = Math.round((p.availablePCs / p.totalPCs) * 100);
  const totalAvailableGpus = p.gpus.reduce((sum, g) => sum + g.available, 0);

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 z-[1000] shadow-2xl flex flex-col
        ${dark ? "bg-slate-900 border-l border-slate-800" : "bg-white border-l border-slate-100"}`}
      style={{ animation: "slideIn .22s ease-out" }}
    >
      <div className={`relative h-44 shrink-0 ${col.light} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`absolute rounded-full ${col.light}`}
              style={{ width: 80 + i * 40, height: 80 + i * 40, left: `${i * 8}%`, top: `${i * 12 - 20}%`, opacity: 0.4 }} />
          ))}
        </div>
        <div className={`h-20 w-20 rounded-3xl flex items-center justify-center ${col.light} shadow-lg`}>
          <Monitor size={40} />
        </div>
        <button onClick={onClose}
          className={`absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md
            hover:scale-105 transition-transform
            ${dark ? "bg-slate-900/80 text-slate-300" : "bg-white/90 text-slate-600"}`}>
          <ChevronLeft size={16} />
        </button>
        <button onClick={() => setSaved(v => !v)}
          className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md
            hover:scale-105 transition-all
            ${saved ? "bg-red-500 text-white" : "bg-white/90 text-slate-500"}`}>
          <Heart size={14} className={saved ? "fill-white" : ""} />
        </button>
        <div className={`absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${col.badge}`}>
          {p.open ? <CheckCircle2 size={10} /> : <IoLockClosedSharp size={10} />}
          {p.open ? "Open" : "Closed"}
        </div>
        {p.verified && (
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-xs font-bold text-white">
            <BadgeCheck size={10} /> Verified
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className={`px-4 pt-4 pb-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <h2 className={`text-lg font-bold leading-tight ${dark ? "text-white" : "text-slate-900"}`}>{p.name}</h2>
          <p className={`mt-1 text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{p.desc}</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={
                  i < Math.floor(p.rating) ? "fill-amber-400 text-amber-400" : dark ? "text-slate-700" : "text-slate-200"
                } />
              ))}
              <span className={`ml-1 text-sm font-bold ${dark ? "text-slate-200" : "text-slate-700"}`}>{p.rating}</span>
            </div>
            <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
              {p.reviews.toLocaleString()} reviews
            </span>
          </div>
        </div>

        <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-3 text-sm">
            <span className={`flex items-center gap-1.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              <MapPin size={13} className={dark ? "text-slate-600" : "text-slate-400"} />{p.dist}
            </span>
            <span className={`flex items-center gap-1.5 font-semibold ${p.open ? "text-green-500" : "text-red-400"}`}>
              <Clock size={13} />{p.open ? "Open now" : "Closed"}
            </span>
          </div>
        </div>

        <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
            PC Availability
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>
              {p.availablePCs} / {p.totalPCs} available
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              p.availablePCs === 0
                ? "bg-red-100 text-red-600"
                : p.availablePCs < p.totalPCs * 0.3
                  ? "bg-amber-100 text-amber-600"
                  : "bg-green-100 text-green-600"
            }`}>
              {p.availablePCs === 0 ? "Full" : `${pcPercent}% free`}
            </span>
          </div>
          <div className={`h-2 w-full rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pcPercent}%`,
                background: pcPercent === 0 ? "#ef4444" : pcPercent < 30 ? "#f97316" : "#22c55e",
              }}
            />
          </div>
        </div>

        <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
              Available GPUs
            </p>
            <span className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {totalAvailableGpus} total free
            </span>
          </div>
          <div className="space-y-2">
            {p.gpus.map((g) => {
              const pct = Math.round((g.available / g.total) * 100);
              return (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Cpu size={11} className={g.available > 0 ? "text-indigo-500" : dark ? "text-slate-600" : "text-slate-400"} />
                      <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{g.name}</span>
                    </div>
                    <span className={`text-xs ${
                      g.available === 0
                        ? "text-red-400"
                        : dark ? "text-slate-400" : "text-slate-500"
                    }`}>
                      {g.available}/{g.total}
                    </span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: g.available === 0 ? "#ef4444" : "#6366f1",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Features</p>
          <div className="flex flex-wrap gap-1.5">
            {p.tags.map(t => (
              <span key={t} className={`rounded-full border px-3 py-1 text-xs font-medium
                ${dark ? "border-slate-700 text-slate-400 bg-slate-800" : "border-slate-200 text-slate-600 bg-slate-50"}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Get there</p>
          <div className={`flex gap-1.5 rounded-xl border p-1
            ${dark ? "border-slate-800 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}>
            {TRAVEL.map(({ key, Icon, label }) => (
              <button key={key} onClick={() => setTravel(key)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 transition-all duration-150 ${
                  travel === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
                }`}>
                <Icon size={15} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            ))}
          </div>
          <div className={`mt-2 flex items-center justify-between rounded-xl px-3 py-2.5
            ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
            <span className={`text-sm font-semibold ${dark ? "text-slate-300" : "text-slate-600"}`}>ETA</span>
            <span className="text-sm font-bold text-indigo-500">{TRAVEL_TIME[travel]}</span>
          </div>
        </div>
      </div>

      <div className={`shrink-0 px-4 py-3 border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600
          py-3 text-sm font-bold text-white hover:bg-indigo-700 active:scale-95 transition-all">
          <Navigation2 size={15} /> Start navigation
        </button>
        <button className={`mt-2 w-full flex items-center justify-center gap-2 rounded-xl border py-3
          text-sm font-semibold transition-all active:scale-95
          ${dark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
          <Share2 size={14} /> Share place
        </button>
      </div>

      <style>{`
        @keyframes slideIn     { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes nearMePulse { 0% { transform:scale(1); opacity:.8; } 100% { transform:scale(3.5); opacity:0; } }
        .leaflet-tooltip-custom { border:none !important; box-shadow:0 4px 16px rgba(0,0,0,0.12) !important; border-radius:8px !important; padding:8px 12px !important; }
      `}</style>
    </div>
  );
}

function Map() {
  const [dark,         setDark]         = useState(true);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [view,         setView]         = useState("list");
  const [showSide,     setShowSide]     = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [locating,     setLocating]     = useState(false);

  const mapRef = useRef(null);

  const filtered = useMemo(() => {
    let list = PLACES;

    if (catFilter === "open") {
      list = list.filter(p => p.open);
    } else if (catFilter === "closed") {
      list = list.filter(p => !p.open);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.gpus.some(g => g.name.toLowerCase().includes(q))
      );
    }

    if (nearMeActive && userLocation) {
      list = list
        .map(p => ({ ...p, _km: haversineKm(userLocation.lat, userLocation.lng, p.lat, p.lng) }))
        .filter(p => p._km <= NEAR_ME_RADIUS_KM)
        .sort((a, b) => a._km - b._km)
        .map(p => ({ ...p, dist: formatDist(p._km), time: walkTime(p._km) }));
    }

    return list;
  }, [catFilter, search, nearMeActive, userLocation]);

  const d = dark;

  function handleNearMe() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = { lat: coords.latitude, lng: coords.longitude };
        setUserLocation(loc);
        setNearMeActive(true);
        setLocating(false);
        mapRef.current?.flyTo([loc.lat, loc.lng], 15, { duration: 1 });
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) alert("Location access denied. Allow location in your browser settings.");
        else alert("Could not get your location. Please try again.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function handleClearNearMe() {
    setNearMeActive(false);
    setUserLocation(null);
  }

  return (
    <div
      className={`relative flex h-screen w-full overflow-hidden select-none ${d ? "bg-slate-950" : "bg-slate-100"}`}
      style={{ fontFamily: "system-ui,-apple-system,sans-serif" }}
    >
      {showSide && (
        <aside
          className={`relative z-[500] flex w-[300px] shrink-0 flex-col transition-colors
            ${d ? "bg-slate-900/95 border-r border-slate-800" : "bg-white/95 border-r border-slate-100"}`}
          style={{ backdropFilter: "blur(12px)" }}
        >
          <div className={`flex items-center gap-2.5 border-b px-4 py-3 ${d ? "border-slate-800" : "border-slate-100"}`}>
            <button
              onClick={() => history.back()}
              className={`rounded-lg p-1.5 transition-colors ${d ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100"}`}
            >
              <IoArrowBack size={16} />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl shadow-lg shadow-indigo-500/30">
              <img src={logo} alt="Rigginie Logo" className="h-full w-full object-contain size-full" />
            </div>
            <div>
              <p className={`text-sm font-black leading-none tracking-tight ${d ? "text-white" : "text-slate-900"}`}>Rigginie</p>
              <p className={`text-xs ${d ? "text-slate-500" : "text-slate-400"}`}>PC Store Locator</p>
            </div>
            <button
              onClick={() => setShowSide(false)}
              className={`ml-auto rounded-lg p-1.5 transition-colors
                ${d ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}>
              <ChevronLeft size={15} />
            </button>
          </div>

          <div className={`border-b px-3 py-3 ${d ? "border-slate-800" : "border-slate-100"}`}>
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors
              ${d ? "border-slate-700 bg-slate-800 focus-within:border-indigo-500" : "border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white"}`}>
              <Search size={14} className={d ? "text-slate-500" : "text-slate-400"} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search branch, GPU…"
                className={`w-full bg-transparent text-sm outline-none
                  ${d ? "text-slate-200 placeholder:text-slate-600" : "text-slate-700 placeholder:text-slate-400"}`}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className={d ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className={`border-b px-3 py-2.5 ${d ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map(({ key, label, Icon }) => (
                <button key={key} onClick={() => setCatFilter(key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all
                    ${catFilter === key
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                      : d ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  <Icon size={11} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={`flex items-center justify-between border-b px-3 py-2 ${d ? "border-slate-800" : "border-slate-100"}`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${d ? "text-slate-500" : "text-slate-400"}`}>
              {filtered.length} branch{filtered.length !== 1 ? "es" : ""}
            </span>
            <div className="flex items-center gap-1">
              <button className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors
                ${d ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100"}`}>
                <ArrowUpDown size={11} /> Sort
              </button>
              <div className={`mx-1 h-3 w-px ${d ? "bg-slate-800" : "bg-slate-200"}`} />
              {[{ v: "list", I: List }, { v: "grid", I: LayoutGrid }].map(({ v, I }) => (
                <button key={v} onClick={() => setView(v)}
                  className={`rounded-lg p-1.5 transition-colors ${view === v
                    ? d ? "bg-slate-700 text-slate-200" : "bg-slate-200 text-slate-700"
                    : d ? "text-slate-600 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"}`}>
                  <I size={13} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2" style={{ scrollbarWidth: "thin" }}>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <PlaceCard key={p.id} p={p} selected={selected} dark={d}
                  onClick={() => setSelected(prev => prev?.id === p.id ? null : p)} />
              ))
            ) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Monitor size={32} className={d ? "text-slate-700" : "text-slate-300"} />
                <p className={`mt-3 text-sm font-semibold ${d ? "text-slate-500" : "text-slate-400"}`}>No branches found</p>
                <p className={`mt-1 text-xs ${d ? "text-slate-600" : "text-slate-500"}`}>Try adjusting your filters</p>
              </div>
            )}
          </div>

          <div className={`border-t px-4 py-3 flex items-center gap-2 ${d ? "border-slate-800" : "border-slate-100"}`}>
            <Flame size={13} className="text-orange-500" />
            <span className={`text-xs font-semibold flex-1 ${d ? "text-slate-400" : "text-slate-500"}`}>
              {nearMeActive
                ? `${filtered.length} within ${NEAR_ME_RADIUS_KM} km`
                : `${filtered.filter(p => p.availablePCs > 0 && p.open).length} branches with free PCs`
              }
            </span>
            {nearMeActive ? (
              <button onClick={handleClearNearMe}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-400 bg-indigo-600
                  px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors">
                <X size={11} /> Clear
              </button>
            ) : (
              <button onClick={handleNearMe} disabled={locating}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold
                  transition-colors disabled:opacity-50
                  ${d ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}>
                {locating
                  ? <><span className="animate-spin inline-block w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full" /> Finding…</>
                  : <><LocateFixed size={11} /> Near Me</>
                }
              </button>
            )}
          </div>
        </aside>
      )}

      <div className="relative flex-1 z-0" onClick={() => setSelected(null)}>
        <LeafletMap
          dark={d}
          places={filtered}
          selected={selected}
          onSelect={p => setSelected(prev => prev?.id === p.id ? null : p)}
          mapRef={mapRef}
          userLocation={userLocation}
        />

        <div className="absolute top-4 left-4 right-4 z-[500] flex items-start justify-between pointer-events-none">
          {!showSide ? (
            <button onClick={() => setShowSide(true)} style={{ pointerEvents: "auto" }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-all hover:scale-105
                ${d ? "bg-slate-900/90 border border-slate-700 text-slate-300" : "bg-white/95 border border-slate-200 text-slate-600"}`}>
              <Monitor size={16} />
            </button>
          ) : <div />}

          <div className="flex flex-col gap-2 items-end" style={{ pointerEvents: "auto" }}>
            <div className={`flex items-center gap-2 rounded-2xl px-3 py-2 shadow-xl
              ${d ? "bg-slate-900/90 border border-slate-800" : "bg-white/95 border border-slate-100"}`}>
              <Wifi size={12} className="text-green-500" />
              <div className={`h-3 w-px mx-1 ${d ? "bg-slate-700" : "bg-slate-200"}`} />
              <button onClick={() => setDark(v => !v)}
                className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors
                  ${d ? "text-amber-400 hover:bg-slate-800" : "text-indigo-500 hover:bg-slate-100"}`}>
                {d ? <Sun size={13} /> : <Moon size={13} />}
              </button>
              <button className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors
                ${d ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}>
                <Layers size={13} />
              </button>
              <button className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors
                ${d ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}>
                <Camera size={13} />
              </button>
            </div>

            <div className={`flex flex-col rounded-2xl overflow-hidden shadow-xl border
              ${d ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-100"}`}>
              <button onClick={() => mapRef.current?.zoomIn()}
                className={`flex h-10 w-10 items-center justify-center transition-colors border-b
                  ${d ? "text-slate-300 hover:bg-slate-800 border-slate-800" : "text-slate-600 hover:bg-slate-50 border-slate-100"}`}>
                <Plus size={15} />
              </button>
              <button onClick={() => mapRef.current?.zoomOut()}
                className={`flex h-10 w-10 items-center justify-center transition-colors
                  ${d ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"}`}>
                <Minus size={15} />
              </button>
            </div>

            <button onClick={handleNearMe}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-xl border transition-colors
                ${nearMeActive
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : d ? "bg-indigo-600/90 border-indigo-500/50 text-white hover:bg-indigo-600"
                      : "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700"}`}>
              <LocateFixed size={15} />
            </button>
          </div>
        </div>

        <div className={`absolute bottom-4 left-4 z-[500] rounded-2xl px-3 py-2.5 shadow-xl border
          ${d ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-100"}`}>
          <p className={`mb-1.5 text-xs font-bold uppercase tracking-wider ${d ? "text-slate-600" : "text-slate-400"}`}>Status</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#22c55e" }} />
            <span className={`text-xs font-medium ${d ? "text-slate-400" : "text-slate-600"}`}>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#ef4444" }} />
            <span className={`text-xs font-medium ${d ? "text-slate-400" : "text-slate-600"}`}>Closed</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#f97316" }} />
            <span className={`text-xs font-medium ${d ? "text-slate-400" : "text-slate-600"}`}>Limited</span>
          </div>
        </div>

        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-xl border
          ${d ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-100"}`}>
          <Route size={14} className="text-indigo-500" />
          <span className={`text-xs font-semibold ${d ? "text-slate-300" : "text-slate-600"}`}>Demo route</span>
          <span className={`h-3 w-px ${d ? "bg-slate-700" : "bg-slate-200"}`} />
          <span className="text-xs font-bold text-indigo-500">~12 min walk</span>
          <span className={`h-3 w-px ${d ? "bg-slate-700" : "bg-slate-200"}`} />
          <span className={`text-xs ${d ? "text-slate-500" : "text-slate-400"}`}>1.2 km</span>
        </div>

        {selected && (
          <div onClick={e => e.stopPropagation()}>
            <DetailDrawer p={selected} dark={d} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Map;