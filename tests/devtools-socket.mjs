import net from 'node:net';
import {randomBytes} from 'node:crypto';
// Small local-only WebSocket transport for the Chrome DevTools test connection.
// Avoids external packages and supports text, continuation, close and ping frames.
export class DevToolsSocket {
 constructor(url){
  const u=new URL(url);if(u.protocol!=='ws:'||u.hostname!=='127.0.0.1')throw Error('Only loopback DevTools connections are allowed.');
  this.buffer=Buffer.alloc(0);this.fragments=[];this.handshake=false;
  this.socket=net.createConnection({host:u.hostname,port:Number(u.port)},()=>{
   this.socket.write(`GET ${u.pathname} HTTP/1.1\r\nHost: ${u.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: ${randomBytes(16).toString('base64')}\r\nSec-WebSocket-Version: 13\r\n\r\n`);
  });
  this.socket.on('error',error=>this.onerror?.(error));
  this.socket.on('close',()=>this.onclose?.({code:1006}));
  this.socket.on('data',chunk=>{this.buffer=Buffer.concat([this.buffer,chunk]);
   if(!this.handshake){const end=this.buffer.indexOf('\r\n\r\n');if(end<0)return;const header=this.buffer.subarray(0,end).toString();if(!header.startsWith('HTTP/1.1 101')){this.onerror?.(Error(header));return;}this.buffer=this.buffer.subarray(end+4);this.handshake=true;this.onopen?.();}
   while(this.buffer.length>=2){const first=this.buffer[0],second=this.buffer[1];let length=second&127,offset=2;
    if(length===126){if(this.buffer.length<4)return;length=this.buffer.readUInt16BE(2);offset=4;}
    else if(length===127){if(this.buffer.length<10)return;length=Number(this.buffer.readBigUInt64BE(2));offset=10;}
    const masked=!!(second&128);if(masked)offset+=4;if(this.buffer.length<offset+length)return;
    const payload=Buffer.from(this.buffer.subarray(offset,offset+length));if(masked)for(let i=0;i<length;i++)payload[i]^=this.buffer[offset-4+(i%4)];this.buffer=this.buffer.subarray(offset+length);
    const opcode=first&15;if(opcode===8){this.close();return;}if(opcode===9){this.frame(payload,10);continue;}if(opcode===1||opcode===0){this.fragments.push(payload);if(first&128){const data=Buffer.concat(this.fragments).toString();this.fragments=[];this.onmessage?.({data});}}
   }
  });
 }
 frame(data,opcode=1){const payload=Buffer.from(data),mask=randomBytes(4);let header;if(payload.length<126){header=Buffer.alloc(2);header[1]=128|payload.length;}else if(payload.length<65536){header=Buffer.alloc(4);header[1]=128|126;header.writeUInt16BE(payload.length,2);}else{header=Buffer.alloc(10);header[1]=128|127;header.writeBigUInt64BE(BigInt(payload.length),2);}header[0]=128|opcode;const encoded=Buffer.from(payload);for(let i=0;i<encoded.length;i++)encoded[i]^=mask[i%4];this.socket.write(Buffer.concat([header,mask,encoded]));}
 send(data){this.frame(data);}
 close(){this.socket.destroy();}
}
