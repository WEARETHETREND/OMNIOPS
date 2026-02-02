import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Simple Route Optimization Engine using nearest-neighbor heuristic
// Can be enhanced with TSP solver (Google OR-Tools, Vroom, etc.)

function calculateDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula - distance between two points on Earth (km)
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function nearestNeighborRoute(jobs, startLat, startLng) {
  // Greedy nearest-neighbor algorithm
  const unvisited = [...jobs];
  const route = [];
  let currentLat = startLat;
  let currentLng = startLng;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    let nearest = null;
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const job = unvisited[i];
      const dist = calculateDistance(
        currentLat,
        currentLng,
        job.location.lat,
        job.location.lng
      );

      if (dist < minDistance) {
        minDistance = dist;
        nearest = job;
        nearestIdx = i;
      }
    }

    if (nearest) {
      route.push(nearest);
      totalDistance += minDistance;
      currentLat = nearest.location.lat;
      currentLng = nearest.location.lng;
      unvisited.splice(nearestIdx, 1);
    }
  }

  return { route, totalDistance };
}

function estimateCompletionTime(jobs, avgDuration = 45) {
  // Estimate total time = travel + work
  let totalWork = jobs.reduce((sum, j) => sum + (j.estimated_duration || avgDuration), 0);
  let totalTravel = 0;

  for (let i = 0; i < jobs.length - 1; i++) {
    const dist = calculateDistance(
      jobs[i].location.lat,
      jobs[i].location.lng,
      jobs[i + 1].location.lat,
      jobs[i + 1].location.lng
    );
    totalTravel += (dist / 50) * 60; // Assume 50km/h average speed, convert to minutes
  }

  return {
    workTime: Math.round(totalWork),
    travelTime: Math.round(totalTravel),
    totalTime: Math.round(totalWork + totalTravel),
    jobs: jobs.length
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { jobs, worker_lat, worker_lng } = payload;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return Response.json({ error: 'No jobs provided' }, { status: 400 });
    }

    // Run nearest-neighbor optimization
    const { route: optimizedRoute, totalDistance } = nearestNeighborRoute(
      jobs,
      worker_lat,
      worker_lng
    );

    // Calculate time estimates
    const timeEstimate = estimateCompletionTime(optimizedRoute);

    // Calculate efficiency gains
    const originalDistance = jobs.reduce((sum, j, i) => {
      if (i === 0) return sum + calculateDistance(worker_lat, worker_lng, j.location.lat, j.location.lng);
      return sum + calculateDistance(jobs[i - 1].location.lat, jobs[i - 1].location.lng, j.location.lat, j.location.lng);
    }, 0);

    const efficientRoute = {
      orderedJobs: optimizedRoute.map(j => j.id),
      jobSequence: optimizedRoute.map(j => ({
        id: j.id,
        title: j.job_title,
        location: j.location,
        estimatedDuration: j.estimated_duration
      })),
      metrics: {
        totalDistance: Math.round(totalDistance * 10) / 10,
        originalDistance: Math.round(originalDistance * 10) / 10,
        distanceSaved: Math.round((originalDistance - totalDistance) * 10) / 10,
        distanceSavedPercent: Math.round(((originalDistance - totalDistance) / originalDistance) * 100),
        ...timeEstimate
      },
      financialImpact: {
        fuelSavings: Math.round(((originalDistance - totalDistance) / 10) * 3.5), // Assume $3.5/gallon, 10 mpg
        timeSavings: Math.round((originalDistance - totalDistance) / 50 * 60), // minutes saved
        revenueOpportunity: Math.max(0, Math.round(((originalDistance - totalDistance) / 50 * 60) / 45)), // extra jobs
      }
    };

    return Response.json(efficientRoute);
  } catch (error) {
    console.error('Route optimization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});