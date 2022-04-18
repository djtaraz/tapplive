function isiOS() {
    return (
        ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(
            navigator.platform,
        ) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    )
}
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone'
    }

    if (/android/i.test(userAgent)) {
        return 'Android'
    }

    if (isiOS()) {
        return 'iOS'
    }

    return 'unknown'
}
function DetectAndServe() {
    let os = getMobileOperatingSystem()
    if (os === 'Android') {
        window.location.href = process.env.REACT_APP_GPLAY_STORE
    } else if (os === 'iOS') {
        window.location.href = process.env.REACT_APP_APPLE_STORE
    } else {
        window.location.href = window.location.origin
    }
}

DetectAndServe()
