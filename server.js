// const net = require("node:net");
// const chalk = require("chalk")
import net from "node:net"
import chalk from "chalk"; //could not use require() for chalk

const PORT = 4020;
const HOST = "127.0.0.1";

const server = net.createServer();

// Storing all the clients in an array
let clients = [];

server.on("connection", async (socket) => { //On each conncetion a new socket is created
  console.log(chalk.bgGrey(chalk.white(`>connections status: ${clients.length + 1} ${clients.length > 1 ? "people are" : "person is" } connected to the server!`)));

  let clientUserName;

  socket.on("data", (data) => {
    const dataString = data.toString("utf-8");
    if ( dataString.substring(0,16) == "clientUserName- "){
        clientUserName =  dataString.substring(16) // clientUserName-  has 16 characters
        socket.write(`<-- ${chalk.green("welcome " + clientUserName + "!")} -->`)
     return clients.filter((s)=>s !== socket).forEach((s) => {
            s.write(`<--- ${chalk.green(clientUserName)} has joined the chat! --->`);
          });

    }
     return clients.forEach((socket) => {
          socket.write(`${chalk.bgWhite(chalk.black(chalk.bold(chalk.overline(clientUserName))))}: ${dataString}`);
        });

  });

  socket.on('error',(err)=>{   //Can't use end event because of this err  --> read ECONNRESET
      clients.splice(clients.indexOf(socket),1)
      console.log(chalk.bgGrey(chalk.white(`>connections status: ${clients.length} ${clients.length > 1 ? "people are" : "person is" } connected to the server!`)));
    return clients.forEach((socket) => {
        socket.write(`<-- ${chalk.red((clientUserName)) ?? "someone without a username"} is disconnected! -->`);
      });
    })

  clients.push(socket);
});

server.listen(PORT, HOST, () => {
  console.log(chalk.green("successfully started the server at the following address"), server.address());
});