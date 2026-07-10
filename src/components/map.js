const MapComponent = {
  render() {
    return `
      <div class="map-wrapper">
        <h4>Lokasi Kami</h4>
        <div id="farmMap" class="map-container"></div>
      </div>
    `;
  },

  afterRender() {
    const apiKey = '51nFcY1jky0o1ENnfYAU';

    const lokasi = {
      name: 'Dunax Farm',
      alamat: 'Wonogiri, Jawa Tengah',
      koordinat: [110.92761312623486, -7.771944858232087],
    };

    const map = new maplibregl.Map({
      container: 'farmMap',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: lokasi.koordinat,
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl());

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lokasi.koordinat[1]},${lokasi.koordinat[0]}`;

    const popup = new maplibregl.Popup({
      offset: 35,
      closeButton: true,
      closeOnClick: true,
    }).setHTML(`
      <div style="color: #333 !important; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-width: 200px; padding: 5px;">
        <h5 style="margin: 0 0 5px 0; color: #2d5a27; font-size: 15px; font-weight: bold;">${lokasi.name}</h5>
        <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.4; color: #555;">
          📍 ${lokasi.alamat}
        </p>
        
        <a href="${googleMapsUrl}" target="_blank" rel="noopener" 
           style="display: block; background-color: #28a745; color: white !important; 
                  text-decoration: none; text-align: center; padding: 10px; 
                  border-radius: 8px; font-size: 13px; font-weight: 600;
                  transition: background-color 0.2s;">
          Petunjuk Arah
        </a>

        <hr style="margin: 12px 0; border: 0; border-top: 1px solid #eee;" />
        <div style="text-align: center;">
          <small style="color: #bbb; font-size: 10px;">
            ${lokasi.koordinat[1].toFixed(6)}, ${lokasi.koordinat[0].toFixed(6)}
          </small>
        </div>
      </div>
    `);

    new maplibregl.Marker({ color: '#e74c3c' })
      .setLngLat(lokasi.koordinat)
      .setPopup(popup)
      .addTo(map);

    map.on('load', () => {
      map.resize();
    });
  },
};

export default MapComponent;