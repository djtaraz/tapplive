export const getCoordinatesByPlaceId = (placeId) => {
    return new Promise((resolve) => {
        const geo = new window.google.maps.Geocoder()
        geo.geocode(
            {
                placeId,
            },
            async (results) => {
                const [value] = results

                if (value) {
                    const { lat, lng } = value.geometry.location
                    resolve([lng(), lat()])
                } else {
                    resolve(null)
                }
            },
        )
    })
}
