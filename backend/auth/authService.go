package auth

import (
	"errors"
	"os"

	h "dashboard/helpers"
	m "dashboard/models"
	r "dashboard/repositories"
)

var roleRepository r.RoleRepository = r.RoleRepository{}
var userRepository r.UserRepository = r.UserRepository{}

var JWT_SECRET_KEY = os.Getenv("JWT_SECRET_KEY")

func LoginService(loginRequest LoginRequest) (string, error) {
	h.GetSells()

	user, err := userRepository.GetUserByUsername(loginRequest.Username)

	if err != nil {
		return "Failed to login", err
	}

	if h.VerifyPassword(loginRequest.Password, user.Password) {
		role, err := roleRepository.GetRoleByID(user.RoleID)

		if err != nil {
			return "Failed to login", err
		}

		exp := 120 //time in minutes

		token, err := h.GetToken(user.Username, role.Name, exp)

		if err != nil {
			return "Failed to login", err
		}

		return token, nil
	}

	return "Failed to login", errors.New("Invalid Credentials")
}

func RegisterService(registerRequest RegisterRequest) (string, error) {
	if _, err := userRepository.GetUserByUsername(registerRequest.Username); err == nil {
		return "User already exists", err
	}

	var user m.User

	user.Name = registerRequest.Name
	user.LastName = registerRequest.LastName
	user.SecondLastName = registerRequest.LastName
	user.Username = registerRequest.Username
	user.Rut = registerRequest.Rut
	user.DV = registerRequest.DV
	user.RoleID = registerRequest.RoleID
	user.LocaleID = registerRequest.LocaleID

	hashPass, err := h.HashPassword(registerRequest.Password)
	if err != nil {
		return "Failed to register", err
	}

	user.Password = hashPass

	err = userRepository.CreateUser(user)

	if err != nil {
		return "Failed to register", err
	}

	return "User registered correctly", nil
}
