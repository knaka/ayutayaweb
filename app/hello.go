package ayutayasvr

import (
	"context"
	"errors"
	"fmt"

	"github.com/swaggest/rest/web"
	"github.com/swaggest/usecase"
	"github.com/swaggest/usecase/status"
)

type authStruct struct {
	Token string `json:"token" required:"true"`
}

func hello(
	_ context.Context,
	in *struct {
		authStruct
		Name string `json:"name" minLength:"3" required:"true"`
	},
	out *struct {
		Message string `json:"message"`
	},
) error {
	if in.Token != "VALID_TOKEN" {
		return status.Wrap(errors.New("Invalid Token"), status.Unauthenticated)
	}
	out.Message = fmt.Sprintf("Hello, %s!", in.Name)
	return nil
}

func init() {
	addRegistrar(func(svc *web.Service) {
		svc.Post("/hello", usecase.NewInteractor(hello))
	})
}
