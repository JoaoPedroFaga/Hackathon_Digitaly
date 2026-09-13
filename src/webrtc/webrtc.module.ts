import { Module } from '@nestjs/common';
import { WebrtcGateway } from './webrtc.gateway.js';

@Module({
  providers: [WebrtcGateway],
  exports: [WebrtcGateway],
})
export class WebrtcModule {}
