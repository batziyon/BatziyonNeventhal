// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({
//   cors: {
//     origin: "*", // או הכתובת של ה-React שלך, למשל: "http://localhost:5173"
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ['polling', 'websocket'] // חשוב: מאפשר לשדרג מ-polling ל-websocket
// })
// export class LocationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   // ... שאר הקוד שסידרנו קודם
  
//   @WebSocketServer()
//   server!: Server;

//   // פונקציה שרצה ברגע שה-Gateway עולה
//   afterInit(server: Server) {
//     console.log('🚀 שרת ה-WebSockets הופעל ומוכן להפצה!');
//   }

//   // פונקציה שרצה בכל פעם שמישהו (מורה או תלמידה) מתחבר
//   handleConnection(client: Socket) {
//     console.log(`✅ לקוח התחבר: ${client.id}`);
//   }

//   // פונקציה שרצה כשמישהו סוגר את הדף או מתנתק
//   handleDisconnect(client: Socket) {
//     console.log(`❌ לקוח התנתק: ${client.id}`);
//   }

//   /**
//    * הפצת מיקום תלמידה לכל המאזינים
//    */
//   emitLocationUpdate(locationData: any) {
//     if (!this.server) {
//       console.error('❌ שגיאה: ניסיון לשלוח מיקום תלמידה לפני שה-Socket מוכן');
//       return;
//     }
    
//     this.server.emit('locationUpdated', locationData);
//     console.log('📍 הופץ מיקום תלמידה:', locationData.studentName || 'ללא שם');
//   }

//   /**
//    * הפצת מיקום מורה לכל המאזינים
//    */
//   emitTeacherLocationUpdate(teacherData: any) {
//     if (!this.server) {
//       console.error('❌ שגיאה: ניסיון לשלוח מיקום מורה לפני שה-Socket מוכן');
//       return;
//     }

//     this.server.emit('teacherLocationUpdated', teacherData);
//     console.log('👩‍🏫 הופץ מיקום מורה:', teacherData.userName || teacherData.teacherId);
//   }
// }