"use client";

import { HeartPulse } from "lucide-react";

import Widget from "@/Widget/Widget";
import WidgetBody from "@/Widget/WidgetBody";

import Waveform from "@/visualizations/Waveform";

interface Props {
    ecg: number[];

    heartRate: number;

    spo2: number;

    bp: string;

    rr: number;

    rhythm: string;

    lead: string;
}

export default function ECGWidget({

    ecg,

    heartRate,

    spo2,

    bp,

    rr,

    rhythm,

    lead,

}: Props) {

    return (

        <Widget

            title="Physiological Stream"

            subtitle="Live ECG Monitoring"

            icon={<HeartPulse size={18} />}

        >

            <WidgetBody layout="fill">

                <Waveform

                    data={ecg}

                    value={heartRate}

                    unit="BPM"

                    color="#111"

                    height={140}

                    metrics={[

                        {
                            label: "Lead",
                            value: lead,
                        },

                        {
                            label: "Rhythm",
                            value: rhythm,
                        },

                        {
                            label: "SpO₂",
                            value: spo2,
                            unit: "%",
                        },

                        {
                            label: "Blood Pressure",
                            value: bp,
                        },

                        {
                            label: "Respiration",
                            value: rr,
                            unit: "/min",
                        },

                    ]}

                />

            </WidgetBody>

        </Widget>

    );

}