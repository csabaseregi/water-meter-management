
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [meters, setMeters] = useState([]);
  const [filteredMeters, setFilteredMeters] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [showInstallationModal, setShowInstallationModal] = useState(false);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Form states
  const [procurementForm, setProcurementForm] = useState({
    type: '',
    dn: '',
    serial: '',
    supplier: '',
    manufacturer: '',
    quantity: 1
  });

  const [installationForm, setInstallationForm] = useState({
    meterId: '',
    address: '',
    installDate: '',
    sealNumber: ''
  });

  const [readingForm, setReadingForm] = useState({
    meterId: '',
    value: '',
    readingDate: ''
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    meterId: '',
    reason: '',
    date: '',
    notes: ''
  });

  // Sample data
  useEffect(() => {
    const sampleMeters = [
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
        type: 'Sensus 620',
        dn: 'DN15',
        serial: 'ABC123457',
        supplier: 'ABC Kft.',
        manufacturer: 'Sensus',
        address: '',
        status: 'stock',
        procurementDate: '2024-01-15',
        installDate: '',
        lastReading: '',
        currentReading: '0',
        sealNumber: ''
      },
      {
        id: '001236',
        type: 'Itron Aquadis+',
        dn: 'DN20',
        serial: 'ITR789123',
        supplier: 'XYZ Kft.',
        manufacturer: 'Itron',
        address: '1053 Budapest, Kossuth Lajos utca 8.',
        status: 'maintenance',
        procurementDate: '2024-02-01',
        installDate: '2024-02-15',
        lastReading: '2024-11-10',
        currentReading: '856.3',
        sealNumber: 'SEAL002'
      }
    ];
    setMeters(sampleMeters);
    setFilteredMeters(sampleMeters);
  }, []);

  // Filter meters
  useEffect(() => {
    if (filter === 'all') {
      setFilteredMeters(meters);
    } else {
      setFilteredMeters(meters.filter(meter => meter.status === filter));
    }
  }, [filter, meters]);

  // Get statistics
  const getStats = () => {
    return {
      total: meters.length,
      active: meters.filter(m => m.status === 'active').length,
      stock: meters.filter(m => m.status === 'stock').length,
      maintenance: meters.filter(m => m.status === 'maintenance').length,
      scrapped: meters.filter(m => m.status === 'scrapped').length
    };
  };

  // Get available meters for installation
  const getAvailableMeters = () => {
    return meters.filter(meter => meter.status === 'stock');
  };

  // Get active meters for reading/maintenance
  const getActiveMeters = () => {
    return meters.filter(meter => meter.status === 'active');
  };

  // Get meters for reading (active and maintenance status)
  const getReadingMeters = () => {
    return meters.filter(meter => meter.status === 'active' || meter.status === 'maintenance');
  };

  // Handle procurement
  const handleProcurement = (e) => {
    e.preventDefault();
    const newMeters = [];
    for (let i = 0; i < parseInt(procurementForm.quantity); i++) {
      const newMeter = {
        id: String(Math.floor(Math.random() * 1000000)).padStart(6, '0'),
        type: procurementForm.type,
        dn: procurementForm.dn,
        serial: procurementForm.serial + (i > 0 ? `-${i}` : ''),
        supplier: procurementForm.supplier,
        manufacturer: procurementForm.manufacturer,
        address: '',
        status: 'stock',
        procurementDate: new Date().toISOString().split('T')[0],
        installDate: '',
        lastReading: '',
        currentReading: '0',
        sealNumber: ''
      };
      newMeters.push(newMeter);
    }
    setMeters([...meters, ...newMeters]);
    setProcurementForm({
      type: '',
      dn: '',
      serial: '',
      supplier: '',
      manufacturer: '',
      quantity: 1
    });
    setShowProcurementModal(false);
  };

  // Handle installation
  const handleInstallation = (e) => {
    e.preventDefault();
    setMeters(meters.map(meter => 
      meter.id === installationForm.meterId 
        ? {
            ...meter,
            address: installationForm.address,
            installDate: installationForm.installDate,
            sealNumber: installationForm.sealNumber,
            status: 'active'
          }
        : meter
    ));
    setInstallationForm({
      meterId: '',
      address: '',
      installDate: '',
      sealNumber: ''
    });
    setShowInstallationModal(false);
  };

  // Handle reading
  const handleReading = (e) => {
    e.preventDefault();
    setMeters(meters.map(meter => 
      meter.id === readingForm.meterId 
        ? {
            ...meter,
            currentReading: readingForm.value,
            lastReading: readingForm.readingDate
          }
        : meter
    ));
    setReadingForm({
      meterId: '',
      value: '',
      readingDate: ''
    });
    setShowReadingModal(false);
  };

  // Handle maintenance
  const handleMaintenance = (e) => {
    e.preventDefault();
    setMeters(meters.map(meter => 
      meter.id === maintenanceForm.meterId 
        ? {
            ...meter,
            status: 'maintenance',
            maintenanceReason: maintenanceForm.reason,
            maintenanceDate: maintenanceForm.date,
            maintenanceNotes: maintenanceForm.notes
          }
        : meter
    ));
    setMaintenanceForm({
      meterId: '',
      reason: '',
      date: '',
      notes: ''
    });
    setShowMaintenanceModal(false);
  };

  const stats = getStats();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>Vízóra Adatkezelő Rendszer</h1>
            <span>MOHU Víziközmű Kft.</span>
          </div>
          <div className="header-info">
            <span className="test-badge">TEST KÖRNYEZET</span>
            <span>Bejelentkezve: Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => setShowProcurementModal(true)}
          >
            Új óra beszerzés
          </button>
          <button 
            className="btn btn-success"
            onClick={() => setShowInstallationModal(true)}
          >
            Telepítés
          </button>
          <button 
            className="btn btn-info"
            onClick={() => setShowReadingModal(true)}
          >
            Leolvasás
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => setShowMaintenanceModal(true)}
          >
            Karbantartás
          </button>
        </div>

        {/* Statistics */}
        <div className="stats-section">
          <h3>Óraállomány</h3>
          <div className="stats-grid">
            <div 
              className={`stat-card ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <h4>Összes óra</h4>
              <div className="stat-number blue">{stats.total}</div>
            </div>
            <div 
              className={`stat-card ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              <h4>Aktív</h4>
              <div className="stat-number green">{stats.active}</div>
            </div>
            <div 
              className={`stat-card ${filter === 'stock' ? 'active' : ''}`}
              onClick={() => setFilter('stock')}
            >
              <h4>Raktáron</h4>
              <div className="stat-number blue">{stats.stock}</div>
            </div>
            <div 
              className={`stat-card ${filter === 'maintenance' ? 'active' : ''}`}
              onClick={() => setFilter('maintenance')}
            >
              <h4>Karbantartásban</h4>
              <div className="stat-number orange">{stats.maintenance}</div>
            </div>
            <div 
              className={`stat-card ${filter === 'scrapped' ? 'active' : ''}`}
              onClick={() => setFilter('scrapped')}
            >
              <h4>Selejtezett</h4>
              <div className="stat-number red">{stats.scrapped}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>Vízórák {filter !== 'all' && <span className="filter-info">- {filter}</span>}</h2>
          </div>
          
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Óra azonosító</th>
                  <th>Cím</th>
                  <th>Státusz</th>
                  <th>Aktuális állás</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeters.map((meter) => (
                  <tr key={meter.id} className="table-row-clickable">
                    <td>
                      <div className="meter-info">
                        <div className="meter-id">{meter.id}</div>
                        <div className="meter-type">{meter.type} {meter.dn}</div>
                        <div className="meter-serial">SN: {meter.serial}</div>
                      </div>
                    </td>
                    <td>
                      <div className="address-cell">
                        {meter.address || '-'}
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-badge status-${meter.status}`}>
                          {meter.status === 'active' ? 'Aktív' :
                           meter.status === 'stock' ? 'Raktáron' :
                           meter.status === 'maintenance' ? 'Karbantartásban' :
                           'Selejtezett'}
                        </span>
                        {meter.lastReading && (
                          <div className="last-reading">
                            Utolsó leolvasás: {meter.lastReading}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="reading-cell">
                        {meter.currentReading} m³
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="action-link blue"
                          onClick={() => {
                            setSelectedMeter(meter);
                            setShowDetails(true);
                          }}
                        >
                          Részletek
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredMeters.length === 0 && (
              <div className="empty-state">
                Nincs megjeleníthető óra.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Procurement Modal */}
      {showProcurementModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Új óra beszerzés</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowProcurementModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProcurement}>
              <div className="form-container">
                <div className="form-section">
                  <div className="form-section-title">Óra adatok</div>
                  <div className="form-group">
                    <label className="form-label">Óra típusa *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={procurementForm.type}
                      onChange={(e) => setProcurementForm({...procurementForm, type: e.target.value})}
                      placeholder="pl. Sensus 620"
                      required
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">DN méret *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={procurementForm.dn}
                        onChange={(e) => setProcurementForm({...procurementForm, dn: e.target.value})}
                        placeholder="pl. DN20"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sorozatszám *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={procurementForm.serial}
                        onChange={(e) => setProcurementForm({...procurementForm, serial: e.target.value})}
                        placeholder="pl. ABC123456"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Beszállító *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={procurementForm.supplier}
                        onChange={(e) => setProcurementForm({...procurementForm, supplier: e.target.value})}
                        placeholder="pl. ABC Kft."
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gyártó *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={procurementForm.manufacturer}
                        onChange={(e) => setProcurementForm({...procurementForm, manufacturer: e.target.value})}
                        placeholder="pl. Sensus"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mennyiség *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={procurementForm.quantity}
                      onChange={(e) => setProcurementForm({...procurementForm, quantity: e.target.value})}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProcurementModal(false)}>
                  Mégse
                </button>
                <button type="submit" className="btn btn-primary">
                  Beszerzés rögzítése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installation Modal */}
      {showInstallationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Óra telepítés</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowInstallationModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleInstallation}>
              <div className="form-container">
                <div className="form-section">
                  <div className="form-section-title">Telepítési adatok</div>
                  
                  <div className="form-group">
                    <label className="form-label">Óra kiválasztása *</label>
                    <select
                      className="form-input"
                      value={installationForm.meterId}
                      onChange={(e) => setInstallationForm({...installationForm, meterId: e.target.value})}
                      required
                    >
                      <option value="">Válasszon órát...</option>
                      {getAvailableMeters().map(meter => (
                        <option key={meter.id} value={meter.id}>
                          {meter.id} - {meter.type} {meter.dn} (SN: {meter.serial})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telepítési cím *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={installationForm.address}
                      onChange={(e) => setInstallationForm({...installationForm, address: e.target.value})}
                      placeholder="pl. 1052 Budapest, Váci utca 15."
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Telepítés dátuma *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={installationForm.installDate}
                        onChange={(e) => setInstallationForm({...installationForm, installDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Plomba száma *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={installationForm.sealNumber}
                        onChange={(e) => setInstallationForm({...installationForm, sealNumber: e.target.value})}
                        placeholder="pl. SEAL001"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInstallationModal(false)}>
                  Mégse
                </button>
                <button type="submit" className="btn btn-success">
                  Telepítés rögzítése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reading Modal */}
      {showReadingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Óraállás leolvasás</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowReadingModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleReading}>
              <div className="form-container">
                <div className="form-section">
                  <div className="form-section-title">Leolvasási adatok</div>
                  
                  <div className="form-group">
                    <label className="form-label">Óra kiválasztása *</label>
                    <select
                      className="form-input"
                      value={readingForm.meterId}
                      onChange={(e) => setReadingForm({...readingForm, meterId: e.target.value})}
                      required
                    >
                      <option value="">Válasszon órát...</option>
                      {getReadingMeters().map(meter => (
                        <option key={meter.id} value={meter.id}>
                          {meter.id} - {meter.address} (Jelenlegi: {meter.currentReading} m³) - {meter.status === 'active' ? 'Aktív' : 'Karbantartásban'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Óraállás (m³) *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        value={readingForm.value}
                        onChange={(e) => setReadingForm({...readingForm, value: e.target.value})}
                        placeholder="pl. 1234.5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Leolvasás dátuma *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={readingForm.readingDate}
                        onChange={(e) => setReadingForm({...readingForm, readingDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReadingModal(false)}>
                  Mégse
                </button>
                <button type="submit" className="btn btn-info">
                  Leolvasás rögzítése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Karbantartás</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowMaintenanceModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleMaintenance}>
              <div className="form-container">
                <div className="form-section">
                  <div className="form-section-title">Karbantartási adatok</div>
                  
                  <div className="form-group">
                    <label className="form-label">Aktív óra kiválasztása *</label>
                    <select
                      className="form-input"
                      value={maintenanceForm.meterId}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, meterId: e.target.value})}
                      required
                    >
                      <option value="">Válasszon órát...</option>
                      {getActiveMeters().map(meter => (
                        <option key={meter.id} value={meter.id}>
                          {meter.id} - {meter.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Karbantartás oka *</label>
                      <select
                        className="form-input"
                        value={maintenanceForm.reason}
                        onChange={(e) => setMaintenanceForm({...maintenanceForm, reason: e.target.value})}
                        required
                      >
                        <option value="">Válasszon okot...</option>
                        <option value="plomba_csere">Plomba csere</option>
                        <option value="oracsere">Óracsere</option>
                        <option value="javitas">Javítás</option>
                        <option value="egyeb">Egyéb</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Karbantartás időpontja *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={maintenanceForm.date}
                        onChange={(e) => setMaintenanceForm({...maintenanceForm, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Megjegyzés</label>
                    <textarea
                      className="form-input"
                      value={maintenanceForm.notes}
                      onChange={(e) => setMaintenanceForm({...maintenanceForm, notes: e.target.value})}
                      placeholder="További információk a karbantartásról..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMaintenanceModal(false)}>
                  Mégse
                </button>
                <button type="submit" className="btn btn-warning">
                  Karbantartás rögzítése
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedMeter && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Óra részletek - {selectedMeter.id}</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="detail-container">
              <div className="detail-section">
                <div className="detail-section-title">Alapadatok</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Óra azonosító</label>
                    <div className="detail-value">{selectedMeter.id}</div>
                  </div>
                  <div className="detail-item">
                    <label>Típus</label>
                    <div className="detail-value">{selectedMeter.type}</div>
                  </div>
                  <div className="detail-item">
                    <label>DN méret</label>
                    <div className="detail-value">{selectedMeter.dn}</div>
                  </div>
                  <div className="detail-item">
                    <label>Sorozatszám</label>
                    <div className="detail-value">{selectedMeter.serial}</div>
                  </div>
                  <div className="detail-item">
                    <label>Gyártó</label>
                    <div className="detail-value">{selectedMeter.manufacturer}</div>
                  </div>
                  <div className="detail-item">
                    <label>Beszállító</label>
                    <div className="detail-value">{selectedMeter.supplier}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Telepítési adatok</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Státusz</label>
                    <div className="detail-value">
                      <span className={`status-badge status-${selectedMeter.status}`}>
                        {selectedMeter.status === 'active' ? 'Aktív' :
                         selectedMeter.status === 'stock' ? 'Raktáron' :
                         selectedMeter.status === 'maintenance' ? 'Karbantartásban' :
                         'Selejtezett'}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item full-width">
                    <label>Telepítési cím</label>
                    <div className="detail-value">{selectedMeter.address || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Beszerzés dátuma</label>
                    <div className="detail-value">{selectedMeter.procurementDate}</div>
                  </div>
                  <div className="detail-item">
                    <label>Telepítés dátuma</label>
                    <div className="detail-value">{selectedMeter.installDate || '-'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Plomba száma</label>
                    <div className="detail-value">{selectedMeter.sealNumber || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-title">Leolvasási adatok</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Aktuális állás</label>
                    <div className="detail-value">{selectedMeter.currentReading} m³</div>
                  </div>
                  <div className="detail-item">
                    <label>Utolsó leolvasás</label>
                    <div className="detail-value">{selectedMeter.lastReading || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDetails(false)}>
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

export default App;
