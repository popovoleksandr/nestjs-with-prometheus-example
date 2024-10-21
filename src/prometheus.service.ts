import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly requestDurationHistogram;
  private readonly totalRequestsCounter;
  private readonly requestsPerMinuteGauge;
  private readonly requestsPerHourGauge;

  constructor() {
    this.requestDurationHistogram = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'endpoint'],
    });

    this.totalRequestsCounter = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'endpoint'],
    });

    this.requestsPerMinuteGauge = new client.Gauge({
      name: 'http_requests_per_minute',
      help: 'Number of requests per minute',
      labelNames: ['method', 'endpoint'],
    });

    this.requestsPerHourGauge = new client.Gauge({
      name: 'http_requests_per_hour',
      help: 'Number of requests per hour',
      labelNames: ['method', 'endpoint'],
    });

    // Start Prometheus default metrics collection
    client.collectDefaultMetrics();
  }

  startTimer(method: string, endpoint: string) {
    return this.requestDurationHistogram.startTimer({ method, endpoint });
  }

  incrementTotalRequests(method: string, endpoint: string) {
    this.totalRequestsCounter.inc({ method, endpoint });
  }

  updateRequestsPerMinute(method: string, endpoint: string, count: number) {
    this.requestsPerMinuteGauge.set({ method, endpoint }, count);
  }

  updateRequestsPerHour(method: string, endpoint: string, count: number) {
    this.requestsPerHourGauge.set({ method, endpoint }, count);
  }

  getMetrics() {
    return client.register.metrics();
  }
}
