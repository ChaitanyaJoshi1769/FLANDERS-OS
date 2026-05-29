import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollaborationService } from './collaboration.service';

@WebSocketGateway({
  namespace: 'collaboration',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class CollaborationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map();

  constructor(private collaborationService: CollaborationService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.activeUsers.set(userId, client.id);
    this.server.emit('userOnline', { userId, timestamp: new Date() });
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.activeUsers.delete(userId);
    this.server.emit('userOffline', { userId, timestamp: new Date() });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, data: any) {
    const message = await this.collaborationService.sendMessage(
      data.organizationId,
      data,
    );
    this.server.emit('messageReceived', message);
  }

  @SubscribeMessage('incidentUpdate')
  async handleIncidentUpdate(client: Socket, data: any) {
    this.server.emit('incidentUpdated', data);
  }

  @SubscribeMessage('missionUpdate')
  async handleMissionUpdate(client: Socket, data: any) {
    this.server.emit('missionUpdated', data);
  }

  @SubscribeMessage('fleetStatus')
  async handleFleetStatus(client: Socket, data: any) {
    this.server.emit('fleetStatusChanged', data);
  }

  broadcastNotification(notification: any) {
    this.server.emit('notification', notification);
  }

  broadcastIncidentAlert(alert: any) {
    this.server.emit('incidentAlert', alert);
  }

  broadcastMissionProgress(progress: any) {
    this.server.emit('missionProgress', progress);
  }
}
