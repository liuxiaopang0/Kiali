import { CyNode, CyEdge } from '../CytoscapeGraphUtils'

const safeRate = (rate) => (isNaN(rate) ? 0.0 : Number(rate))

// type TRAFFIC_GRPC = {
//   RATE: string;
//   RATEGRPCERR: string;
//   RATENORESPONSE: string;
// };

const NODE_GRPC_IN = {
  RATE: CyNode.grpcIn,
  RATEGRPCERR: CyNode.grpcInErr,
  RATENORESPONSE: CyNode.grpcInNoResponse
}
const EDGE_GRPC = {
  RATE: CyEdge.grpc,
  RATEGRPCERR: CyEdge.grpcErr,
  RATENORESPONSE: CyEdge.grpcNoResponse
}

// export interface TrafficRateGrpc {
//   rate: number;
//   rateGrpcErr: number;
//   rateNoResponse: number;
// }

export function getTrafficRateGrpc(element, trafficType = NODE_GRPC_IN) {
  return {
    rate: safeRate(element.data(trafficType.RATE)),
    rateGrpcErr: safeRate(element.data(trafficType.RATEGRPCERR)),
    rateNoResponse: safeRate(element.data(trafficType.RATENORESPONSE))
  }
}

export function getAccumulatedTrafficRateGrpc(elements) {
  return elements.reduce(
    (r, element) => {
      const elementTrafficRate = getTrafficRateGrpc(element, EDGE_GRPC)
      r.rate += elementTrafficRate.rate
      r.rateGrpcErr += elementTrafficRate.rateGrpcErr
      r.rateNoResponse += elementTrafficRate.rateNoResponse
      return r
    },
    { rate: 0, rateGrpcErr: 0, rateNoResponse: 0 }
  )
}

// type TRAFFIC_HTTP = {
//   RATE: string;
//   RATE3XX: string;
//   RATE4XX: string;
//   RATE5XX: string;
//   RATENORESPONSE: string;
// };

const NODE_HTTP_IN = {
  RATE: CyNode.httpIn,
  RATE3XX: CyNode.httpIn3xx,
  RATE4XX: CyNode.httpIn4xx,
  RATE5XX: CyNode.httpIn5xx,
  RATENORESPONSE: CyNode.httpInNoResponse
}
const EDGE_HTTP = {
  RATE: CyEdge.http,
  RATE3XX: CyEdge.http3xx,
  RATE4XX: CyEdge.http4xx,
  RATE5XX: CyEdge.http5xx,
  RATENORESPONSE: CyEdge.httpNoResponse
}

// export interface TrafficRateHttp {
//   rate: number;
//   rate3xx: number;
//   rate4xx: number;
//   rate5xx: number;
//   rateNoResponse: number;
// }

export const getTrafficRateHttp = (element, trafficType = NODE_HTTP_IN) => {
  return {
    rate: safeRate(element.data(trafficType.RATE)),
    rate3xx: safeRate(element.data(trafficType.RATE3XX)),
    rate4xx: safeRate(element.data(trafficType.RATE4XX)),
    rate5xx: safeRate(element.data(trafficType.RATE5XX)),
    rateNoResponse: safeRate(element.data(trafficType.RATENORESPONSE))
  }
}

export function getAccumulatedTrafficRateHttp(elements) {
  return elements.reduce(
    (r, element) => {
      const elementTrafficRate = getTrafficRateHttp(element, EDGE_HTTP)
      r.rate += elementTrafficRate.rate
      r.rate3xx += elementTrafficRate.rate3xx
      r.rate4xx += elementTrafficRate.rate4xx
      r.rate5xx += elementTrafficRate.rate5xx
      r.rateNoResponse += elementTrafficRate.rateNoResponse
      return r
    },
    { rate: 0, rate3xx: 0, rate4xx: 0, rate5xx: 0, rateNoResponse: 0 }
  )
}
