import React, { useState } from 'react'
import './App.css'

function App() {
  // Sample meter data
  const [meters, setMeters] = useState([
    {
      id: '001234',
      type: 'Sensus 620',
      dn: 'DN20',
      serial: 'ABC123456',
      supplier: 'ABC Kft.',
      manufacturer: 'Sensus',
      address: '1052 Budapest, Váci utca 15.',
      status: 'active',
      procurementDate: '2024-01-15',
      installDate: '2024-02-01',
      lastReading: '2024-11-15',
      currentReading: '1234.5',
      sealNumber: 'SEAL001'
    },
    {
      id: '001235',
      type: 'Itron Aquadis',
      dn: 'DN15',
      serial: 'XYZ789012',
      supplier: 'XYZ Zrt.',
      manufacturer: 'Itron',
      address: '',
      status: 'stock',
      procurementDate: '2024-03-10',
      installDate: '',
      lastReading: '',
      currentReading: '',
      sealNumber: ''
    },
    {
      id: '001236',
      type: 'Kamstrup Multical',
      dn: 'DN25',
      serial: 'KAM456789',
      supplier: 'DEF Kft.',
      manufacturer: 'Kamstrup',
      address: '1051 Budapest, Arany János utca 10.',
      status: 'maintenance',
      procurementDate: '2024-02-20',
      installDate: '2024-03-01',
      lastReading: '2024-10-28',
      currentReading: '987.3',
      sealNumber: 'SEAL002'
    }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({});
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  // Calculate statistics
  const stats = {
    active: meters.filter(m => m.status === 'active').length,
    stock: meters.filter(m => m.status === 'stock').length,
    maintenance: meters.filter(m => m.status === 'maintenance').length,
    scrapped: meters.filter(m => m.status === 'scrapped').length
  };

  // Filter meters based on status
  const filteredMeters = filterStatus === 'all' 
    ? meters 
    : meters.filter(m => m.status === filterStatus);

  // Status badge component
  const getStatusBadge = (status) => {
    const labels = {
      active: 'Aktív',
      stock: 'Raktáron',
      maintenance: 'Karbantartás',
      scrapped: 'Selejtezett'
    };

    return (
      <span className={`status-badge status-${status}`}>
        {labels[status]}
      </span>
    );
  };

  // Generate new meter ID
  const generateId = () => {
    const existingIds = meters.map(m => parseInt(m.id));
    const maxId = Math.max(...existingIds);
    return String(maxId + 1).padStart(6, '0');
  };

  // Open meter detail view
  const openMeterDetail = (meter) => {
    setSelectedMeter(meter);
    setActiveModal('meterDetail');
  };

  // Open action menu
  const toggleActionMenu = (meterId, event) => {
    event.stopPropagation(); // Prevent row click
    setShowActionMenu(showActionMenu === meterId ? null : meterId);
  };

  // Close action menu when clicking outside
  const closeActionMenu = () => {
    setShowActionMenu(null);
  };

  // Modal handlers
  const openModal = (modalType, meter = null) => {
    setActiveModal(modalType);
    setShowActionMenu(null); // Close action menu
    if (meter) {
      setFormData({ ...meter });
      setSelectedMeter(meter);
    } else {
      // Initialize form with default values
      if (modalType === 'procurement') {
        setFormData({
          supplier: '',
          manufacturer: '',
          type: '',
          dn: '',
          serial: '',
          procurementDate: new Date().toISOString().split('T')[0], // Today's date
          status: 'stock' // Default status for new meters
        });
      } else if (modalType === 'installation') {
        setFormData({
          selectedMeterId: '',
          country: 'Magyarország',
          city: '',
          zipCode: '',
          street: '',
          houseNumber: '',
          status: 'active' // Default status for installation
        });
      } else {
        setFormData({});
      }
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setFormData({});
    setSelectedMeter(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProcurementSubmit = () => {
    // Validate required fields
    const requiredFields = ['supplier', 'manufacturer', 'type', 'dn', 'serial', 'procurementDate'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Kérjük töltse ki a következő kötelező mezőket: ${missingFields.join(', ')}`);
      return;
    }

    // Check if serial number already exists
    const serialExists = meters.some(meter => meter.serial === formData.serial);
    if (serialExists) {
      alert('Ez a sorozatszám már létezik a rendszerben!');
      return;
    }

    // Create new meter
    const newMeter = {
      id: generateId(),
      type: formData.type,
      dn: formData.dn,
      serial: formData.serial,
      supplier: formData.supplier,
      manufacturer: formData.manufacturer,
      address: '',
      status: formData.status,
      procurementDate: formData.procurementDate,
      installDate: '',
      lastReading: '',
      currentReading: '',
      sealNumber: ''
    };

    // Add to meters list
    setMeters(prev => [...prev, newMeter]);
    
    // Show success message
    alert(`Új vízmérő sikeresen rögzítve!\nAzonosító: #${newMeter.id}\nTípus: ${newMeter.type} ${newMeter.dn}\nÁllapot: ${formData.status === 'stock' ? 'Raktáron' : formData.status === 'active' ? 'Aktív' : 'Karbantartás'}`);
    
    // Close modal
    closeModal();
  };

  const handleInstallationSubmit = () => {
    // Validate required fields
    const requiredFields = ['selectedMeterId', 'country', 'city', 'zipCode', 'street', 'houseNumber'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Kérjük töltse ki a következő kötelező mezőket: ${missingFields.join(', ')}`);
      return;
    }

    // Find the selected meter
    const selectedMeter = meters.find(meter => meter.id === formData.selectedMeterId);
    if (!selectedMeter) {
      alert('Kérjük válasszon ki egy eszközt!');
      return;
    }

    // Create full address
    const fullAddress = `${formData.zipCode} ${formData.city}, ${formData.street} ${formData.houseNumber}.`;
    const installDate = new Date().toISOString().split('T')[0];

    // Update meter with installation data
    setMeters(prev => prev.map(meter => 
      meter.id === formData.selectedMeterId 
        ? {
            ...meter,
            address: fullAddress,
            status: formData.status || 'active',
            installDate: installDate
          }
        : meter
    ));
    
    // Show success message
    alert(`Vízmérő sikeresen telepítve!\nEszköz: #${selectedMeter.id} - ${selectedMeter.type} ${selectedMeter.dn}\nCím: ${fullAddress}\nÁllapot: ${formData.status === 'active' ? 'Aktív' : formData.status === 'stock' ? 'Raktáron' : 'Karbantartás'}\nTelepítés dátuma: ${installDate}`);
    
    // Close modal
    closeModal();
  };

  const handleSubmit = () => {
    if (activeModal === 'procurement') {
      handleProcurementSubmit();
    } else if (activeModal === 'installation') {
      handleInstallationSubmit();
    } else {
      // Handle other modal types
      alert('Form submitted successfully!');
      closeModal();
    }
  };

  return (
    <div className="app" onClick={closeActionMenu}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>🌊 Vízmű Kft.</h1>
            <span>Vízmérő Nyilvántartás</span>
          </div>
          <div className="header-info">
            <span>2025.08.13 | 10:50</span>
            <div className="test-badge">Teszt Környezet</div>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => openModal('procurement')}
            className="btn btn-success"
          >
            + Új Óra Beszerzés
          </button>
          <button 
            onClick={() => openModal('installation')}
            className="btn btn-primary"
          >
            📍 Telepítés
          </button>
          <button 
            onClick={() => openModal('reading')}
            className="btn btn-warning"
          >
            👁 Leolvasás
          </button>
          <button 
            onClick={() => openModal('maintenance')}
            className="btn btn-info"
          >
            🔧 Karbantartás
          </button>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <h3>Összesítő</h3>
          <div className="stats-grid">
            <div 
              onClick={() => setFilterStatus(filterStatus === 'active' ? 'all' : 'active')}
              className={`stat-card ${filterStatus === 'active' ? 'active' : ''}`}
            >
              <h4>Aktív Órák</h4>
              <div className="stat-number green">{stats.active}</div>
              <div>db</div>
            </div>

            <div 
              onClick={() => setFilterStatus(filterStatus === 'stock' ? 'all' : 'stock')}
              className={`stat-card ${filterStatus === 'stock' ? 'active' : ''}`}
            >
              <h4>Raktáron</h4>
              <div className="stat-number blue">{stats.stock}</div>
              <div>db</div>
            </div>

            <div 
              onClick={() => setFilterStatus(filterStatus === 'maintenance' ? 'all' : 'maintenance')}
              className={`stat-card ${filterStatus === 'maintenance' ? 'active' : ''}`}
            >
              <h4>Karbantartásra vár</h4>
              <div className="stat-number orange">{stats.maintenance}</div>
              <div>db</div>
            </div>

            <div 
              onClick={() => setFilterStatus(filterStatus === 'scrapped' ? 'all' : 'scrapped')}
              className={`stat-card ${filterStatus === 'scrapped' ? 'active' : ''}`}
            >
              <h4>Selejtezett</h4>
              <div className="stat-number red">{stats.scrapped}</div>
              <div>db</div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>
              Vízmérő Nyilvántartás
              {filterStatus !== 'all' && (
                <span className="filter-info">
                  ({filteredMeters.length} találat)
                </span>
              )}
            </h2>
            <div className="table-actions">
              <button className="btn btn-secondary">
                🔍 Keresés
              </button>
              <button className="btn btn-primary">
                📥 Exportálás
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vízmérő</th>
                  <th>Cím</th>
                  <th>Állapot</th>
                  <th>Utolsó leolvasás</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeters.map((meter) => (
                  <tr 
                    key={meter.id} 
                    className="table-row-clickable" 
                    onClick={() => openMeterDetail(meter)}
                  >
                    <td>
                      <div className="meter-info">
                        <div className="meter-id">#{meter.id}</div>
                        <div className="meter-type">{meter.type} {meter.dn}</div>
                        <div className="meter-serial">SN: {meter.serial}</div>
                      </div>
                    </td>
                    <td className="address-cell">
                      {meter.address || '-'}
                    </td>
                    <td>
                      <div className="status-cell">
                        {getStatusBadge(meter.status)}
                        {meter.lastReading && (
                          <div className="last-reading">
                            Utolsó: {meter.lastReading}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="reading-cell">
                      {meter.currentReading ? `${meter.currentReading} m³` : '-'}
                    </td>
                    <td>
                      <div className="actions-cell">
                        {meter.status === 'active' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('reading', meter);
                            }}
                            className="action-link blue"
                          >
                            Leolvas
                          </button>
                        )}
                        {meter.status === 'stock' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('installation', meter);
                            }}
                            className="action-link green"
                          >
                            Telepít
                          </button>
                        )}
                        {meter.status === 'maintenance' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('maintenance', meter);
                            }}
                            className="action-link orange"
                          >
                            Javít
                          </button>
                        )}
                        <div className="action-menu-container">
                          <button 
                            className="action-link gray"
                            onClick={(e) => toggleActionMenu(meter.id, e)}
                          >
                            ⋯
                          </button>
                          {showActionMenu === meter.id && (
                            <div className="action-menu">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('editMeter', meter);
                                }}
                                className="action-menu-item"
                              >
                                ✏️ Alapadatok szerkesztése
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('reading', meter);
                                }}
                                className="action-menu-item"
                              >
                                📊 Új leolvasás
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('maintenance', meter);
                                }}
                                className="action-menu-item"
                              >
                                🔧 Karbantartás ütemezése
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('replaceMeter', meter);
                                }}
                                className="action-menu-item"
                              >
                                🔄 Óracsere
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('deinstall', meter);
                                }}
                                className="action-menu-item warning"
                              >
                                🗑️ Leszerelés
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMeters.length === 0 && (
            <div className="empty-state">
              Nincsenek megjeleníthető vízmérők a kiválasztott szűrő alapján.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Meter Detail Modal */}
            {activeModal === 'meterDetail' && selectedMeter && (
              <>
                <div className="modal-header">
                  <h3>Vízmérő részletes adatai</h3>
                  <button onClick={closeModal} className="modal-close-btn">×</button>
                </div>
                
                <div className="detail-container">
                  {/* Basic Information */}
                  <div className="detail-section">
                    <h4 className="detail-section-title">Alapadatok</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Vízmérő azonosító:</label>
                        <span className="detail-value">#{selectedMeter.id}</span>
                      </div>
                      <div className="detail-item">
                        <label>Típus:</label>
                        <span className="detail-value">{selectedMeter.type}</span>
                      </div>
                      <div className="detail-item">
                        <label>DN méret:</label>
                        <span className="detail-value">{selectedMeter.dn}</span>
                      </div>
                      <div className="detail-item">
                        <label>Sorozatszám:</label>
                        <span className="detail-value">{selectedMeter.serial}</span>
                      </div>
                      <div className="detail-item">
                        <label>Gyártó:</label>
                        <span className="detail-value">{selectedMeter.manufacturer}</span>
                      </div>
                      <div className="detail-item">
                        <label>Beszállító:</label>
                        <span className="detail-value">{selectedMeter.supplier}</span>
                      </div>
                      <div className="detail-item">
                        <label>Beszerzés dátuma:</label>
                        <span className="detail-value">{selectedMeter.procurementDate}</span>
                      </div>
                      <div className="detail-item">
                        <label>Jelenlegi állapot:</label>
                        <span className="detail-value">
                          {getStatusBadge(selectedMeter.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Installation Information */}
                  {selectedMeter.address && (
                    <div className="detail-section">
                      <h4 className="detail-section-title">Telepítési adatok</h4>
                      <div className="detail-grid">
                        <div className="detail-item full-width">
                          <label>Telepítési cím:</label>
                          <span className="detail-value">{selectedMeter.address}</span>
                        </div>
                        {selectedMeter.installDate && (
                          <div className="detail-item">
                            <label>Telepítés dátuma:</label>
                            <span className="detail-value">{selectedMeter.installDate}</span>
                          </div>
                        )}
                        {selectedMeter.sealNumber && (
                          <div className="detail-item">
                            <label>Plomba száma:</label>
                            <span className="detail-value">{selectedMeter.sealNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reading Information */}
                  <div className="detail-section">
                    <h4 className="detail-section-title">Leolvasási adatok</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Aktuális állás:</label>
                        <span className="detail-value">
                          {selectedMeter.currentReading ? `${selectedMeter.currentReading} m³` : 'Nincs adat'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Utolsó leolvasás:</label>
                        <span className="detail-value">
                          {selectedMeter.lastReading || 'Nincs adat'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="detail-section">
                    <h4 className="detail-section-title">Gyors műveletek</h4>
                    <div className="quick-actions">
                      <button 
                        onClick={() => openModal('editMeter', selectedMeter)}
                        className="btn btn-primary btn-sm"
                      >
                        ✏️ Szerkesztés
                      </button>
                      {selectedMeter.status === 'active' && (
                        <button 
                          onClick={() => openModal('reading', selectedMeter)}
                          className="btn btn-success btn-sm"
                        >
                          📊 Új leolvasás
                        </button>
                      )}
                      {selectedMeter.status === 'stock' && (
                        <button 
                          onClick={() => openModal('installation', selectedMeter)}
                          className="btn btn-info btn-sm"
                        >
                          📍 Telepítés
                        </button>
                      )}
                      <button 
                        onClick={() => openModal('maintenance', selectedMeter)}
                        className="btn btn-warning btn-sm"
                      >
                        🔧 Karbantartás
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Procurement Modal */}
            {activeModal === 'procurement' && (
              <>
                <h3>Új Óra Beszerzése</h3>
                <div className="form-container">
                  <div className="form-group">
                    <label className="form-label">Beszállító *</label>
                    <input
                      type="text"
                      placeholder="pl. ABC Kft."
                      value={formData.supplier || ''}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gyártó *</label>
                    <input
                      type="text"
                      placeholder="pl. Sensus, Itron, Kamstrup"
                      value={formData.manufacturer || ''}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Típus *</label>
                    <input
                      type="text"
                      placeholder="pl. 620, Aquadis, Multical"
                      value={formData.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">DN *</label>
                    <select
                      value={formData.dn || ''}
                      onChange={(e) => handleInputChange('dn', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Válassz DN méretet</option>
                      <option value="DN15">DN15</option>
                      <option value="DN20">DN20</option>
                      <option value="DN25">DN25</option>
                      <option value="DN32">DN32</option>
                      <option value="DN40">DN40</option>
                      <option value="DN50">DN50</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sorozatszám *</label>
                    <input
                      type="text"
                      placeholder="Egyedi gyári azonosító"
                      value={formData.serial || ''}
                      onChange={(e) => handleInputChange('serial', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Beszerzés dátuma *</label>
                    <input
                      type="date"
                      value={formData.procurementDate || ''}
                      onChange={(e) => handleInputChange('procurementDate', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Állapot</label>
                    <select
                      value={formData.status || 'stock'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="form-input"
                    >
                      <option value="stock">Raktáron</option>
                      <option value="active">Aktív</option>
                      <option value="maintenance">Karbantartásra vár</option>
                    </select>
                  </div>

                  <p className="form-note">* Kötelező mezők</p>
                </div>
              </>
            )}

            {/* Installation Modal */}
            {activeModal === 'installation' && (
              <>
                <h3>Telepítés</h3>
                <div className="form-container">
                  {/* Device Selection */}
                  <div className="form-section">
                    <h4 className="form-section-title">1. Eszköz kiválasztása</h4>
                    
                    <div className="form-group">
                      <label className="form-label">Elérhető eszközök *</label>
                      <select
                        value={formData.selectedMeterId || ''}
                        onChange={(e) => handleInputChange('selectedMeterId', e.target.value)}
                        className="form-input"
                      >
                        <option value="">Válassz eszközt...</option>
                        {meters
                          .filter(meter => meter.status === 'stock' || !meter.address)
                          .map(meter => (
                            <option key={meter.id} value={meter.id}>
                              #{meter.id} - {meter.type} {meter.dn} (SN: {meter.serial})
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    {/* Display selected device details */}
                    {formData.selectedMeterId && (
                      <div className="device-details">
                        {(() => {
                          const selectedDevice = meters.find(m => m.id === formData.selectedMeterId);
                          return selectedDevice ? (
                            <div className="device-info-card">
                              <h5>Kiválasztott eszköz adatai:</h5>
                              <p><strong>Típus:</strong> {selectedDevice.type}</p>
                              <p><strong>DN:</strong> {selectedDevice.dn}</p>
                              <p><strong>Sorozatszám:</strong> {selectedDevice.serial}</p>
                              <p><strong>Gyártó:</strong> {selectedDevice.manufacturer}</p>
                              <p><strong>Beszállító:</strong> {selectedDevice.supplier}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Address Section */}
                  <div className="form-section">
                    <h4 className="form-section-title">2. Cím megadása</h4>
                    
                    <div className="form-group">
                      <label className="form-label">Ország *</label>
                      <select
                        value={formData.country || 'Magyarország'}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="form-input"
                      >
                        <option value="Magyarország">Magyarország</option>
                        <option value="Románia">Románia</option>
                        <option value="Szlovákia">Szlovákia</option>
                        <option value="Szerbia">Szerbia</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Város *</label>
                        <input
                          type="text"
                          placeholder="pl. Budapest"
                          value={formData.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Irányítószám *</label>
                        <input
                          type="text"
                          placeholder="pl. 1052"
                          value={formData.zipCode || ''}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Utca *</label>
                      <input
                        type="text"
                        placeholder="pl. Váci utca"
                        value={formData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Házszám *</label>
                      <input
                        type="text"
                        placeholder="pl. 15, 23/A, 45-47"
                        value={formData.houseNumber || ''}
                        onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    {/* Address Preview */}
                    {formData.zipCode && formData.city && formData.street && formData.houseNumber && (
                      <div className="address-preview">
                        <strong>Teljes cím:</strong> {formData.zipCode} {formData.city}, {formData.street} {formData.houseNumber}.
                      </div>
                    )}
                  </div>

                  {/* Status Section */}
                  <div className="form-section">
                    <h4 className="form-section-title">3. Állapot</h4>
                    
                    <div className="form-group">
                      <label className="form-label">Telepítés utáni állapot</label>
                      <select
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="form-input"
                      >
                        <option value="active">Aktív</option>
                        <option value="stock">Raktáron</option>
                        <option value="maintenance">Karbantartásra vár</option>
                      </select>
                    </div>
                  </div>

                  <p className="form-note">* Kötelező mezők</p>
                </div>
              </>
            )}

            {/* Other Modals */}
            {activeModal !== 'procurement' && activeModal !== 'installation' && activeModal !== 'meterDetail' && (
              <>
                <h3>
                  {activeModal === 'reading' && 'Leolvasás'}
                  {activeModal === 'maintenance' && 'Karbantartás'}
                  {activeModal === 'editMeter' && 'Vízmérő szerkesztése'}
                  {activeModal === 'replaceMeter' && 'Óracsere'}
                  {activeModal === 'deinstall' && 'Leszerelés'}
                </h3>
                <p>
                  Ez a funkció a következő lépésben lesz implementálva.
                </p>
              </>
            )}

            {/* Modal Actions - only show for non-detail modals */}
            {activeModal !== 'meterDetail' && (
              <div className="modal-actions">
                <button onClick={closeModal} className="btn btn-secondary">
                  Mégse
                </button>
                <button onClick={handleSubmit} className="btn btn-primary">
                  {activeModal === 'procurement' ? 'Rögzítés' : 
                   activeModal === 'installation' ? 'Telepítés' : 'OK'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App