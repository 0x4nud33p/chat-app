import type { Server as HTTPServer } from 'http';
import type { Server as SocketIOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: {
    server: SocketServer;
  };
}