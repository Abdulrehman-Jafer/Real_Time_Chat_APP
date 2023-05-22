// const net = require("node:net");
// const readline = require("node:readline/promises");
import net from "node:net"
import readline from "node:readline/promises"
import chalk from "chalk";


const PORT = 4020;
const HOST = "127.0.0.1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const moveCursor = (dx, dy) => { //just converting these two method into promise from callback
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};


const removeAboveLine = async () => {
    await moveCursor(0,-1)
    await clearLine(0)
}

let clientUserName = ""

const ask = async () => {
    let message = await rl.question(chalk.italic("Enter a message > "));
    while(message.trim() == ""){
        await removeAboveLine()
        console.log(chalk.redBright("<--- can't send the empty message! --->"))
        message = await rl.question(chalk.italic("Enter a message > "))
    }
    await removeAboveLine()
    socket.write(message);
  };

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to the server!");
  clientUserName = await rl.question(chalk.italic("Give us a name > "))
  while(clientUserName.trim() == ""){
      await removeAboveLine()
      console.log(chalk.redBright("<-- Please specify a name! -->"))
      clientUserName = await rl.question(chalk.italic("Give us a name > "))
  }
  socket.write(`clientUserName- ${clientUserName}`)
  await removeAboveLine()
  ask();
});

socket.on("data", async (chunk) => {
    console.log();
    await removeAboveLine()
    const stringData = chunk.toString("utf-8")
    console.log(stringData);
    ask();
  })
