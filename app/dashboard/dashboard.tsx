import ECGWidget from "@/components/ECGwidget";

export const ecgData = {
  waveform: [
    0.02, 0.04, 0.08, 0.15, 0.32,
    0.68, 1.42, 2.84, 5.76, 3.21,
    1.02, 0.38, -0.12, -0.35, -0.18,
    0.05, 0.12, 0.18, 0.22, 0.20,
    0.14, 0.08, 0.03, 0.01, 0.00,
    0.02, 0.06, 0.11, 0.25, 0.62,
    1.58, 3.82, 6.20, 3.94, 1.42,
    0.41, -0.20, -0.40, -0.16, 0.04,
    0.10, 0.16, 0.21, 0.17, 0.10,
    0.03, 0.00
  ],

  bpm: 72,

  spo2: 98,

  rr: 18,

  bp: {
    sys: 120,
    dia: 78,
  },

  temperature: 36.8,

  map: 92,

  rhythm: "Normal Sinus Rhythm",

  lead: "Lead II",

  signalQuality: "Excellent",

  timestamp: new Date().toISOString(),
};

<div className="grid grid-cols-12 gap-6">

    <div className="col-span-12 xl:col-span-8">

        <ECGWidget
            ecg={ecgData.waveform}

            heartRate={72}

            spo2={98}

            bp="120 / 78"

            rr={18}

            rhythm="Normal"

            lead="Lead II"
        />

    </div>

</div>