const SOCKET_ADDRESS = "127.0.0.1";
const SOCKET_PORT = 22333;

let consoleOutput = "";
let routineRunning = false;

function setup (command, socket) {

  routineRunning = true;

  console.log(`Enabling extra console spew...`);
  socket.write("developer 1;ui_gameui_debug 1\n");

  console.log(`Setting SAR load preset...`);
  socket.write("sar_fast_load_preset sla\n");

  console.log("Ensuring console is hidden...");
  socket.write("hideconsole\n");

  setTimeout(function () {
    console.log(`Running input command "${command}"...\n`);
    socket.write(command + "\n");
  }, 1000);

}

function dataHandler (socket, data) {

  consoleOutput += data.toString();

  if (!routineRunning) {

    if (consoleOutput.includes("[autovcp]")) {
      const command = consoleOutput.slice(0, consoleOutput.indexOf("[autovcp]")).split("\r\n").pop();
      consoleOutput = "";

      console.log("Input received, running setup...");
      setup(command, socket);
      return;
    }

    return;
  }

  if (consoleOutput.includes("state = 3")) {
    console.log("Encountered first trigger.");

    consoleOutput = consoleOutput.slice(consoleOutput.indexOf("state = 3") + 1);
    socket.write("toggleconsole\n");
    return;
  }

  if (consoleOutput.includes("state = 5")) {
    console.log("Encountered second trigger.");

    consoleOutput = consoleOutput.slice(consoleOutput.indexOf("state = 5") + 1);
    socket.write("toggleconsole\n");
  }

  if (consoleOutput.includes("[GAMEUI] OnOpen")) {
    console.log("Encountered third trigger.");

    consoleOutput = consoleOutput.slice(consoleOutput.indexOf("[GAMEUI] OnOpen") + 1);
    socket.write("toggleconsole\n");
    return;
  }

  if (consoleOutput.includes("[GAMEUI] CBaseModPanel::OnGameUIHidden()\r\n[GAMEUI] CBaseModPanel::OnFrameClosed( 2, 14 )")) {
    console.log("Encountered fourth trigger.");

    consoleOutput = "";
    socket.write("toggleconsole\n");

    console.log("\nRoutine finished.");
    console.log("Disabling extra console spew...\n");
    socket.write("ui_gameui_debug 0\n");
    routineRunning = false;
  }

}

function connectHandler (socket) {

  console.log("Connected to game instance.\n");
  console.log(`Bind a key to "echo load quick [autovcp]"\nPressing this key will run the specified command and attempt to perform a perfect voidclip pause.\n`);

}

console.log(`Connecting to ${SOCKET_ADDRESS}:${SOCKET_PORT}...`);

const socket = await Bun.connect({
  hostname: SOCKET_ADDRESS,
  port: SOCKET_PORT,
  socket: {
    data: dataHandler,
    open: connectHandler,

    close (socket) { console.log("Connection closed.") },
    error (socket, error) { console.error("Socket error:", error) },
    connectError (socket, error) { console.error("Connection failed:", error) },
    end (socket) { console.log("Connection closed by server.") },
    timeout (socket) { console.error("Connection timed out.") }
  }
});
