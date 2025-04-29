import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Sample apartment data (replace image URLs with placehold.co if you wish)
const apartmentsData = [
  {
    id: 1,
    title: 'Cozy 1 Bedroom Apartment',
    description: 'A nice furnished apartment in Maadi Sarayat.',
    price: 28000,
    bedrooms: 1,
    furnished: true,
    location: { lat: 30.0131, lng: 31.2244, address: 'Maadi Sarayat' },
    contact: { name: 'Ahmed', phone: '01000000001', email: 'ahmed@example.com' },
    images: [
      'https://placehold.co/300x200?text=Place%20your%20apartment%20here',
    ],
  },
  {
    id: 2,
    title: 'Spacious 3 Bedroom Apartment',
    description: 'Unfurnished, great for families in Degla.',
    price: 45000,
    bedrooms: 3,
    furnished: false,
    location: { lat: 30.0200, lng: 31.2200, address: 'Maadi Degla' },
    contact: { name: 'Sara', phone: '01000000002', email: 'sara@example.com' },
    images: [
      'https://placehold.co/300x200?text=Apartment%202%20Image%201',
      'https://placehold.co/300x200?text=Apartment%202%20Image%202',
    ],
  },
  {
    id: 3,
    title: 'Modern Studio Apartment',
    description: 'Perfect for singles, furnished with AC.',
    price: 20000,
    bedrooms: 0,
    furnished: true,
    location: { lat: 30.0155, lng: 31.2255, address: 'Zahraa Maadi' },
    contact: { name: 'Mohamed', phone: '01000000003', email: 'mohamed@example.com' },
    images: [
      'https://placehold.co/300x200?text=Apartment%203%20Image%201',
    ],
  },
];

const styles = {
  container: {
    maxWidth: 900,
    margin: 'auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  callUsSection: {
    background: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)',
    borderRadius: 8,
    padding: '18px 24px',
    margin: '0 auto 28px auto',
    maxWidth: 600,
    boxShadow: '0 2px 8px rgba(252,182,159,0.13)',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 18,
    fontWeight: 500,
    color: '#2d2d2d',
  },
  filters: {
    marginBottom: 20,
    display: 'flex',
    gap: 15,
    flexWrap: 'wrap',
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 6,
  },
  input: {
    padding: 8,
    flex: '1 1 150px',
    border: '1px solid #ced4da',
    borderRadius: 4,
  },
  select: {
    padding: 8,
    flex: '1 1 150px',
    border: '1px solid #ced4da',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  apartmentCard: {
    border: '1px solid #ddd',
    borderRadius: 8,
    marginBottom: 20,
    padding: 15,
    display: 'flex',
    gap: 15,
    flexWrap: 'wrap',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  apartmentImage: {
    width: 300,
    height: 200,
    objectFit: 'cover',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
  },
  apartmentDetails: {
    flex: '1 1 300px',
  },
  price: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  contactLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  mapContainer: {
    height: 400,
    width: '100%',
    borderRadius: 6,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    background: '#fff',
    padding: 20,
    borderRadius: 10,
    minWidth: 340,
    maxWidth: 600,
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    position: 'relative',
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 18,
    fontSize: 24,
    color: '#888',
    cursor: 'pointer',
    fontWeight: 'bold',
    background: 'none',
    border: 'none',
  },
  modalGallery: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },
  modalImage: {
    width: 250,
    height: 170,
    objectFit: 'cover',
    borderRadius: 6,
    border: '2px solid #eee',
    background: '#fafafa',
  },
};

function App() {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnished: '',
  });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState('');

  // Filter apartments based on filters state
  const filteredApartments = useMemo(() => {
    return apartmentsData.filter((apt) => {
      if (filters.minPrice && apt.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && apt.price > Number(filters.maxPrice)) return false;
      if (filters.bedrooms !== '' && apt.bedrooms !== Number(filters.bedrooms)) return false;
      if (filters.furnished !== '') {
        if (filters.furnished === 'true' && !apt.furnished) return false;
        if (filters.furnished === 'false' && apt.furnished) return false;
      }
      return true;
    });
  }, [filters]);

  // Open gallery modal
  const openGallery = (images, title) => {
    setGalleryImages(images);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  // Close gallery modal
  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryImages([]);
    setGalleryTitle('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Maadi Apartments for Rent</h1>
      <div style={styles.callUsSection}>
        <span role="img" aria-label="phone" style={{ fontSize: 28, color: '#ff6f00' }}>📞</span>
        <span>
          Call us on <a href="tel:01007701719" style={{ color: '#ff6f00', textDecoration: 'underline', fontWeight: 700 }}>01007701719</a> to have your apartment listed on our website
        </span>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="number"
          placeholder="Min Price (EGP)"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Max Price (EGP)"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={styles.input}
        />
        <select
          value={filters.bedrooms}
          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
          style={styles.select}
        >
          <option value="">Bedrooms (Any)</option>
          <option value="0">Studio</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4+ Bedrooms</option>
        </select>
        <select
          value={filters.furnished}
          onChange={(e) => setFilters({ ...filters, furnished: e.target.value })}
          style={styles.select}
        >
          <option value="">Furnished (Any)</option>
          <option value="true">Furnished</option>
          <option value="false">Unfurnished</option>
        </select>
      </div>

      {/* Apartments List */}
      {filteredApartments.length === 0 && <p>No apartments found matching your criteria.</p>}

      {filteredApartments.map((apt) => (
        <div key={apt.id} style={styles.apartmentCard}>
          {/* Only show the first image, and open gallery on click */}
          {apt.images.length > 0 && (
            <img
              src={apt.images[0]}
              alt={`${apt.title} image 1`}
              style={styles.apartmentImage}
              onClick={() => openGallery(apt.images, apt.title)}
              title="Click to view gallery"
            />
          )}

          <div style={styles.apartmentDetails}>
            <h2>{apt.title}</h2>
            <p>{apt.description}</p>
            <p style={styles.price}>
              <strong>Price:</strong> {apt.price.toLocaleString()} EGP
            </p>
            <p>
              <strong>Bedrooms:</strong> {apt.bedrooms === 0 ? 'Studio' : apt.bedrooms}
            </p>
            <p>
              <strong>Furnished:</strong> {apt.furnished ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Address:</strong> {apt.location.address}
            </p>
            <p>
              <strong>Contact:</strong> {apt.contact.name} - {apt.contact.phone} -{' '}
              <a href={`mailto:${apt.contact.email}`} style={styles.contactLink}>
                {apt.contact.email}
              </a>
            </p>
          </div>
        </div>
      ))}

      {/* Modal Gallery */}
      {galleryOpen && (
        <div style={styles.modalOverlay} onClick={closeGallery}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={closeGallery} title="Close">&times;</button>
            <h3 style={{ marginBottom: 10 }}>{galleryTitle}</h3>
            <div style={styles.modalGallery}>
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${galleryTitle} gallery ${idx + 1}`}
                  style={styles.modalImage}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <h2>Map</h2>
      <MapContainer
        center={[30.0131, 31.2244]}
        zoom={14}
        style={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredApartments.map((apt) => (
          <Marker key={apt.id} position={[apt.location.lat, apt.location.lng]}>
            <Popup>
              <strong>{apt.title}</strong>
              <br />
              {apt.location.address}
              <br />
              Price: {apt.price.toLocaleString()} EGP
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;

