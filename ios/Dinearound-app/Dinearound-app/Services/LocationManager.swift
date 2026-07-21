import CoreLocation
import Observation

@Observable
@MainActor
final class LocationManager: NSObject, CLLocationManagerDelegate {
    var isAuthorized = false
    var isLocating = false
    var sortByDistance = false

    private let manager = CLLocationManager()

    override init() {
        super.init()
        manager.delegate = self
    }

    func toggleLocationSort() {
        if sortByDistance {
            sortByDistance = false
            isLocating = false
            return
        }
        isLocating = true
        manager.requestWhenInUseAuthorization()
        manager.requestLocation()
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        Task { @MainActor in
            switch manager.authorizationStatus {
            case .authorizedWhenInUse, .authorizedAlways:
                isAuthorized = true
                if isLocating {
                    manager.requestLocation()
                }
            default:
                isAuthorized = false
                isLocating = false
                sortByDistance = false
            }
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        Task { @MainActor in
            sortByDistance = true
            isLocating = false
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in
            sortByDistance = true
            isLocating = false
        }
    }
}
