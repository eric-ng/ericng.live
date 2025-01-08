'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import OutputMsgBox from '@/app/walktripper/outputMsgBox';
import Logo from '@/app/walktripper/logo';

const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GAPI_KEY,
    version: "beta",
});

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

let markers = [];

export default function AiTool() {
    const [libs, setLibs] = useState({});
    const [outputs, setOutputs] = useState([]);
    const [map, setMap] = useState();
    const [dirRenderer, setDirRenderer] = useState();
    const [geocenter, setGeocenter] = useState({lat: 0, lng: 0});
    const [zoom, setZoom] = useState(2);
    const addMarker = (marker) => {
        markers.push(marker);
    };
    useEffect(() => {
        (async () => {
            const { LatLng } = await loader.importLibrary('core');
            const { Map } = await loader.importLibrary("maps");
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
                types: ['tourist_attraction']
            });
            placeAutocomplate.id = 'place-autocomplete-input';
            document.getElementById('place-autocomplete-container').appendChild(placeAutocomplate);
            placeAutocomplate.addEventListener("gmp-placeselect", async ({place}) => {
                await place.fetchFields({
                    fields: ['displayName', 'location']
                });
                sendNearbyPlacesSearch(newDirRenderer, newMap, localLibs, place.displayName, place.location);
            });
        })();
    }, []);
    const setCenter = (latlng) => {
        map.panTo(latlng);
    }
    const sendNearbyPlacesSearch = async (dirRenderer, map, libs, name, {lat, lng}) => {
        const {places} = await libs.Place.searchNearby({
            fields: ['displayName', 'location', 'formattedAddress', 'editorialSummary', 'rating'],
            locationRestriction: {
                center: new libs.LatLng(lat(), lng()),
                radius: 500,
            },
            includedPrimaryTypes: ['tourist_attraction'],
            maxResultCount: 10,
        });
        const processedData = places.sort((a, b) => a.location.lat() - b.location.lat() + a.location.lng() - b.location.lng());
        processedData.forEach((item) => {
            item.latitude = item.location.lat();
            item.longitude = item.location.lng();
        });
        map.setCenter(new libs.LatLng(
            processedData[processedData.length - 1].location.lat(), 
            processedData[processedData.length - 1].location.lng(),
        ));
        let tmpOutputs = [
            {
                role: 'user',
                data: {value: name},
            },
        ];
        setOutputs([
            ...tmpOutputs,
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
                        selected: false,
                    },
                }
            )),
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
            dirRenderer.setDirections(directionResult);
        } else {
            throw new Error("No routes found");
        }
    }

    const selectionChange = (data) => {
        if (!data) {
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
        <div className="w-screen h-screen flex flex-col">
            <div className="max-h-[5%] basis-[5%] px-4 pt-2 flex bg-black text-slate-100">
                <Logo />
                <span className="leading-10 pl-1">WalkTripper</span>
                <small className="align-super pl-1 leading-8">beta</small>
            </div>
            <div className="h-[90%]">
                <div className="px-4 flex gap-2 h-full flex-col-reverse lg:flex-row">
                    <div className="grid w-full h-1/2 lg:w-1/3 lg:h-auto">
                        <div className="w-full mt-4" id="place-autocomplete-container"></div>
                        <div className="prompt-chat my-4 overflow-y-auto">
                            <div className="flex flex-col gap-4 h-full">
                                {outputs.map((line, ind) => {
                                    if (line.role === 'user') {
                                        return (
                                            <div 
                                                className="bg-green-200 py-2 px-4 w-fit justify-self-end self-end rounded-lg"
                                                key={`prompt-chat-${line.role}-${ind}`}
                                            >
                                                Here are some tourist attractions near {line.data.value}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <OutputMsgBox 
                                                key={`prompt-chat-${line.role}-${ind}`} 
                                                map={map}
                                                data={line.data}
                                                selectionChange={selectionChange}
                                                libs={libs}
                                                addMarker={addMarker}
                                            />
                                        );
                                    }
                                })}
                                <div className="" id="scrollRef"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grow p-4 w-full h-1/2 lg:w-2/3 lg:h-auto" id="imap"></div>
                </div>
            </div>
            <div className="basis-[5%] grow w-full">
                <div className="bg-slate-100 h-full p-4">
                    Copyright WalkTripper &copy; 2025
                </div>
            </div>
        </div>
    );
};
