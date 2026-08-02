```json
{
  "framework": {
    "name": "Hemo Widget Framework",
    "version": "1.0",
    "description": "A modular visualization framework for medical monitoring dashboards. Each widget consists of a universal container, a visualization, a datasource, and configurable settings."
  },
  "widgets": [
    {
      "id": "waveform",
      "name": "Waveform",
      "category": "Realtime Signal",
      "description": "Displays continuously updating physiological waveforms.",
      "supportedData": [
        "ECG",
        "Pulse",
        "Respiration",
        "Plethysmograph",
        "Arterial Pressure",
        "Venous Pressure",
        "Blood Flow",
        "TMP"
      ],
      "datasourceExamples": [
        "patient.ecg",
        "patient.pulse",
        "patient.pressure"
      ],
      "settings": [
        "lineColor",
        "lineWidth",
        "backgroundColor",
        "grid",
        "showLabels",
        "animation",
        "windowSize",
        "autoScale",
        "speed"
      ],
      "sizes": [
        "md",
        "lg",
        "xl",
        "full"
      ]
    },
    {
      "id": "metric",
      "name": "Metric",
      "category": "Numeric",
      "description": "Displays one or more primary numerical values.",
      "supportedData": [
        "Heart Rate",
        "Blood Pressure",
        "SpO₂",
        "Temperature",
        "MAP",
        "Respiration Rate",
        "UF Rate",
        "Conductivity"
      ],
      "datasourceExamples": [
        "patient.hr",
        "patient.spo2",
        "machine.temperature"
      ],
      "settings": [
        "fontSize",
        "alignment",
        "showTrend",
        "showIcon",
        "colorScheme",
        "thresholds",
        "unit"
      ],
      "sizes": [
        "xs",
        "sm",
        "md"
      ]
    },
    {
      "id": "progress",
      "name": "Progress",
      "category": "Progress Indicator",
      "description": "Displays completion or target progress.",
      "supportedData": [
        "Fluid Removed",
        "UF Goal",
        "Treatment Progress",
        "Remaining Time",
        "Kt/V",
        "Blood Volume"
      ],
      "datasourceExamples": [
        "session.uf",
        "session.progress",
        "session.ktv"
      ],
      "variants": [
        "linear",
        "vertical",
        "circular",
        "ring",
        "tank"
      ],
      "settings": [
        "variant",
        "showPercentage",
        "showTarget",
        "animated",
        "barColor",
        "height",
        "cornerRadius"
      ],
      "sizes": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "id": "gauge",
      "name": "Gauge",
      "category": "Dial",
      "description": "Displays a value within a configurable range.",
      "supportedData": [
        "Blood Flow",
        "TMP",
        "Venous Pressure",
        "Arterial Pressure",
        "Conductivity",
        "Dialysate Temperature"
      ],
      "datasourceExamples": [
        "machine.tmp",
        "machine.pressure",
        "machine.flow"
      ],
      "settings": [
        "min",
        "max",
        "warningThreshold",
        "criticalThreshold",
        "needleColor",
        "arcColor",
        "showTicks",
        "showLabels"
      ],
      "sizes": [
        "sm",
        "md",
        "lg"
      ]
    },
    {
      "id": "timeline",
      "name": "Timeline",
      "category": "History",
      "description": "Displays chronological events.",
      "supportedData": [
        "Clinical Events",
        "Machine Events",
        "Treatment Log",
        "Alarm History",
        "Audit Trail",
        "Notifications"
      ],
      "datasourceExamples": [
        "session.events",
        "machine.logs",
        "system.notifications"
      ],
      "settings": [
        "compactMode",
        "severityColors",
        "groupEvents",
        "maxItems",
        "autoScroll",
        "showTimestamp"
      ],
      "sizes": [
        "md",
        "lg",
        "xl"
      ]
    },
    {
      "id": "table",
      "name": "Table",
      "category": "Tabular",
      "description": "Displays structured rows and columns.",
      "supportedData": [
        "Lab Reports",
        "Prescription",
        "Patient Details",
        "Machine Parameters",
        "Treatment Summary",
        "Medication"
      ],
      "datasourceExamples": [
        "patient.labs",
        "patient.profile",
        "session.summary"
      ],
      "settings": [
        "stripedRows",
        "compact",
        "stickyHeader",
        "pagination",
        "sorting",
        "search",
        "columnVisibility"
      ],
      "sizes": [
        "lg",
        "xl",
        "full"
      ]
    },
    {
      "id": "controls",
      "name": "Controls",
      "category": "Input",
      "description": "Interactive parameter editor.",
      "supportedData": [
        "Blood Flow Rate",
        "UF Goal",
        "Temperature",
        "Dialysate Flow",
        "Heparin Rate",
        "Machine Settings"
      ],
      "datasourceExamples": [
        "machine.controls",
        "session.settings"
      ],
      "supportedInputs": [
        "number",
        "slider",
        "switch",
        "select",
        "stepper",
        "buttonGroup",
        "knob",
        "range"
      ],
      "settings": [
        "readonly",
        "validation",
        "layout",
        "units",
        "permissions"
      ],
      "sizes": [
        "md",
        "lg",
        "xl"
      ]
    },
    {
      "id": "status",
      "name": "Status",
      "category": "Indicator",
      "description": "Displays operational or health status.",
      "supportedData": [
        "Backend Connection",
        "Machine Status",
        "Treatment State",
        "Battery",
        "Network",
        "Sensor Status"
      ],
      "datasourceExamples": [
        "system.status",
        "machine.status"
      ],
      "states": [
        "online",
        "offline",
        "warning",
        "critical",
        "maintenance"
      ],
      "settings": [
        "icon",
        "badge",
        "animation",
        "label"
      ],
      "sizes": [
        "xs",
        "sm"
      ]
    },
    {
      "id": "chart",
      "name": "Chart",
      "category": "Analytics",
      "description": "Displays historical trends and statistics.",
      "supportedData": [
        "Blood Pressure Trend",
        "Heart Rate Trend",
        "Fluid Removal History",
        "Temperature Trend",
        "Dialysis Efficiency"
      ],
      "datasourceExamples": [
        "analytics.hr",
        "analytics.uf"
      ],
      "variants": [
        "line",
        "area",
        "bar",
        "stackedBar",
        "scatter"
      ],
      "settings": [
        "legend",
        "grid",
        "axisLabels",
        "tooltip",
        "zoom",
        "timeRange"
      ],
      "sizes": [
        "lg",
        "xl",
        "full"
      ]
    },
    {
      "id": "heatmap",
      "name": "Heatmap",
      "category": "Analytics",
      "description": "Displays intensity across time or categories.",
      "supportedData": [
        "Alarm Frequency",
        "Patient Activity",
        "Hourly Events",
        "Sensor Density"
      ],
      "datasourceExamples": [
        "analytics.heatmap"
      ],
      "settings": [
        "colorPalette",
        "legend",
        "cellSize",
        "showValues"
      ],
      "sizes": [
        "lg",
        "xl"
      ]
    }
  ],
  "commonWidgetFeatures": {
    "header": {
      "title": true,
      "subtitle": true,
      "icon": true,
      "toolbar": true
    },
    "toolbar": {
      "settings": true,
      "expand": true,
      "menu": true
    },
    "connection": {
      "states": [
        "connecting",
        "connected",
        "disconnected",
        "error"
      ]
    },
    "settingsPanel": {
      "slider": true,
      "switch": true,
      "number": true,
      "select": true,
      "color": true,
      "text": true
    },
    "datasource": {
      "supportsRealtime": true,
      "supportsMock": true,
      "supportsREST": true,
      "supportsWebSocket": true
    },
    "layout": {
      "responsive": true,
      "draggable": false,
      "resizable": false,
      "fullscreen": true
    }
  }
}
```