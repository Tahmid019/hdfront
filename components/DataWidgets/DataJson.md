# Data Structure from Backend:

## Respiration Data
```json
{
  "respiration": {
    "waveform": [],
    "rr": 18,
    "pattern": "Normal",
    "quality": "Good"
  }
}
```

## Vitals Data
```json
{
  "vitals": {
    "heart_rate": 73,
    "spo2": 97,
    "temperature": 36.8,
    "map": 91
  }
}
```

## Session Data
```json
{
  "session": {
    "total_fluid_removed": 2.38,
    "target_fluid": 2.5,

    "ktv": 1.18,
    "ktv_target": 1.4,

    "assigned_staff": [
      {
        "id": "1",
        "initials": "AT"
      },
      {
        "id": "2",
        "initials": "RN"
      }
    ]
  }
}
```

## Fluid Balance Data
```json
{
  "fluid_balance": {
    "removed": 2.38,
    "target": 2.50,
    "remaining": 0.12,
    "unit": "L",
    "status": "normal"
  }
}
```