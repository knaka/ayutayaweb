package ayutayasvr

import (
	"context"
	"errors"
	"time"

	"github.com/swaggest/rest/web"
	"github.com/swaggest/usecase"
	"github.com/swaggest/usecase/status"
)

func init() {
	addRegistrar(func(svc *web.Service) {
		svc.Post("/login", usecase.NewInteractor(func(
			_ context.Context,
			in *struct {
				Name     string `json:"name" required:"true" default:"admin"`
				Password string `json:"password" required:"true" default:"password"`
			},
			out *struct {
				Token     string    `json:"token"`
				ExpiresAt time.Time `json:"expires_at"`
				Message   string    `json:"message"`
				SetCookie string    `header:"Set-Cookie" json:"-"`
			},
		) error {
			if in.Name == "" || in.Password == "" {
				return status.Wrap(errors.New("name and password are required"), status.InvalidArgument)
			}
			if in.Name == "admin" && in.Password == "password" {
				token := "dummy-jwt-token-" + time.Now().Format("20060102150405")
				expiresAt := time.Now().Add(24 * time.Hour)

				out.Token = token
				out.ExpiresAt = expiresAt
				out.Message = "Login successful"
				out.SetCookie = "token=" + token + "; Path=/; HttpOnly; Expires=" + expiresAt.UTC().Format(time.RFC1123)
				return nil
			}
			return status.Wrap(errors.New("invalid credentials"), status.Unauthenticated)
		}))
		svc.Post("/logout", usecase.NewInteractor(func(
			_ context.Context,
			in *struct {
				Token string `header:"Cookie" required:"true"`
			},
			out *struct {
				Message   string `json:"message"`
				SetCookie string `header:"Set-Cookie" json:"-"`
			},
		) error {
			if in.Token == "" {
				return status.Wrap(errors.New("authorization token is required"), status.InvalidArgument)
			}
			out.Message = "Logout successful"
			out.SetCookie = "token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 UTC"
			return nil
		}))
	})
}
