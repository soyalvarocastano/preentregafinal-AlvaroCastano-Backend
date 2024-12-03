import { Server } from 'socket.io';

export function initializeSocket(httpServer) {
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        console.log(`Cliente conectdado: ${socket}`);
        
        socket.on('allProducts', (data) => {
            console.log("data", data);
          
            const y = data;
             
        });
        
        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });
    });

    return io;
}