package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	runtime := flag.String(
		"runtime",
		"docker",
		"container runtime to use: docker or podman",
	)

	flag.Parse()

	if *runtime != "docker" && *runtime != "podman" {
		log.Fatalf("invalid runtime: %s (use docker or podman)", *runtime)
	}

	fmt.Printf("Fluxfeed dev using %s\n", *runtime)

	if err := runScript("scripts/setup-env.sh"); err != nil {
		log.Fatalf("env setup failed: %v", err)
	}

	if err := buildImage(*runtime); err != nil {
		log.Fatalf("image build failed: %v", err)
	}

	fmt.Println("Dev setup complete")
}

func runScript(scriptPath string) error {
	absPath, err := filepath.Abs(scriptPath)
	if err != nil {
		return err
	}

	fmt.Printf("▶ Running script: %s\n", absPath)

	cmd := exec.Command("bash", absPath)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Run()
}

func buildImage(runtime string) error {
	fmt.Println("Building Fluxfeed image")

	var cmd *exec.Cmd

	if runtime == "docker" {
		cmd = exec.Command(
			"docker",
			"build",
			"-t",
			"fluxfeed",
			".",
		)
	} else {
		cmd = exec.Command(
			"podman",
			"build",
			"-t",
			"fluxfeed",
			".",
		)
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Run()
}
