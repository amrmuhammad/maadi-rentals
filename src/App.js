import React, { useState, useMemo, useEffect } from 'react';  // <-- Added useEffect here
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Sample apartment data
const apartmentsData = [
  {
    id: 1,
    title: 'Apartment #1',
    description: 'A nice furnished apartment.',
    price: 45000,
    bedrooms: 2,
    furnished: true,
    location: { lat: 30.0131, lng: 31.2244, address: 'Degla' },
    contact: { name: 'Amr', phone: '01007701719', email: '' },
    images: [
      'https://placehold.co/400x250?text=Place%20your%20apartment%20here',

    ],
  },/*
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
      'https://via.placeholder.com/300x200?text=Apartment+2+Image+1',
      'https://via.placeholder.com/300x200?text=Apartment+2+Image+2',
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
      'https://via.placeholder.com/300x200?text=Apartment+3+Image+1',
    ],
  },*/
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
  },
  placeholderImage: {
    width: 300,
    height: 200,
    objectFit: 'cover',
    borderRadius: 6,
    display: 'block',
    margin: '0 auto',
    // You can add a border or boxShadow if you want
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
};

function App() {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnished: '',
  });

  const [priceError, setPriceError] = useState('');  // <-- NEW: validation error state

  // Validate maxPrice >= minPrice whenever either changes
  useEffect(() => {
    if (filters.minPrice !== '' && filters.maxPrice !== '') {
      if (Number(filters.maxPrice) < Number(filters.minPrice)) {
        setPriceError('Max price must be greater than or equal to min price');
      } else {
        setPriceError('');
      }
    } else {
      setPriceError('');
    }
  }, [filters.minPrice, filters.maxPrice]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredApartments = useMemo(() => {
    if (priceError) return []; // Prevent filtering if validation error exists
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
  }, [filters, priceError]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Maadi Apartments for Rent</h1>

      <div
        style={{
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
        }}
      >
        <span role="img" aria-label="phone" style={{ fontSize: 28, color: '#ff6f00' }}>
          📞
        </span>
        <span>
          Send us a message on WhatsApp number{' '}
          <a
            href="tel:01007701719"
            style={{ color: '#ff6f00', textDecoration: 'underline', fontWeight: 700 }}
          >
            01007701719
          </a>{' '}
          to have your apartment listed on our website
        </span>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price (EGP)"
          value={filters.minPrice}
          onChange={handleFilterChange}
          style={styles.input}
          min="0"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price (EGP)"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          style={styles.input}
          min="0"
        />
        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleFilterChange}
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
          name="furnished"
          value={filters.furnished}
          onChange={handleFilterChange}
          style={styles.select}
        >
          <option value="">Furnished (Any)</option>
          <option value="true">Furnished</option>
          <option value="false">Unfurnished</option>
        </select>
      </div>

      {/* ======= HIGHLIGHTED CHANGE: Show validation error ======= */}
      {priceError && (
        <p style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>{priceError}</p>
      )}

      {/* Apartments List */}
      {filteredApartments.length === 0 && !priceError && (
        <p>No apartments found matching your criteria.</p>
      )}

      {filteredApartments.map((apt) => (
        <div key={apt.id} style={styles.apartmentCard}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 10 }}>
            {apt.images.length === 1 && apt.images[0].includes('Place%20your%20apartment%20here') ? (
		  <img
		    src={apt.images[0]}
		    alt="Place your apartment here"
		    style={styles.placeholderImage}
		  />
		) : (
		  apt.images.map((imgUrl, index) => (
		    <img
		      key={index}
		      src={imgUrl}
		      alt={`${apt.title} image ${index + 1}`}
		      style={{ width: 150, height: 100, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
		    />
		  ))
		)
	    }
          </div>

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

    </div>
  );
}

export default App;

