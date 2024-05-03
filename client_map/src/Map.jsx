import { React, useMemo,useState,useEffect } from "react";
import "./leaflet-style.css";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  WMSTileLayer,
  Polygon
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";

// function Map() {

//   return (
//     <MapContainer style={{height:"100px"}} center={[0,0]} zoom={13} scrollWheelZoom={false} >
//       {/* <WMSTileLayer
//             layers={"TOPO-OSM-WMS"}
//             url={`http://ows.mundialis.de/services/service?`}
//             // params={layerParams}
//       /> */}

//     </MapContainer>
//   );
// }

// const customIcon = new Icon({
//   iconUrl: require("./assets/location-pin.png"),
//   iconSize: [38, 38], // size of the icon
// });

// const createClusterCustomIcon = function (cluster) {
//   return new divIcon({
//     html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
//     className: "custom-marker-cluster",
//     iconSize: point(33, 33, true),
//   });
// };

// // markers
// const markers = [
//   {
//     geocode: [12.192181, 78.105468],
//     popUp: "<div>hello world</div>",
//   },
//   {
//     geocode: [12.25158, 78.136071],
//     popUp: "Hello, I am pop up 2",
//   },
//   {
//     geocode: [12.2148366, 78.1180374],
//     popUp: "Hello, I am pop up 3",
//   },
// ];



//To check- Jeniel
// const wmsUrl = 'https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms';
// const wmsParams = {
//   layers: 'BR_LULC50K_1112',
//   format: 'image/png',
//   transparent: true,

// };

// export default function Map() {
  // const customIcon = new Icon({
  //   iconUrl: require("./assets/location-pin.png"),
  //   iconSize: [38, 38], // size of the icon
  // });
  
  // const createClusterCustomIcon = function (cluster) {
  //   return new divIcon({
  //     html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
  //     className: "custom-marker-cluster",
  //     iconSize: point(33, 33, true),
  //   });
  // };
  
//   // markers
//   const markers = [
//     {
//       geocode: [12.192181, 78.105468],
//       popUp: "<div>hello world</div>",
//     },
//     {
//       geocode: [12.25158, 78.136071],
//       popUp: "Hello, I am pop up 2",
//     },
//     {
//       geocode: [12.2148366, 78.1180374],
//       popUp: "Hello, I am pop up 3",
//     },
//   ];


//   const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("https://sih-backend.vercel.app/api/user/657151e98507dda11904d869/recommend/projets");
//         const data = await response.json();
  
//         if (data) {

//           setUserLocation({
//             latitude: data.user.location.coordinates[1],
//             longitude: data.user.location.coordinates[0],
//           });
//           // setMarkersData(data.data);
//           console.log(data);
//           console.log(data.user.location.coordinates[1]);
//           // console.log(userLocation)
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     console.log(userLocation);
//     fetchData();
//   }, []);

//   useEffect(() => {
//     console.log(userLocation);
//   }, [userLocation]);
  
//   return (
//   <div>
//       {userLocation.latitude !== 0 && userLocation.longitude !== 0 && (
//         <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={6}>
//           {/* OPEN STREET MAPS TILES */}
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
//             {/* Mapping through the markers */}
//             {markers.map((marker, index) => (
//               <Marker key={index} position={marker.geocode} icon={customIcon}>
//                 <Popup>{marker.popUp}</Popup>
//               </Marker>
//             ))}
//           </MarkerClusterGroup>
//         </MapContainer>
//       )}
//     </div>
//   );
// }


export default function Map() {
  const customIcon = new Icon({
    iconUrl: require("./assets/location-pin.png"),
    iconSize: [38, 38],
  });

  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [markersData, setMarkersData] = useState([]);
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const range = 1000
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://sih-backend.vercel.app/api/user/657151e98507dda11904d869/recommend/projets/${range}`);
        const data = await response.json();

        if (data) {
          setUserLocation({
            latitude: data.user.location.coordinates[1],
            longitude: data.user.location.coordinates[0],
          });
          setMarkersData(data.data);

          // Extracting polygon coordinates
          const projectCoordinates = data.data.map(project => [
            project.location.coordinates[1],
            project.location.coordinates[0]
          ]);
          if(range<=10000){
          setPolygonCoordinates(projectCoordinates);
          }
          console.log(data);
          console.log(data.user.location.coordinates[1]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(userLocation);
  }, [userLocation]);

  return (
    <div style={{ height: "100vh", margin: 0, padding: 0, width: "100%" }}>
      {userLocation.latitude !== 0 && userLocation.longitude !== 0 && (
        <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={6} style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render the Polygon with dynamic coordinates */}
          {range<=10000 && (<Polygon pathOptions={{ color: 'purple' }} positions={polygonCoordinates} />)}
          

          <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
            {markersData.map((marker, index) => (
              <Marker
                key={index}
                position={[marker.location.coordinates[1], marker.location.coordinates[0]]}
                icon={customIcon}
              >
                <Popup>
                  <div>
                    <h3>{marker.project_name}</h3>
                    <p>Start: {marker.project_start}</p>
                    <p>End: {marker.project_end}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </div>
  );
}









//   // <MapContainer center={[12.0420068, 78.11376943287331]} zoom={6}>
  //   //   {/* OPEN STREEN MAPS TILES */}
  //   //    <TileLayer
  //   //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //   //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //   //   />

  //   //   {/* <InfoBox data={selectedCountry} scope={dataScope} /> */}

  //   //   {/* <WMSTileLayer
  //   //         layers='lulc:BR_LULC50K_1112'
  //   //         url="https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms"
  //   //         // params={{hello:'world'}} // <-- comment out this line to stop the map flickering when the button is pressed
  //   //         maxZoom={6}
  //   //         transparent={true}
  //   //         format='image/png'
  //   //         opacity={0.8}
  //   //       /> */}
       
  //   //   // To check
  //   //   {/* <WMSTileLayer url={wmsUrl} params={wmsParams} /> */}

  //   //   <MarkerClusterGroup
  //   //     chunkedLoading
  //   //     iconCreateFunction={createClusterCustomIcon}
  //   //   >
  //   //     {/* Mapping through the markers */}
  //   //     {markers.map((marker) => (
  //   //       <Marker position={marker.geocode} icon={customIcon}>
  //   //         <Popup>{marker.popUp}</Popup>
  //   //       </Marker>
  //   //     ))}
  //   //     {/* {markersData.map((marker) => (
  //   //       <Marker key={marker._id} position={marker.location.coordinates} icon={customIcon}>
  //   //         <Popup>{marker.project_name}</Popup>
  //   //       </Marker>
  //   //     ))} */}
  //   //   </MarkerClusterGroup>
  //   // </MapContainer>
  //   {userLocation.latitude !== 0 && userLocation.longitude !== 0 && (
  //       <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={6}>
  //         {/* OPEN STREET MAPS TILES */}
  //         <TileLayer
  //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //         />

  //         <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
  //           {/* Mapping through the markers */}
  //           {markers.map((marker, index) => (
  //             <Marker key={index} position={marker.geocode} icon={customIcon}>
  //               <Popup>{marker.popUp}</Popup>
  //             </Marker>
  //           ))}
  //         </MarkerClusterGroup>
  //       </MapContainer>
  //     )}
  // );