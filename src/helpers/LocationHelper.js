class LocationHelper {
    static getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    resolve(region)
                },
                (error) => {
                    resolve(null)
                }
            );
        })
    };
}

export default LocationHelper