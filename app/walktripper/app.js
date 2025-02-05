'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import LoopIcon from '@mui/icons-material/Loop';
import Chip from '@mui/material/Chip';
import OutputMsgBox from '@/app/walktripper/outputMsgBox';
import PathConnector from '@/components/pathConnector';
import { StoM } from '@/app/utils/funcs';
import { appCheck } from '@/auth/firebase';

// const getResp = async (prompt, onErr) => {
//     try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/gen`, {
//             method: 'POST',
//             body: JSON.stringify(
//                 {
//                     prompt
//                 }
//             ),
//         });
//         if (!res.ok) {
//             throw new Error('Something went wrong.');
//         }
//         const data = (await res.json()).data;
//         if (data.error) {
//             throw new Error(`Something went wrong with the API.  ${JSON.stringify(data)}`);
//         }
//         return data;
//     } catch (e) {
//         console.log(e);
//         onErr();
//         return [];
//     }
// }

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GAPI_KEY,
    version: "beta",
});

const placeTypes = [
    'aquarium',
    'art_gallery',
    'museum',
    'stadium',
    'tourist_attraction',
];

let polylines = [];

export default function App () {
    const [loading, setLoading] = useState(false);
    const [libs, setLibs] = useState({});
    const [outputs, setOutputs] = useState([]);
    const [map, setMap] = useState();
    const [dirRenderer, setDirRenderer] = useState();
    const [geocenter, setGeocenter] = useState({lat: 0, lng: 0});
    const [zoom, setZoom] = useState(2);
    useEffect(() => {
        appCheck();
        (async () => {
            const { LatLng } = await loader.importLibrary('core');
            const { Map, Polyline } = await loader.importLibrary("maps");
            const { 
                Place, 
                PlaceAutocompleteElement,
                SearchNearbyRankPreference, 
            } = await loader.importLibrary("places");
            const { 
                DirectionsRenderer, 
                DirectionsService, 
                TravelMode, 
            } = await loader.importLibrary('routes');
            const { AdvancedMarkerElement } = await loader.importLibrary('marker');
            const localLibs = {
                ...libs,
                LatLng,
                Map,
                Polyline,
                DirectionsRenderer, 
                DirectionsService, 
                TravelMode,
                AdvancedMarkerElement,
                Place,
                PlaceAutocompleteElement,
                SearchNearbyRankPreference,
            };
            setLibs(localLibs);
            const newMap = new Map(document.getElementById("imap"), {
                mapId: 'walktripper-map',
                center: new LatLng(geocenter.lat, geocenter.lng),
                zoom,
                fullscreenControl: false,
            });
            setMap(newMap);
            const newDirRenderer = new DirectionsRenderer({
                map: newMap,
            });
            setDirRenderer(newDirRenderer);
            const placeAutocomplate = new PlaceAutocompleteElement({
                // types: placeTypes
            });
            placeAutocomplate.id = 'place-autocomplete-input';
            document.getElementById('place-autocomplete-container').childNodes.forEach((node) => node.remove());
            document.getElementById('place-autocomplete-container').appendChild(placeAutocomplate);
            placeAutocomplate.addEventListener("gmp-placeselect", async ({place}) => {
                await place.fetchFields({
                    fields: ['displayName', 'location']
                });
                try {
                    setLoading(true);
                    await sendNearbyPlacesSearch(newDirRenderer, newMap, localLibs, place.displayName, place.location);
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            });
        })();
    }, []);
    const setCenter = (latlng) => {
        map.panTo(latlng);
    }
    const sendNearbyPlacesSearch = async (dirRenderer, map, libs, name, {lat, lng}) => {
        const {places} = await libs.Place.searchNearby({
            fields: ['displayName', 'addressComponents', 'location', 'formattedAddress', 'editorialSummary', 'photos', 'rating'],
            locationRestriction: {
                center: new libs.LatLng(lat(), lng()),
                radius: 500,
            },
            includedPrimaryTypes: placeTypes,
            maxResultCount: 10,
        });
        const processedData = [...places].sort((a, b) => a.location.lat() - b.location.lat() + a.location.lng() - b.location.lng());
        processedData.forEach((item) => {
            item.latitude = item.location.lat();
            item.longitude = item.location.lng();
        });
        map.setCenter(new libs.LatLng(
            processedData[processedData.length - 1].location.lat(), 
            processedData[processedData.length - 1].location.lng(),
        ));
        setOutputs([
            {
                role: 'user',
                data: {value: name},
            },
        ]);
        getRoutes(dirRenderer, processedData, libs, map);
    }
    const getRoutes = async (dirRenderer, processedData, libs = libs, map = map) => {
        const directionsService = new libs.DirectionsService();
        map.setZoom(14);
        const opts = {
            origin: new libs.LatLng({lat: processedData[0].latitude, lng: processedData[0].longitude}),
            destination: new libs.LatLng({lat: processedData[processedData.length - 1].latitude, lng: processedData[processedData.length - 1].longitude}),
            waypoints: processedData.filter((_, ind) => ind > 0 && ind < processedData.length - 1).map((item) => (
                {
                    location: new libs.LatLng(item.latitude, item.longitude),
                    stopover: false,
                }
            )),
            travelMode: libs.TravelMode.WALKING,
        };
        const directionResult = await directionsService.route(opts);
        if (Array.isArray(directionResult.routes)) {
            const {steps, via_waypoint: attractions} = directionResult.routes[0].legs[0];
            processedData.forEach((point, ind) => {
                if (ind === 0) {
                    point.dur = 0;
                } else if (ind === processedData.length - 1) {
                    let dur = 0;
                    let bound = attractions[ind - 2] ? attractions[ind - 2].step_index : 0;
                    let counter = steps.length - 1;
                    while (counter >= bound) {
                        dur += steps[counter].duration.value;
                        counter--;
                    }
                    point.dur = dur;
                } else {
                    let dur = 0;
                    let bound = attractions[ind - 1] ? attractions[ind - 1].step_index : 0;
                    let counter = attractions[ind - 1].step_index;
                    while (counter >= bound) {
                        dur += steps[counter].duration.value;
                        counter--;
                    }
                    point.dur = dur;
                }
            });
            setOutputs([
                ...outputs,
                ...processedData
                .map((item, ind) => (
                    {
                        role: 'model',
                        data: {
                            id: ind,
                            name: item.displayName,
                            address: item.formattedAddress,
                            desc: item.editorialSummary ?? '',
                            latlng: {lat: item.location.lat(), lng: item.location.lng()},
                            rating: item.rating,
                            photo: item.photos[0],
                            placeId: item.name,
                            addressComps: item.addressComponents,
                            dur: item.dur,
                            selected: false,
                        },
                    }
                )),
            ]);
            map.fitBounds(directionResult.routes[0].bounds)
            steps.forEach((step) => {
                const newPoly = new libs.Polyline({
                    map,
                    path: step.path,
                    options: {
                        strokeColor: '#7788FE',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                    }
                })
                polylines.push(newPoly);
            });
            // dirRenderer.setDirections(directionResult);
        } else {
            throw new Error("No routes found");
        }
    }

    const selectionChange = (data) => {
        if (!data) {
            setOutputs(outputs.map((line) => (
                {
                    role: line.role,
                    data: {
                        ...line.data,
                        selected: false,
                    },
                }
            )));
            return;
        }
        setCenter(data.latlng);
        setOutputs(outputs.map((line) => (
            {
                role: line.role,
                data: {
                    ...line.data,
                    selected: line.data.id === data.id ? true : false,
                },
            }
        )));
    };

    return (
        <div className="px-4 flex gap-2 h-full flex-col-reverse lg:flex-row">
            <div className="grid w-full h-1/2 lg:w-1/3 lg:h-auto relative">
                {loading &&
                <div className="absolute w-full h-full opacity-75 bg-sky-100 z-10 text-center content-center">
                    <LoopIcon className="prompt-loader w-1/2 h-1/2 text-sky-600" />
                </div>
                }
                {outputs.length === 0 &&
                <div className="absolute w-full h-full opacity-75 z-0 text-center content-center">
                    <div>Look for attractions within walking distance</div>
                    <div>Start typing...</div>
                </div>
                }
                <div className="w-full mt-4" id="place-autocomplete-container"></div>
                <div className="prompt-chat my-4 overflow-y-auto">
                    <div className="flex flex-col h-full">
                        {outputs.map((line, ind) => {
                            if (line.role === 'user') {
                                return (
                                    <div 
                                        className="bg-green-200 py-2 px-4 mb-4 w-fit justify-self-end self-end rounded-lg"
                                        key={`prompt-chat-${line.role}-${ind}`}
                                    >
                                        Here are some tourist attractions near {line.data.value}
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={`prompt-chat-cont-${line.role}-${ind}`}
                                    >
                                        <div 
                                            className="place-items-center text-center"
                                            key={`prompt-chat-path-${line.role}-${ind}`}
                                        >
                                            {line.data.dur > 0 && <PathConnector />}
                                            <Chip className="p-4" label={line.data.dur === 0 ? 'Start' : `${StoM(line.data.dur)}m`} />
                                            <PathConnector />
                                        </div>
                                        <OutputMsgBox 
                                            key={`prompt-chat-${line.role}-${ind}`} 
                                            map={map}
                                            data={line.data}
                                            selectionChange={selectionChange}
                                            libs={libs}
                                        />
                                    </div>
                                );
                            }
                        })}
                        <div className="" id="scrollRef"></div>
                    </div>
                </div>
            </div>
            <div className="grow p-4 w-full h-1/2 lg:w-2/3 lg:h-auto" id="imap"></div>
        </div>
    );
}