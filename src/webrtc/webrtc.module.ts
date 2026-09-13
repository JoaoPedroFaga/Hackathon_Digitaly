import { Module } from '@nestjs/common';
import { WebrtcGateway } from './webrtc.gateway.js';
import { TranscriptionModule } from '../transcription/transcription.module.js';

@Module({
  providers: [WebrtcGateway],
  exports: [WebrtcGateway],
  imports: [TranscriptionModule],
})
export class WebrtcModule {}
