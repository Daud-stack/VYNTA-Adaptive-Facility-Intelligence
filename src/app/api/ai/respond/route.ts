import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { ticketId, context } = await request.json();

  // Simulated AI Logic
  const responses = [
    `Based on Vynta Vision telemetry for Asset ${ticketId}, I recommend checking the refrigerant levels. Consumption has spiked by 14%.`,
    `Standard protocol for this incident suggests a recalibration of the optical sensors on Floor 2. Predicted resolution: 15 mins.`,
    `I've analyzed similar incidents from last quarter. It is likely a firmware mismatch with the new HVAC controller. Recommendation: Rollback to v4.2.`,
    `Telemetry indicates an occupancy spike. I've automatically adjusted the cooling PUE. Recommend monitoring for another 30 mins.`
  ];

  const response = responses[Math.floor(Math.random() * responses.length)];

  // Simulate "Thinking" and latency
  await new Promise(resolve => setTimeout(resolve, 2000));

  return NextResponse.json({ 
    response,
    reasoning: [
      "Analyzing sensor logs...",
      "Correlating with historical incidents...",
      "Simulation complete. High confidence in refrigerant leak."
    ]
  });
}
