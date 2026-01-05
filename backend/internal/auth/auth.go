package auth

import (
	"errors"
	"net/http"
	"strings"
)

func GetApiKey(header http.Header) (string, error) {
	key := header.Get("Authorization")
	if key == "" {
		return "", errors.New("no Authorization token found")
	}

	value := strings.Split(key, " ")
	if len(value) != 2 {
		return "", errors.New("invalid Token Format")
	}

	if value[0] != "ApiKey" {
		return "", errors.New("malformed Token Format")
	}

	return value[1], nil

}
