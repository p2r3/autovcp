# autovcp
Automatic voidclip pause tool for Portal 2, capable of getting consistent 0-tick voidclip pauses for removing demo delay from segmented runs. Tested with vanilla Portal 2 on Windows and Linux, and with Mel on Windows.

## Please note!
This tool is now deprecated. SAR 1.13.6 has a built-in `sar_auto_voidclip_pause` command, which accomplishes exactly the same thing. Still, the code here remains a good reference for how to hack together external Portal 2 scripts.

## Usage
1. Start Portal 2 with the `-netconport 22333` launch option
2. Download the [latest release binary](https://github.com/p2r3/autovcp/releases) (that's the .exe file if you're on Windows) and run it
3. Make sure you're recording demos with `sar_autorecord 1`
4. Bind a key in-game to `echo load quick [autovcp]` (replace `load quick` with whatever load command you need)

When this key is pressed, the program should automatically run the specified command and perform a perfect voidclip pause. Please note that unless the key you bound is a function key (F1-F12), it won't work with the game paused. The program itself doesn't care, and will automatically close the console if it's open before the pausing routine begins.

This should be obvious, but **using this for any% speedruns is illegal**.

## Compiling
If you don't want to trust a binary from the internet, you can compile the project yourself, or even run it without compilation. This is a very simple JavaScript application built with the [Bun runtime](https://bun.sh/), which is why the output binaries are so large.

- To build the project from a Linux host for both platforms, run the build script `build.sh`.
- To build on/for other platforms, follow the [Bun documentation](https://bun.sh/docs/bundler/executables) for single-file executables.
- To run it without compiling, run `bun run main.js`. There are no other dependencies.
