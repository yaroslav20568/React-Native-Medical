import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { s } from 'react-native-wind';
import Mapbox from '@rnmapbox/maps';
import { Position } from '@rnmapbox/maps/lib/typescript/src/types/Position';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { getPreciseDistance } from 'geolib';
import { IInstitution } from '../../types';
import { mapBoxDirectionsUrl, mapBoxApiKey } from '../../constants';

interface IProps {
	institutions: Array<IInstitution>;
}

interface IRouteDirection {
	geometry: {
		coordinates: Array<Position>;
	}
}

interface IDirection {
	routes: Array<IRouteDirection>;
}

Mapbox.setAccessToken(mapBoxApiKey);

const Map = observer(({ institutions }: IProps) => {
	const [myCoords, setMyCoords] = useState<Array<number>>([0, 0]);
	const [routes, setRoutes] = useState<Array<Position>>([]);

	const { width, height } = useWindowDimensions();

	const getFetchShortDirection = async () => {
		let shortDistanceInstitution = institutions[0];
		let shortDistance = getPreciseDistance(
			{latitude: myCoords[0], longitude: myCoords[1]},
			{latitude: institutions[0].coordinates.split(',')[0], longitude: institutions[0].coordinates.split(',')[1]},
			1
		);

		institutions.forEach((institution) => {
			const distance = getPreciseDistance(
				{latitude: myCoords[0], longitude: myCoords[1]},
				{latitude: institution.coordinates.split(',')[0], longitude: institution.coordinates.split(',')[1]},
				1
			);
			
			if(distance < shortDistance) {
				shortDistance = distance;
				shortDistanceInstitution = {...institution};
			}
		});

		axios<IDirection>(`${mapBoxDirectionsUrl}/driving/${myCoords[0]},${myCoords[1]};${shortDistanceInstitution.coordinates}?overview=full&geometries=geojson&access_token=${mapBoxApiKey}`)
		.then((response) => {
			setRoutes(response.data.routes[0].geometry.coordinates);
		})
	};
	
	useEffect(() => {
		getFetchShortDirection();
	}, [myCoords, institutions]);

	return (
		<Mapbox.MapView 
			logoEnabled={false}
			attributionEnabled={false}
			scaleBarEnabled={false}
			style={[s`w-full mt-3`, {height: width > height ? height - 100 : width / 1.5}]}
		>
			<Mapbox.Camera 
				zoomLevel={5}
				centerCoordinate={myCoords}
			/>
			<Mapbox.UserLocation 
				showsUserHeadingIndicator={true}
				onUpdate={(location) => setMyCoords([location.coords.longitude, location.coords.latitude])}
			/>
			{routes.length ? 
				<Mapbox.ShapeSource
					id={'routeSource'}
					lineMetrics={true}
					shape={{
						properties: {},
						type: 'Feature',
						geometry: {
							type: 'LineString',
							coordinates: routes
						}
					}}
				>
					<Mapbox.LineLayer
						id="exampleLineLayer"
						style={{
							lineColor: '#000',
							lineCap: 'round',
							lineJoin: 'round',
							lineWidth: 4
						}}
					/>
				</Mapbox.ShapeSource> : 
				''
			}
			{institutions.map((institution, index) => 
				<Mapbox.PointAnnotation 
					id={`institution_${index}`}
					coordinate={[+institution.coordinates.split(',')[0], +institution.coordinates.split(',')[1]]}
					key={`marker_${index}`}
				>
					<></>
				</Mapbox.PointAnnotation>
			)}
		</Mapbox.MapView>
	)
})

export default Map;