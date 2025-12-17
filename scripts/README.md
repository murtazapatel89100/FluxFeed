# Scripts Documentation

This directory contains helper scripts for setting up and managing the FluxFeed development environment.

## Quick Start Options

### Option 1: Automated DX Experience (Recommended)

For a complete automated development experience, download the `setup-env` binary from the [go-utils](https://github.com/murtazapatel89100/go-utils) repository - a comprehensive Go CLI suite with cross-platform support.

The `setup-env` utility automates environment setup and configuration across all platforms (Linux, macOS, Windows).

### Option 2: Download FluxFeed Binary from Releases

The easiest way to get started is to download the pre-built `fluxfeed` binary from the [FluxFeed Releases](https://github.com/murtazapatel89100/FluxFeed/releases) page.

The binary automates everything:
- **Environment setup** - Configures `.env` file with database credentials
- **Container management** - Runs PostgreSQL container
- **Application startup** - Launches FluxFeed on your chosen runtime

**Requirements:**
- The `setup-env` script must be present in the `scripts/` folder for the binary to function properly

**Supports:**
- Docker
- Podman

Simply download the binary for your platform:
- `fluxfeed-linux` - Linux x64
- `fluxfeed-macos-intel` - macOS Intel
- `fluxfeed-macos-apple` - macOS Apple Silicon (M1/M2/M3)
- `fluxfeed-windows.exe` - Windows x64

Then run:
```bash
./fluxfeed-linux --runtime docker    # or podman
```

### Option 3: Manual Setup

If you prefer manual setup, run the scripts individually:

```bash
# Setup environment variables
bash scripts/setup-env.sh

# Build and run with Docker or Podman
docker-compose up
# or
podman-compose up
```

## Available Scripts

- `setup-env.sh` - Creates `.env` file with default PostgreSQL configuration (Linux only)

## Platform Considerations

These shell scripts are designed for **Linux** environments. For cross-platform support and advanced automation, use:
- The `fluxfeed` binary from releases
- The `setup-env` utility from [go-utils](https://github.com/murtazapatel89100/go-utils)
