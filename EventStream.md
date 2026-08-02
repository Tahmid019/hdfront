# Real-Time Monitor Data Flow Documentation

## Overview

The monitoring dashboard uses a **single WebSocket connection** to receive real-time data from the backend. Instead of each widget creating its own connection, a centralized `MonitorProvider` manages the connection and distributes the latest data to all widgets through React Context.

This architecture is scalable, avoids duplicate connections, and keeps widgets independent of the communication layer.

---

# Folder Structure

```text
src/
│
├── components/
│   ├── widget/
│   │     Widget.tsx
│   │     WidgetBody.tsx
│   │     WidgetToolbar.tsx
│   │     WidgetSettings.tsx
│   │
│   └── visualizations/
│         Waveform.tsx
│         Metric.tsx
│         Progress.tsx
│         Timeline.tsx
│         Gauge.tsx
│         Controls.tsx
│         Table.tsx
│
├── providers/
│      MonitorProvider.tsx
│
├── services/
│      monitorWS.ts
│
├── hooks/
│      useMonitor.ts (exported from MonitorProvider)
│
├── types/
│      monitor.ts
│
└── pages/
```

---

# Overall Architecture

```text
Backend
    │
    │ WebSocket
    ▼
monitorWS.ts
    │
    ▼
MonitorProvider
    │
    ▼
React Context
    │
    ▼
useMonitor()
    │
    ▼
Dashboard Widgets
```

Only **one WebSocket connection** exists regardless of how many widgets are displayed.

---

# Step 1 — Backend

The backend continuously pushes dashboard updates through WebSocket.

Example:

```json
{
    "source": "monitor",
    "data": {
        "ecg": {
            "waveform": [...],
            "bpm": 72,
            "spo2": 98,
            "rr": 18,
            "bp": {
                "sys": 120,
                "dia": 78
            },
            "rhythm": "Normal",
            "lead": "Lead II"
        },

        "pressure": {
            ...
        },

        "timeline": [
            ...
        ]
    }
}
```

The frontend only consumes these updates.

---

# Step 2 — monitorWS.ts

Responsibility:

* Open WebSocket connection
* Listen for incoming messages
* Handle reconnection
* Disconnect when required

This file **does not contain any React code**.

```
Backend
      ↓
WebSocket
      ↓
monitorWS.ts
```

Whenever a message arrives,

```text
JSON
     ↓
onMessage(message)
```

is called.

---

# Step 3 — MonitorProvider

The provider is responsible for

* Creating one WebSocket instance
* Receiving data
* Saving the latest dashboard state
* Making it available to the entire application

Example flow

```text
monitorWS
      │
      ▼
onMessage(message)
      │
      ▼
setData(message.data)
      │
      ▼
React Context updated
```

Notice that

```text
message
```

is transformed into

```text
message.data
```

before storing.

Widgets never need to know that data originally came inside a WebSocket message.

---

# Step 4 — Wrapping the Dashboard

Wrap the dashboard only once.

```tsx
<MonitorProvider>

    <Dashboard />

</MonitorProvider>
```

Never wrap individual widgets.

Correct

```
MonitorProvider

    ECG

    Pressure

    Timeline

    Gauge
```

Wrong

```
ECG
 └── MonitorProvider

Pressure
 └── MonitorProvider

Timeline
 └── MonitorProvider
```

Otherwise multiple WebSocket connections are created.

---

# Step 5 — useMonitor()

`useMonitor()` is simply

```tsx
const { data } = useMonitor();
```

It returns the latest dashboard state.

No WebSocket code exists inside widgets.

---

# Step 6 — Widget Flow

Example:

ECG Widget

```tsx
const { data } = useMonitor();

const ecg = data?.ecg;
```

Pressure Widget

```tsx
const { data } = useMonitor();

const pressure = data?.pressure;
```

Timeline Widget

```tsx
const { data } = useMonitor();

const timeline = data?.timeline;
```

Every widget only accesses the section it needs.

---

# Complete Data Flow

```text
Backend

        │

        ▼

WebSocket

        │

        ▼

monitorWS.ts

        │

        ▼

MonitorProvider

        │

        ▼

React Context

        │

        ▼

useMonitor()

        │

 ┌──────┼────────────┐
 │      │            │
 ▼      ▼            ▼

ECG   Pressure   Timeline

Widget Widget     Widget
```

---

# Why This Architecture?

## Single Source of Truth

Instead of every widget maintaining its own state,

```
Backend

↓

One Provider

↓

Shared State

↓

Widgets
```

All widgets always display the latest synchronized data.

---

## Single WebSocket Connection

Without Provider

```
ECG Widget
    ↓
WebSocket

Pressure Widget
    ↓
WebSocket

Timeline Widget
    ↓
WebSocket
```

Result

* Multiple connections
* Increased backend load
* Duplicate data
* More memory usage

With Provider

```
One WebSocket

↓

Provider

↓

All Widgets
```

Only one connection exists.

---

## Separation of Responsibilities

### monitorWS.ts

Only communication.

Responsible for

* Connect
* Disconnect
* Reconnect
* Receive messages

---

### MonitorProvider

Only state management.

Responsible for

* Listening to WebSocket
* Updating dashboard state
* Sharing state

---

### Widgets

Only UI.

Responsible for

* Reading data
* Rendering charts
* Rendering metrics

Widgets know nothing about

* WebSocket
* JSON parsing
* Reconnection
* Context implementation

---

# Adding a New Widget

Suppose a new backend field arrives

```json
{
    "temperature": {
        "value": 36.8
    }
}
```

Create

```
TemperatureWidget.tsx
```

Inside

```tsx
const { data } = useMonitor();

const temperature = data?.temperature;
```

Done.

No changes are required in

* WebSocket
* Provider
* Dashboard

---

# Advantages

* Single WebSocket connection
* Centralized data management
* Easy to maintain
* Easy to extend
* Widgets remain reusable
* Clear separation between networking and UI
* Efficient rendering
* Lower backend resource usage
* Easy to mock for testing
* Type-safe when using shared interfaces

---

# Final Architecture

```text
                    Backend
                       │
                 WebSocket Server
                       │
                       ▼
                monitorWS.ts
          (Connection Management)
                       │
                       ▼
              MonitorProvider
          (Central Dashboard State)
                       │
             React Context API
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
     ECGWidget   PressureWidget  TimelineWidget
         │             │             │
         ▼             ▼             ▼
      Waveform      Gauge        Table/Timeline
```

This design ensures that **network communication, application state, and UI rendering each have a single, well-defined responsibility**, making the dashboard easier to develop, debug, and extend.
