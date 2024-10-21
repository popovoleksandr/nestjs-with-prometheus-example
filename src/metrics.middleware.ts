import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrometheusService } from './prometheus.service';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private prometheusService: PrometheusService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;
    const endpoint = req.path;

    const end = this.prometheusService.startTimer(method, endpoint);

    res.on('finish', () => {
      end();  // Stops the timer for the request
      this.prometheusService.incrementTotalRequests(method, endpoint);

      // You can implement logic to calculate requests per minute and hour here
      // This is just an example and would need to be replaced with actual logic
      const randomRequestsPerMinute = Math.floor(Math.random() * 10);
      const randomRequestsPerHour = Math.floor(Math.random() * 100);

      this.prometheusService.updateRequestsPerMinute(method, endpoint, randomRequestsPerMinute);
      this.prometheusService.updateRequestsPerHour(method, endpoint, randomRequestsPerHour);
    });

    next();
  }
}

