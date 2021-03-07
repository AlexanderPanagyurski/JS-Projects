function attachEventsListeners() {
    document.getElementById('convert').addEventListener('click', convertUnits);

    function metric(value, fromUnits) {
        const from = {
            km: (km) => km * 1000,
            m: (m) => m,
            cm: (cm) => cm * 0.01,
            mm: (mm) => mm * 0.001,
            mi: (mi) => mi * 1609.34,
            yrd: (yrd) => yrd * 0.9144,
            ft: (ft) => ft * 0.3048,
            'in': (inch) => inch * 0.254
        };
        return from[fromUnits](value);
    }

    function units(from, to, value) {
        const fromMetric = {
            km: (m) => m / 1000,
            m: (m) => m,
            cm: (m) => m / 0.01,
            mm: (m) => m / 0.001,
            mi: (m) => m / 1609.34,
            yrd: (m) => m / 0.9144,
            ft: (m) => m / 0.3048,
            'in': (m) => m / 0.254
        };
        return fromMetric[to](metric(value, from))
    }

    function convertUnits() {
        const unitsFrom = document.getElementById('inputUnits').value;
        const unitsTo = document.getElementById('outputUnits').value;
        const dist = Number(document.getElementById('inputDistance').value);
        const output = document.getElementById('outputDistance');
        output.value = units(unitsFrom, unitsTo, dist);
    }
}