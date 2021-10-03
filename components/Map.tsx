import { useEffect } from 'react'
import { Map as MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import * as L from "leaflet"
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css' // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility'
import { useRouter } from 'next/router'

const Map = () => {

	// Hook
	const router = useRouter()
	const zoom = JSON.parse(router.query.z as string)
	const start = JSON.parse(router.query.start as string)
	const end = JSON.parse(router.query.end as string || null)
	const type = JSON.parse(router.query.type as string)

	const start_position = start
	const last_stop_position = end ? end : 0
	const center_position = end ?
		[((start_position[0] + last_stop_position[0]) / 2), ((start_position[1] + last_stop_position[1]) / 2)] :
		start_position
	const redIcon = new L.Icon({
		iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41]
	})

	return (
		<MapContainer center={center_position} zoom={zoom} style={{ height: 400, width: "100%" }}>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{type === 'railway' && <TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a> contributors'
				url="https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png"
			/>}
			<Marker position={start_position}> </Marker>
			{last_stop_position && <Marker position={last_stop_position} icon={redIcon}> </Marker>}
		</MapContainer>
	)
}

export default Map